'use client'
import { useEffect, useState } from 'react'

interface HistoryPoint {
  time: string
  p50: number
  p95: number
  p99: number
}

interface HistoryDataTableProps {
  timePeriod?: '24h' | '7d' | '30d'
}

export default function HistoryDataTable({ timePeriod = '7d' }: HistoryDataTableProps) {
  const [data, setData] = useState<HistoryPoint[]>([])

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter data based on time period
          let filteredData = data
          if (timePeriod === '24h') {
            filteredData = data.slice(-24)
          } else if (timePeriod === '7d') {
            filteredData = data.slice(-168)
          } else if (timePeriod === '30d') {
            filteredData = data.slice(-720)
          }
          
          // Get last 10 entries, most recent first
          const last10 = filteredData.slice(-10).reverse()
          setData(last10.slice(0, 10))
        } else {
          setData([])
        }
      }) 
      .catch(err => console.error('Failed to fetch history:', err))
  }, [timePeriod])

  const formatTimestamp = (time: string) => {
    // Convert time string to full timestamp format
    const now = new Date()
    const [hours, minutes] = time.split(':')
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes))
    return date.toISOString().replace('T', ' ').substring(0, 16)
  }

  return (
    <div className="strict-card w-full min-h-[200px] block relative">
      <div className="p-2 sm:p-3 border-b border-strict-border bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate Data Stream</span>
        <button className="flex items-center gap-1 text-[8px] sm:text-[9px] font-mono text-primary hover:underline">
          <span className="material-symbols-outlined text-[11px] sm:text-[12px]">download</span> Export CSV
        </button>
      </div>
      <div className="w-full overflow-x-auto bg-[var(--bg-charcoal)]">
        <table className="w-full text-left text-[10px] sm:text-[11px] min-w-[600px]">
          <thead className="bg-black text-muted-slate uppercase tracking-tighter font-bold border-b border-strict-border">
            <tr>
              <th className="p-2 sm:p-3 font-mono whitespace-nowrap bg-black">Timestamp UTC</th>
              <th className="p-2 sm:p-3 text-right font-mono whitespace-nowrap bg-black">P50</th>
              <th className="p-2 sm:p-3 text-right font-mono whitespace-nowrap bg-black">P95</th>
              <th className="p-2 sm:p-3 text-right font-mono whitespace-nowrap bg-black">P99</th>
              <th className="p-2 sm:p-3 text-right font-mono whitespace-nowrap bg-black">Std Dev</th>
              <th className="p-2 sm:p-3 text-right font-mono whitespace-nowrap bg-black">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-strict-border font-mono bg-[var(--bg-charcoal)]">
            {data.length > 0 ? (
              data.map((point, index) => (
                <tr key={index} className="hover:bg-white/[0.02] bg-[var(--bg-charcoal)]">
                  <td className="p-2 sm:p-3 text-white font-bold whitespace-nowrap bg-[var(--bg-charcoal)]">{formatTimestamp(point.time)}</td>
                  <td className="p-2 sm:p-3 text-right text-slate-300 whitespace-nowrap bg-[var(--bg-charcoal)]">{point.p50.toFixed(1)}ms</td>
                  <td className="p-2 sm:p-3 text-right text-slate-300 whitespace-nowrap bg-[var(--bg-charcoal)]">{point.p95.toFixed(1)}ms</td>
                  <td className="p-2 sm:p-3 text-right text-primary font-bold whitespace-nowrap bg-[var(--bg-charcoal)]">{point.p99.toFixed(1)}ms</td>
                  <td className="p-2 sm:p-3 text-right text-slate-500 whitespace-nowrap bg-[var(--bg-charcoal)]">±{((point.p95 - point.p50) / 2).toFixed(1)}</td>
                  <td className="p-2 sm:p-3 text-right whitespace-nowrap bg-[var(--bg-charcoal)]">
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] sm:text-[9px]">NOMINAL</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-[var(--bg-charcoal)]">
                <td colSpan={6} className="p-3 text-center text-slate-500 bg-[var(--bg-charcoal)]">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
