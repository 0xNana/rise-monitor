'use client'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  timePeriod?: '24h' | '7d' | '30d'
  onTimePeriodChange?: (period: '24h' | '7d' | '30d') => void
}

export default function Header({ timePeriod, onTimePeriodChange }: HeaderProps = {}) {
  const pathname = usePathname()
  const isHistory = pathname === '/history'
  const pageTitle = pathname === '/methodology' ? 'Methodology' : isHistory ? 'RISE Latency Analysis' : 'Dashboard'
  const pageSubtitle = isHistory ? 'Historical P50 / P95 / P99 trends' : null
  const isDashboard = pathname === '/'
  
  return (
    <header className="h-16 border-b border-strict-border flex items-center justify-between px-6 bg-black z-10 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-slate-100 text-lg font-bold tracking-tight uppercase leading-none">{pageTitle}</h2>
          {pageSubtitle && (
            <span className="text-primary text-[10px] font-mono tracking-widest uppercase opacity-80">
              {pageSubtitle}
            </span>
          )}
        </div>
        {isHistory && (
          <div className="hidden lg:flex gap-4 items-center">
            <span className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">View: ANALYTICAL_CHART</span>
            <span className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">Metric: LATENCY_MS</span>
          </div>
        )}
        {isDashboard && (
          <>
            <div className="h-8 w-px bg-strict-border"></div>
            <div className="flex items-center gap-3 px-3 py-1.5 border border-dashed border-strict-border/60 bg-white/5">
              <span className="text-[9px] font-mono text-muted-slate uppercase">Comparison Mode:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 bg-slate-800 border border-slate-700 relative cursor-pointer group">
                  <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-slate-600 border-r border-slate-700"></div>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">OFF</span>
              </div>
            </div>
            <div className="hidden lg:flex gap-4 items-center">
              <span className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">Ctx: 7D_AGG</span>
              <span className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">Nodes: 124_ACT</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isHistory && (
          <>
            <div className="flex border border-strict-border bg-[#0a0a0a]">
              <button 
                onClick={() => onTimePeriodChange?.('24h')}
                className={`px-3 py-1.5 text-[10px] font-bold border-r border-strict-border ${
                  timePeriod === '24h' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                24H
              </button>
              <button 
                onClick={() => onTimePeriodChange?.('7d')}
                className={`px-3 py-1.5 text-[10px] font-bold border-r border-strict-border ${
                  timePeriod === '7d' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                7D
              </button>
              <button 
                onClick={() => onTimePeriodChange?.('30d')}
                className={`px-3 py-1.5 text-[10px] font-bold border-l border-strict-border ${
                  timePeriod === '30d' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                30D
              </button>
            </div>
            <button className="size-8 border border-strict-border flex items-center justify-center hover:bg-white/5">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </button>
          </>
        )}
        {isDashboard && (
          <>
            <div className="flex border border-strict-border bg-[#0a0a0a]">
              <button className="px-3 py-1.5 text-[10px] font-bold border-r border-strict-border text-slate-500 hover:text-slate-300">24H</button>
              <button className="px-3 py-1.5 text-[10px] font-bold border-r border-strict-border text-slate-500 hover:text-slate-300">48H</button>
              <button className="px-3 py-1.5 text-[10px] font-bold bg-primary/10 text-primary">7D</button>
              <button className="px-3 py-1.5 text-[10px] font-bold border-l border-strict-border text-slate-500 hover:text-slate-300">30D</button>
            </div>
            <button className="size-8 border border-strict-border flex items-center justify-center hover:bg-white/5">
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>
          </>
        )}
      </div>
    </header>
  )
}
