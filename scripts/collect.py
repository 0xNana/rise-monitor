#!/usr/bin/env python3
"""
RISE Latency Data Collection Script
Measures RISE transaction latency and updates data files for the monitor dashboard.
"""

import json
import os
import sys
import time
import statistics
from datetime import datetime
from typing import List

try:
    from web3 import Web3
    from eth_account import Account
except ImportError:
    print("Error: web3 and eth-account packages required. Install with: pip install web3 eth-account")
    sys.exit(1)

# ---------------------------------------------------------------------
# Network config (RISE only)
# ---------------------------------------------------------------------
RISE_CONFIG = {
    "rpc": "https://testnet.riselabs.xyz",
    "contract": "0x11642286f8FC63c9b99A91087e4d954D4A062690",
    "sync_method": "eth_sendRawTransactionSync",
}

# ---------------------------------------------------------------------
# ABI (increment function only)
# ---------------------------------------------------------------------
ABI = [
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    }
]

# ---------------------------------------------------------------------
# Nonce Allocator
# ---------------------------------------------------------------------
class NonceAllocator:
    def __init__(self, web3: Web3, address: str):
        self.web3 = web3
        self.address = address
        self.next_nonce = None

    def initialize(self):
        self.next_nonce = self.web3.eth.get_transaction_count(
            self.address, block_identifier="latest"
        )

    def get(self) -> int:
        if self.next_nonce is None:
            raise RuntimeError("NonceAllocator not initialized")
        nonce = self.next_nonce
        self.next_nonce += 1
        return nonce

# ---------------------------------------------------------------------
# Native synchronous send
# ---------------------------------------------------------------------
def send_native_sync(w3: Web3, signed_tx) -> dict:
    method = RISE_CONFIG["sync_method"]
    
    if isinstance(signed_tx, bytes):
        raw_tx = Web3.to_hex(signed_tx)
    elif isinstance(signed_tx, str):
        raw_tx = signed_tx if signed_tx.startswith("0x") else "0x" + signed_tx
    else:
        raise TypeError(f"Invalid signed_tx type: {type(signed_tx)}")

    response = w3.provider.make_request(method, [raw_tx])

    if "error" in response:
        raise RuntimeError(f"RISE RPC error: {response['error']}")

    if response.get("result") is None:
        raise RuntimeError("RISE sync RPC returned no receipt")

    return response["result"]

# ---------------------------------------------------------------------
# Measure RISE latency
# ---------------------------------------------------------------------
def measure_rise_latency(num_txs: int = 10) -> dict:
    """
    Measure RISE transaction latency using inclusion mode with burst load.
    Sends transactions back-to-back (0ms delay) to test sustained throughput.
    Returns dict with p50, p95, p99 in milliseconds.
    """
    w3 = Web3(Web3.HTTPProvider(RISE_CONFIG["rpc"]))

    if not w3.is_connected():
        raise ConnectionError("Cannot connect to RISE testnet")

    if "PK" not in os.environ:
        raise ValueError("Environment variable PK not set (testnet wallet private key)")

    account = Account.from_key(os.environ["PK"])
    contract = w3.eth.contract(address=RISE_CONFIG["contract"], abi=ABI)

    allocator = NonceAllocator(w3, account.address)
    allocator.initialize()

    latencies: List[float] = []
    failed = 0

    fn = contract.functions.increment()
    chain_id = w3.eth.chain_id
    gas_price = w3.eth.gas_price
    gas = 100_000

    print(f"Measuring {num_txs} transactions in burst mode on RISE testnet...")

    for i in range(num_txs):
        try:
            tx = fn.build_transaction(
                {
                    "from": account.address,
                    "nonce": allocator.get(),
                    "gas": gas,
                    "gasPrice": gas_price,
                    "chainId": chain_id,
                }
            )
            signed = account.sign_transaction(tx)
            start = time.perf_counter()
            send_native_sync(w3, signed.raw_transaction)
            end = time.perf_counter()
            latency_ms = (end - start) * 1000
            latencies.append(latency_ms)
            print(f"  Transaction {i+1}/{num_txs}: {latency_ms:.2f}ms")
            # Burst mode: no delay between transactions
        except Exception as e:
            print(f"  Transaction {i+1}/{num_txs} failed: {e}")
            failed += 1

    if not latencies:
        raise RuntimeError("No successful transactions. Cannot calculate metrics.")

    # Calculate percentiles
    sorted_latencies = sorted(latencies)
    p50 = statistics.median(sorted_latencies)
    p95 = sorted_latencies[int(len(sorted_latencies) * 0.95)] if len(sorted_latencies) > 1 else sorted_latencies[0]
    p99 = sorted_latencies[int(len(sorted_latencies) * 0.99)] if len(sorted_latencies) > 1 else sorted_latencies[0]

    print(f"\nResults: P50={p50:.2f}ms, P95={p95:.2f}ms, P99={p99:.2f}ms")
    if failed > 0:
        print(f"Warning: {failed} transactions failed")

    return {
        "p50": round(p50, 0),
        "p95": round(p95, 0),
        "p99": round(p99, 0),
    }

# ---------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------
if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, "data")

    # Ensure data directory exists
    os.makedirs(data_dir, exist_ok=True)

    try:
        # Measure latency
        stats = measure_rise_latency(num_txs=10)

        # Update latest.json
        latest = {
            "p50": int(stats["p50"]),
            "p95": int(stats["p95"]),
            "p99": int(stats["p99"]),
            "updated": datetime.now().isoformat()
        }

        latest_path = os.path.join(data_dir, "latest.json")
        with open(latest_path, 'w') as f:
            json.dump(latest, f, indent=2)
        print(f"\n✓ Updated {latest_path}")

        # Update history.json
        history_path = os.path.join(data_dir, "history.json")
        history = []
        if os.path.exists(history_path):
            with open(history_path, 'r') as f:
                history = json.load(f)

        # Append new data point
        history.append({
            "time": datetime.now().strftime("%H:%M"),
            "p50": latest["p50"],
            "p95": latest["p95"],
            "p99": latest["p99"]
        })

        # Keep only last 24 hours (1440 minutes = 24 hours if hourly updates)
        history = history[-1440:]

        with open(history_path, 'w') as f:
            json.dump(history, f, indent=2)
        print(f"✓ Updated {history_path}")

        print("\n✅ Data collection complete!")

    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)
