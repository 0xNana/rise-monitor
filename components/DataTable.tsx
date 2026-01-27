'use client'
import { useEffect, useState } from 'react'

interface HistoryPoint {
  time: string
  p50: number
  p95: number
  p99: number
}

export default function DataTable() {
  const [data, setData] = useState<HistoryPoint[]>([])

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => setData(data.slice(-10).reverse())) 
      .catch(err => console.error('Failed to fetch history:', err))
  }, [])

  const formatTimestamp = (time: string) => {
    // Convert time string to full timestamp format
    const now = new Date()
    const [hours, minutes] = time.split(':')
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes))
    return date.toISOString().replace('T', ' ').substring(0, 16)
  }

  return (
    <div className="strict-card overflow-hidden md:col-span-2 lg:col-span-4">
      <div className="p-3 border-b border-strict-border bg-black/20 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate Data Stream</span>
        <button className="flex items-center gap-1 text-[9px] font-mono text-primary hover:underline">
          <span className="material-symbols-outlined text-[12px]">download</span> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-black text-muted-slate uppercase tracking-tighter font-bold border-b border-strict-border">
            <tr>
              <th className="p-3 font-mono">Timestamp UTC</th>
              <th className="p-3 text-right font-mono">P50</th>
              <th className="p-3 text-right font-mono">P95</th>
              <th className="p-3 text-right font-mono">P99</th>
              <th className="p-3 text-right font-mono">Std Dev</th>
              <th className="p-3 text-right font-mono">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-strict-border font-mono">
            {data.length > 0 ? (
              data.map((point, index) => (
                <tr key={index} className="hover:bg-white/[0.02]">
                  <td className="p-3 text-white font-bold">{formatTimestamp(point.time)}</td>
                  <td className="p-3 text-right text-slate-300">{point.p50.toFixed(1)}ms</td>
                  <td className="p-3 text-right text-slate-300">{point.p95.toFixed(1)}ms</td>
                  <td className="p-3 text-right text-primary font-bold">{point.p99.toFixed(1)}ms</td>
                  <td className="p-3 text-right text-slate-500">±{((point.p95 - point.p50) / 2).toFixed(1)}</td>
                  <td className="p-3 text-right">
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px]">NOMINAL</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-slate-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
