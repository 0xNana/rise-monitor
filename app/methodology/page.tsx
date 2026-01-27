import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function MethodologyPage() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <header className="mb-12 border-b border-strict-border pb-8">
              <div className="flex items-center gap-2 text-primary mb-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em]">Specifications // Core</span>
              </div>
              <h1 className="text-4xl mb-4 font-bold text-white uppercase tracking-tight">Measurement Methodology</h1>
              <p className="text-muted-slate text-lg leading-relaxed max-w-2xl">
                Detailed technical documentation regarding the sampling frequency, execution environment, and mathematical processing of latency metrics within the RISE infrastructure.
              </p>
            </header>

            <section className="border-b border-strict-border pb-12 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-muted-slate">01.</span>
                <h2 className="text-xl uppercase tracking-tight font-bold text-white">Measurement Mode</h2>
              </div>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  RISE Monitor utilizes <span className="text-white font-medium">Inclusion-Level Execution</span> monitoring. This measures the delta between transaction broadcast and state inclusion within the canonical ledger using native synchronous RPC methods.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="strict-card p-4">
                    <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Execution Method</h4>
                    <p className="text-sm text-slate-300">Uses <code className="text-primary font-mono">eth_sendRawTransactionSync</code> (EIP-7966) for RISE testnet, providing pure protocol execution time without polling overhead.</p>
                  </div>
                  <div className="strict-card p-4">
                    <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Measurement Precision</h4>
                    <p className="text-sm text-slate-300">All timestamps use <code className="text-primary font-mono">time.perf_counter()</code> for sub-millisecond precision, ensuring accurate latency measurements.</p>
                  </div>
                </div>
                <div className="mt-6 strict-card p-4">
                  <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">What Gets Measured</h4>
                  <p className="text-sm text-slate-300 mb-2">Inclusion mode measures: <span className="text-white font-medium">Send → Native sync receipt</span></p>
                  <p className="text-xs text-muted-slate">The measurement starts when the transaction is sent and ends when the native sync RPC method returns the receipt. This excludes transaction building, signing overhead, and receipt polling, providing pure protocol execution time.</p>
                </div>
              </div>
            </section>

            <section className="border-b border-strict-border pb-12 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-muted-slate">02.</span>
                <h2 className="text-xl uppercase tracking-tight font-bold text-white">Transaction Workload</h2>
              </div>
              <p className="mb-6 text-slate-300 leading-relaxed">
                RISE Monitor uses <span className="text-white font-medium">Burst Load Testing</span> with simple state writes (increment counter). Transactions are sent back-to-back with zero delay to measure how RISE handles sustained throughput under maximum load conditions.
              </p>
              <div className="strict-card p-4 mb-6">
                <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Burst Load Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Function: <code className="text-primary font-mono">increment()</code></p>
                    <p className="text-xs text-muted-slate">Basic counter increment operation</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Delay: <code className="text-primary font-mono">0ms</code></p>
                    <p className="text-xs text-muted-slate">Back-to-back transactions (burst mode)</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Gas Limit: <code className="text-primary font-mono">100,000</code></p>
                    <p className="text-xs text-muted-slate">Standard gas allocation</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Purpose: <span className="text-white font-medium">Sustained Throughput</span></p>
                    <p className="text-xs text-muted-slate">Tests network capacity under maximum load</p>
                  </div>
                </div>
              </div>
              <div className="bg-black border border-strict-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-strict-border/30 border-b border-strict-border">
                  <span className="text-[10px] font-mono text-muted-slate uppercase tracking-widest">LatencyTest.sol</span>
                  <div className="flex gap-1.5">
                    <div className="size-2 bg-red-900/50"></div>
                    <div className="size-2 bg-yellow-900/50"></div>
                    <div className="size-2 bg-green-900/50"></div>
                  </div>
                </div>
                <pre className="p-6 text-sm font-mono text-emerald-500/80 leading-relaxed overflow-x-auto"><code>{`contract LatencyTest {
    uint256 public counter;
    
    function increment() public {
        counter++;
    }
}`}</code></pre>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="strict-card p-4">
                  <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Network</h4>
                  <p className="text-sm text-slate-300 font-mono">RISE Testnet</p>
                  <p className="text-xs text-muted-slate mt-1">testnet.riselabs.xyz</p>
                </div>
                <div className="strict-card p-4">
                  <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Contract Address</h4>
                  <p className="text-sm text-slate-300 font-mono break-all">0x11642286f8FC63c9b99A91087e4d954D4A062690</p>
                </div>
                <div className="strict-card p-4">
                  <h4 className="text-[11px] font-bold text-muted-slate uppercase mb-2">Collection Parameters</h4>
                  <p className="text-sm text-slate-300">10 transactions per collection</p>
                  <p className="text-xs text-muted-slate mt-1">Burst mode: 0ms delay (back-to-back)</p>
                </div>
              </div>
            </section>

            <section className="border-b border-strict-border pb-12 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-muted-slate">03.</span>
                <h2 className="text-xl uppercase tracking-tight font-bold text-white">Sampling</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="mb-4 text-slate-300 leading-relaxed">
                    The monitor performs continuous burst load testing by sending <span className="text-white font-medium">10 transactions back-to-back</span> every hour. This measures how RISE handles sustained throughput under maximum load conditions. Each burst collection provides sufficient data density for percentile calculation (P50, P95, P99).
                  </p>
                  <ul className="space-y-3 text-sm list-none border-l border-strict-border pl-6 py-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-mono">▸</span>
                      <span className="text-slate-300"><strong className="text-white">Collection Frequency:</strong> Hourly (every 60 minutes).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-mono">▸</span>
                      <span className="text-slate-300"><strong className="text-white">Sample Size:</strong> 10 transactions sent back-to-back (burst mode, 0ms delay).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-mono">▸</span>
                      <span className="text-slate-300"><strong className="text-white">Aggregation:</strong> Hourly data points with 24-hour retention.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-mono">▸</span>
                      <span className="text-slate-300"><strong className="text-white">Error Handling:</strong> Failed transactions are excluded from latency calculations and logged separately.</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center p-6 strict-card">
                  <span className="text-primary text-3xl font-mono font-bold">10</span>
                  <span className="text-[10px] text-muted-slate uppercase font-bold text-center mt-2 tracking-tighter leading-tight">Samples / Collection</span>
                </div>
              </div>
            </section>

            <section className="border-b border-strict-border pb-12 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-muted-slate">04.</span>
                <h2 className="text-xl uppercase tracking-tight font-bold text-white">Metric Definitions</h2>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-primary uppercase tracking-widest">P50 (Median)</h3>
                  <p className="text-sm leading-relaxed text-slate-300">The value for which 50% of the sample set falls below. This represents the typical experience for a standard transaction under normal network conditions.</p>
                  <div className="font-mono text-[11px] bg-black/40 p-3 text-muted-slate border border-strict-border">
                    F(x) = P(X ≤ x) = 0.5
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-primary uppercase tracking-widest">P95 (95th Percentile)</h3>
                  <p className="text-sm leading-relaxed text-slate-300">95% of transactions complete within this time. This metric helps identify performance degradation and network congestion patterns.</p>
                  <div className="font-mono text-[11px] bg-black/40 p-3 text-muted-slate border border-strict-border">
                    F(x) = P(X ≤ x) = 0.95
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-mono text-primary uppercase tracking-widest">P99 (99th Percentile)</h3>
                  <p className="text-sm leading-relaxed text-slate-300">Critical threshold representing the worst-case scenario (1 out of 100 transactions). High P99 values typically indicate network congestion or poor peer-to-peer gossip performance. This is the most important metric for understanding tail latency.</p>
                  <div className="font-mono text-[11px] bg-black/40 p-3 text-muted-slate border border-strict-border">
                    F(x) = P(X ≤ x) = 0.99
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-12 p-8 border border-strict-border bg-black">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-emerald-500 text-sm">verified_user</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Data Source</h3>
              </div>
              <p className="text-xs text-muted-slate mb-4 font-mono">This monitoring system uses the same measurement methodology as the comprehensive RISE vs MegaETH benchmark suite:</p>
              <div className="font-mono text-[13px] text-slate-300 space-y-1">
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none">1</span>
                  <span><span className="text-purple-400">Method:</span> <span className="text-emerald-400">eth_sendRawTransactionSync</span> (EIP-7966)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none">2</span>
                  <span><span className="text-purple-400">Mode:</span> <span className="text-emerald-400">Inclusion</span> (protocol-level execution)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none">3</span>
                  <span><span className="text-purple-400">Workload:</span> <span className="text-emerald-400">Burst load</span> (back-to-back transactions, 0ms delay)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none">4</span>
                  <span><span className="text-purple-400">Sample Size:</span> <span className="text-emerald-400">10 transactions per collection cycle</span> (collected hourly)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-600 select-none">5</span>
                  <span><span className="text-purple-400">Metrics:</span> <span className="text-emerald-400">P50, P95, P99</span> latency percentiles</span>
                </div>
              </div>
            </section>

            <footer className="mt-24 pt-8 border-t border-strict-border flex justify-between items-center text-[10px] text-muted-slate font-mono uppercase tracking-widest">
              <div>© 2026 RISE INFRASTRUCTURE</div>
              <div className="flex gap-6">
                <a href="https://twitter.com/0xelegant" className="hover:text-white transition-colors">Contact</a>
                <a href="../latency-test/README.md" className="hover:text-white transition-colors">Benchmark Suite</a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
