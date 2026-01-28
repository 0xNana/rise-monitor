'use client'
import { useEffect, useState } from 'react'

interface HistoryPoint {
  time: string
  p50: number
  p95: number
  p99: number
}

export default function LatencyTrendsChart() {
  const [data, setData] = useState<HistoryPoint[]>([])
  const [activeMetrics, setActiveMetrics] = useState({ p999: true, p95: true, p50: true })

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setData(data)
        } else {
          setData([])
        }
      })
      .catch(err => {
        console.error('Failed to fetch history:', err)
        setData([])
      })
  }, [])

  // Convert data to SVG path coordinates
  const maxLatency = 800
  const chartHeight = 400
  const chartWidth = 1000
  
  const getY = (value: number) => {
    const normalized = Math.min(value / maxLatency, 1)
    return chartHeight - (normalized * chartHeight)
  }
  const getX = (index: number) => {
    if (data.length <= 1) return 0
    return (index / (data.length - 1)) * chartWidth
  }

  // Generate smooth paths
  const generatePath = (values: number[]) => {
    if (values.length === 0) return ''
    if (values.length === 1) return `M0,${getY(values[0])} L${chartWidth},${getY(values[0])}`
    
    return values.map((value, i) => {
      const x = getX(i)
      const y = getY(value)
      return i === 0 ? `M${x},${y}` : `L${x},${y}`
    }).join(' ')
  }

  const p50Path = generatePath(data.map(d => d.p50))
  const p95Path = generatePath(data.map(d => d.p95))
  const p999Path = generatePath(data.map(d => d.p99))

  return (
    <section className="strict-card flex flex-col min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] shrink-0">
      <div className="p-2 sm:p-3 border-b border-strict-border bg-black/20 flex flex-wrap justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Latency Trends</span>
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0">
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p999: !activeMetrics.p999 })}
              className={`flex items-center gap-2 px-2 py-1 border ${activeMetrics.p999 ? 'bg-primary/10 border-primary/30' : 'border-strict-border opacity-40 hover:opacity-100'}`}
            >
              <span className="size-2 bg-primary"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p999 ? 'text-primary' : 'text-slate-500'}`}>P99.9</span>
            </button>
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p95: !activeMetrics.p95 })}
              className={`flex items-center gap-2 px-2 py-1 border ${activeMetrics.p95 ? 'bg-p95-purple/10 border-p95-purple/30' : 'border-strict-border opacity-40 hover:opacity-100'}`}
            >
              <span className="size-2 bg-p95-purple"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p95 ? 'text-p95-purple' : 'text-slate-500'}`}>P95</span>
            </button>
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p50: !activeMetrics.p50 })}
              className={`flex items-center gap-2 px-2 py-1 border ${activeMetrics.p50 ? 'bg-p50-slate/10 border-p50-slate/30' : 'border-strict-border opacity-40 hover:opacity-100'}`}
            >
              <span className="size-2 bg-p50-slate"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p50 ? 'text-p50-slate' : 'text-slate-500'}`}>P50</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-muted-slate uppercase">Live Updates: </span>
          <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase tracking-tighter">Connected</span>
        </div>
      </div>
      
      <div className="flex-1 px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6 lg:pt-8 pb-6 sm:pb-8 lg:pb-10 relative flex flex-col min-h-[250px] sm:min-h-[300px] lg:min-h-[350px]">
        <div className="flex-1 relative">
          <div className="absolute -left-10 sm:-left-14 top-1/2 -rotate-90 text-[9px] sm:text-[10px] font-mono text-muted-slate uppercase tracking-widest hidden sm:block">
            Latency MS
          </div>
          <div className="w-full h-full border-l border-b border-strict-border relative pr-8 sm:pr-10">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[800, 600, 400, 200, 0].map((value) => (
                <div key={value} className="w-full border-t border-white/[0.03] flex justify-end items-start pr-2 pt-1">
                  <span className="text-[8px] font-mono text-slate-500">{value}ms</span>
                </div>
              ))}
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              {activeMetrics.p50 && p50Path && (
                <path d={p50Path} fill="none" opacity="0.6" stroke="var(--p50-slate)" strokeWidth="1.5" />
              )}
              {activeMetrics.p95 && p95Path && (
                <path d={p95Path} fill="none" opacity="0.8" stroke="var(--p95-purple)" strokeWidth="1.5" />
              )}
              {activeMetrics.p999 && p999Path && (
                <path d={p999Path} fill="none" stroke="var(--neon-cyan)" strokeWidth="2.5" />
              )}
            </svg>
          </div>
          {/* Horizontal time labels */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-strict-border pt-1 px-2 sm:px-4 lg:px-6 pr-8 sm:pr-10">
            <div className="flex justify-between items-center w-full">
              {data.length > 0 ? (
                <>
                  {data.length <= 5 ? (
                    // Show all labels if 5 or fewer data points
                    data.map((point, index) => (
                      <span key={index} className="text-[8px] sm:text-[9px] font-mono text-slate-500 whitespace-nowrap">
                        {point.time}
                      </span>
                    ))
                  ) : (
                    // Show first, middle, and last labels for more data points
                    <>
                      <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 whitespace-nowrap">
                        {data[0].time}
                      </span>
                      {data.length > 2 && (
                        <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 whitespace-nowrap hidden sm:block">
                          {data[Math.floor(data.length / 2)].time}
                        </span>
                      )}
                      <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 whitespace-nowrap">
                        {data[data.length - 1].time}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500">No data</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
