'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import HistoryChart from '@/components/HistoryChart'
import HistoryDataTable from '@/components/HistoryDataTable'

export default function HistoryPage() {
  const [timePeriod, setTimePeriod] = useState<'24h' | '7d' | '30d'>('7d')
  
  return (
    <div className="flex h-full w-full bg-[var(--bg-deep)]">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[var(--bg-deep)]">
        <Header timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col gap-3 sm:gap-4">
          <HistoryChart timePeriod={timePeriod} />
          <HistoryDataTable timePeriod={timePeriod} />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 pb-4 sm:pb-6 border-t border-strict-border/30">
            <span className="text-[9px] sm:text-[10px] font-mono text-muted-slate uppercase tracking-tight opacity-70 italic">
              Calculated from hourly data points
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-muted-slate uppercase tracking-tight opacity-70">
              SYNC: 12MS | HEARTBEAT: OK
            </span>
          </div>
        </div>
        <footer className="h-auto sm:h-8 border-t border-strict-border bg-black flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-2 sm:py-0 z-10 shrink-0">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] font-mono text-muted-slate uppercase mb-2 sm:mb-0">
            <div className="flex items-center gap-2">
              <span className="size-1.5 bg-emerald-500"></span>
              <span className="whitespace-nowrap">RISE NODE SYNC: 100.00%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px] sm:text-[14px]">query_stats</span>
              <span>RETENTION: 90D</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px] sm:text-[14px]">signal_cellular_alt</span>
              <span>STATUS</span>
            </div>
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono text-muted-slate uppercase whitespace-nowrap">
            REPORT GEN UTC: {new Date().toISOString().replace('T', ' ').substring(0, 19)}
          </div>
        </footer>
      </main>
    </div>
  )
}
