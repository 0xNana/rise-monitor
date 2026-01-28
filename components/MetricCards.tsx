'use client'
import { useEffect, useState } from 'react'

interface Stats {
  p50: number
  p95: number
  p99: number
  updated: string
}

export default function MetricCards() {
  const [stats, setStats] = useState<Stats>({ p50: 0, p95: 0, p99: 0, updated: '' })

  useEffect(() => {
    fetch('/api/latest')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err))
  }, [])

  // Use actual stats or show 0 if not loaded
  const peakP99 = stats.p99 || 0
  const globalAvg = stats.p95 || 0
  const errorRate = 0.00
  const sampleCount = 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto">
      <div className="strict-card p-3 sm:p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-muted-slate uppercase">Peak P99</span>
          <span className="material-symbols-outlined text-[14px] text-primary">trending_up</span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-white font-mono">
          {peakP99 > 0 ? `${peakP99.toFixed(1)}` : '0'}<span className="text-[9px] sm:text-[10px] text-slate-500 ml-1">MS</span>
        </div>
        <div className="mt-2 h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-primary" style={{ width: '70%' }}></div>
        </div>
      </div>
      
      <div className="strict-card p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-muted-slate uppercase">Global Avg</span>
          <span className="material-symbols-outlined text-[14px] text-slate-500">equalizer</span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-white font-mono">
          {globalAvg > 0 ? `${globalAvg.toFixed(1)}` : '0'}<span className="text-[9px] sm:text-[10px] text-slate-500 ml-1">MS</span>
        </div>
        <div className="mt-2 h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-p95-purple" style={{ width: '45%' }}></div>
        </div>
      </div>
      
      <div className="strict-card p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-muted-slate uppercase">Error Rate</span>
          <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-white font-mono">
          {errorRate.toFixed(3)}<span className="text-[9px] sm:text-[10px] text-slate-500 ml-1">%</span>
        </div>
        <div className="mt-2 h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: '2%' }}></div>
        </div>
      </div>
      
      <div className="strict-card p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-muted-slate uppercase">Sample Count</span>
          <span className="material-symbols-outlined text-[14px] text-slate-500">database</span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-white font-mono">
          {sampleCount > 0 ? `${(sampleCount / 1000000).toFixed(1)}M` : '0'}<span className="text-[9px] sm:text-[10px] text-slate-500 ml-1">REQ</span>
        </div>
        <div className="mt-2 h-1 bg-white/5 overflow-hidden">
          <div className="h-full bg-slate-600" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  )
}
