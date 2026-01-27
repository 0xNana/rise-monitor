'use client'
import { useEffect, useState } from 'react'

interface HistoryPoint {
  time: string
  p50: number
  p95: number
  p99: number
}

interface HistoryChartProps {
  timePeriod: '24h' | '7d' | '30d'
}

export default function HistoryChart({ timePeriod }: HistoryChartProps) {
  const [data, setData] = useState<HistoryPoint[]>([])
  const [activeMetrics, setActiveMetrics] = useState({ p999: true, p95: true, p50: true })

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          // Filter data based on time period
          const now = new Date()
          let filteredData = data
          
          if (timePeriod === '24h') {
            // Keep last 24 hours (24 data points if hourly)
            filteredData = data.slice(-24)
          } else if (timePeriod === '7d') {
            // Keep last 7 days (168 data points if hourly)
            filteredData = data.slice(-168)
          } else if (timePeriod === '30d') {
            // Keep last 30 days (720 data points if hourly)
            filteredData = data.slice(-720)
          }
          
          setData(filteredData)
        } else {
          setData([])
        }
      })
      .catch(err => {
        console.error('Failed to fetch history:', err)
        setData([])
      })
  }, [timePeriod])

  // Convert data to SVG path coordinates
  // Calculate max latency dynamically based on data
  const maxDataValue = data.length > 0 
    ? Math.max(...data.flatMap(d => [d.p50, d.p95, d.p99]))
    : 500
  const maxLatency = Math.ceil(maxDataValue / 100) * 100 || 500 // Round up to nearest 100
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

  // Format dates for x-axis (simplified - showing time for now)
  const formatDateLabel = (time: string) => {
    // For now, just show the time. Could be enhanced to show dates if we have full timestamps
    return time
  }

  return (
    <section className="strict-card flex flex-col min-h-[500px] shrink-0">
      <div className="p-3 border-b border-strict-border bg-black/20 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latency Time Series {timePeriod.toUpperCase()}</span>
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p999: !activeMetrics.p999 })}
              className={`flex items-center gap-2 px-2 py-1 border transition-opacity ${
                activeMetrics.p999 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'border-strict-border opacity-40 hover:opacity-100'
              }`}
            >
              <span className="size-2 bg-primary"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p999 ? 'text-primary' : 'text-slate-500'}`}>P99</span>
            </button>
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p95: !activeMetrics.p95 })}
              className={`flex items-center gap-2 px-2 py-1 border transition-opacity ${
                activeMetrics.p95 
                  ? 'bg-p95-purple/10 border-p95-purple/30' 
                  : 'border-strict-border opacity-40 hover:opacity-100'
              }`}
            >
              <span className="size-2 bg-p95-purple"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p95 ? 'text-p95-purple' : 'text-slate-500'}`}>P95</span>
            </button>
            <button 
              onClick={() => setActiveMetrics({ ...activeMetrics, p50: !activeMetrics.p50 })}
              className={`flex items-center gap-2 px-2 py-1 border transition-opacity ${
                activeMetrics.p50 
                  ? 'bg-p50-slate/10 border-p50-slate/30' 
                  : 'border-strict-border opacity-40 hover:opacity-100'
              }`}
            >
              <span className="size-2 bg-p50-slate"></span>
              <span className={`text-[10px] font-bold uppercase ${activeMetrics.p50 ? 'text-p50-slate' : 'text-slate-500'}`}>P50</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8 relative flex flex-col">
        <div className="flex-1 relative">
          <div className="absolute -left-14 top-1/2 -rotate-90 text-[10px] font-mono text-muted-slate uppercase tracking-widest">
            LATENCY_MS
          </div>
          <div className="w-full h-full border-l border-b border-strict-border relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[maxLatency, Math.floor(maxLatency * 0.8), Math.floor(maxLatency * 0.6), Math.floor(maxLatency * 0.4), Math.floor(maxLatency * 0.2), 0].map((value) => (
                <div key={value} className="w-full border-t border-white/[0.03] flex justify-end items-start pr-2 pt-1">
                  <span className="text-[8px] font-mono text-slate-600">{value}ms</span>
                </div>
              ))}
            </div>
            {/* X-axis labels - simplified for now */}
            {data.length > 0 && (
              <div className="absolute inset-0 flex justify-between pointer-events-none">
                {data.map((point, index) => {
                  if (index % Math.ceil(data.length / 7) === 0 || index === data.length - 1) {
                    const xPercent = (index / (data.length - 1 || 1)) * 100
                    return (
                      <div key={index} className="h-full border-l border-white/[0.05] relative" style={{ left: `${xPercent}%` }}>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-500">
                          {formatDateLabel(point.time)}
                        </span>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              {activeMetrics.p50 && p50Path && (
                <path d={p50Path} fill="none" opacity="0.4" stroke="var(--p50-slate)" strokeWidth="2" />
              )}
              {activeMetrics.p95 && p95Path && (
                <path d={p95Path} fill="none" opacity="0.6" stroke="var(--p95-purple)" strokeWidth="2" />
              )}
              {activeMetrics.p999 && p999Path && (
                <path d={p999Path} fill="none" stroke="var(--neon-cyan)" strokeWidth="2.5" />
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
