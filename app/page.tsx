import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import LatencyTrendsChart from '@/components/LatencyTrendsChart'
import MetricCards from '@/components/MetricCards'
import DataTable from '@/components/DataTable'

export default function Home() {
  return (
    <div className="flex h-full w-full observability-grid">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <LatencyTrendsChart />
          <MetricCards />
          <DataTable />
        </div>
        <div className="flex justify-end pt-2 pb-6 px-4">
          <span className="text-[10px] font-mono text-muted-slate uppercase tracking-tight opacity-70">
            SYNC: 12MS | HEARTBEAT: OK
          </span>
        </div>
        <footer className="h-8 border-t border-strict-border bg-black flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-6 text-[10px] font-mono text-muted-slate uppercase">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-emerald-500"></span>
              <span>RISE NODE SYNC: 100.00%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">query_stats</span>
              <span>RETENTION: 90D</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
              <span>STATUS</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted-slate uppercase">
            REPORT GEN UTC: {new Date().toISOString().replace('T', ' ').substring(0, 19)}
          </div>
        </footer>
      </main>
    </div>
  )
}
