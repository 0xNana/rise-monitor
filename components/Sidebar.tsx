'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="w-[240px] border-r border-strict-border flex flex-col bg-[var(--bg-deep)] z-20">
      <div className="p-4 border-b border-strict-border bg-black shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">monitoring</span>
          <h1 className="text-white text-sm font-bold tracking-tighter uppercase">
            RISE MONITOR
          </h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
        <div className="px-4 py-2 text-[9px] font-bold text-muted-slate uppercase tracking-widest opacity-60">
          Network Selection
        </div>
        <nav className="flex flex-col text-[11px] mb-4">
          <a className="flex items-center gap-3 px-4 py-2 text-slate-500 border-l-2 border-transparent hover:bg-white/5" href="#">
            <span className="material-symbols-outlined text-[16px]">lan</span>
            <span>MAINNET</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2 border-l-2 border-primary bg-primary/5 text-primary" href="#">
            <span className="material-symbols-outlined text-[16px]">experiment</span>
            <span>TESTNET</span>
            <span className="ml-auto text-[8px] bg-primary/20 px-1">ACTIVE</span>
          </a>
        </nav>
        
        <div className="border-t border-strict-border/50 pt-2">
          <nav className="flex flex-col text-[11px]">
            <Link 
              href="/" 
              className={`flex items-center gap-3 px-4 py-2.5 border-l-2 transition-colors ${
                pathname === '/' 
                  ? 'text-slate-100 border-primary bg-primary/5 font-bold' 
                  : 'text-slate-500 border-transparent hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span className="tracking-widest uppercase">Dashboard</span>
            </Link>
            <Link 
              href="/methodology" 
              className={`flex items-center gap-3 px-4 py-2.5 border-l-2 transition-colors ${
                pathname === '/methodology' 
                  ? 'text-slate-100 border-primary bg-primary/5 font-bold' 
                  : 'text-slate-500 border-transparent hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span className="tracking-widest uppercase">Methodology</span>
            </Link>
            <Link 
              href="/history" 
              className={`flex items-center gap-3 px-4 py-2.5 border-l-2 transition-colors ${
                pathname === '/history' 
                  ? 'text-slate-100 border-primary bg-primary/5 font-bold' 
                  : 'text-slate-500 border-transparent hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span className="tracking-widest uppercase">History</span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  )
}
