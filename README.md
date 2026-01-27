# RISE Latency Monitor

Real-time transaction latency tracking for RISE Chain.

## Features
- Live P50/P95/P99 metrics
- 24-hour historical data
- Updated every hour
- Based on real transactions

## Data Source
Continuous burst load testing: sends 10 transactions back-to-back every hour to measure how RISE handles sustained throughput. Latency measured using inclusion mode (protocol-level execution).

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 to see the dashboard.

### Data Collection

The data collection script runs automatically via GitHub Actions every hour. To run manually:

```bash
# Set your testnet private key (use a testnet-only wallet!)
export PK="your_testnet_private_key"

# Run collection script
python scripts/collect.py
```

⚠️ **Warning**: Never use a mainnet private key. Always use a testnet-only wallet.

## Roadmap
- [ ] Add MegaETH comparison
- [ ] Extend to 7-day history
- [ ] Add alerting system
- [ ] API access

Built by [@0xelegant](https://x.com/0xelegant)



