import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Sparkles, 
  Layers, 
  Presentation, 
  Settings, 
  RotateCcw,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { NavigationTab } from '../../types/simulation';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setSettingsOpen, 
    presentationMode, 
    setPresentationMode, 
    resetToAcademicDefaults,
    optimizations 
  } = useFrameOSStore();

  const isOptimized = Object.values(optimizations).every(Boolean);
  const activeOptimizationsCount = Object.values(optimizations).filter(Boolean).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scheduler', label: 'CPU Scheduler', icon: Cpu },
    { id: 'memory', label: 'Memory Manager', icon: HardDrive },
    { id: 'io', label: 'I/O & DMA', icon: Network },
    { id: 'sync', label: 'Process Sync', icon: Lock },
    { id: 'optimization', label: 'Optimization Center', icon: Sparkles, badge: `${activeOptimizationsCount}/8` },
    { id: 'architecture', label: 'System Architecture', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-black">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  FrameOS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">
                Gaming PC Simulator
              </p>
            </div>
          </div>
          
          <div className="mt-3 text-[10px] text-slate-400/90 font-mono italic flex items-center gap-1.5 bg-dark-850 px-2.5 py-1.5 rounded-lg border border-slate-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            "A freeze is a missed deadline."
          </div>
        </div>

        {/* System Simulation Status Banner */}
        <div className="px-3 pt-3">
          <div className={`p-2.5 rounded-xl border transition-all ${
            isOptimized 
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400' 
              : activeOptimizationsCount > 0
              ? 'bg-amber-950/40 border-amber-800/60 text-amber-400'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
          }`}>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                {isOptimized ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{isOptimized ? 'Optimized Mode' : activeOptimizationsCount > 0 ? 'Custom Setup' : 'Baseline Problem'}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40">
                {isOptimized ? '60 FPS' : '28 FPS'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              {isOptimized 
                ? 'All 4 OS bottlenecks mitigated. Target frame deadline locked.' 
                : 'Paging stalls, scheduling lag & priority inversion active.'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
            Laboratories
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    activeOptimizationsCount === 8
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-dark-800 text-slate-400 border border-slate-700/60'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Presentation Trigger */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
            presentationMode
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-lg shadow-purple-500/25'
              : 'bg-purple-950/30 text-purple-300 hover:bg-purple-950/60 border-purple-800/40 hover:border-purple-600/60'
          }`}
        >
          <Presentation className="w-4 h-4 text-purple-300" />
          <span>{presentationMode ? 'Exit Presentation' : 'Presentation Mode'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-slate-300 bg-dark-800 hover:bg-dark-700 hover:text-white border border-slate-700/60 transition-colors"
            title="Configure System Parameters"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Config</span>
          </button>
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/20 hover:bg-rose-950/50 border border-rose-800/40 transition-colors"
            title="Reset to Case Study Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset</span>
          </button>
        </div>

        <div className="pt-1 text-center">
          <span className="text-[10px] text-slate-400 font-mono">
            Academic Model · Uniprocessor
          </span>
        </div>
      </div>
    </aside>
  );
};
