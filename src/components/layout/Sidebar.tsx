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
  SlidersHorizontal, 
  RotateCcw,
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
    { id: 'scheduler', label: 'CPU scheduler', icon: Cpu },
    { id: 'memory', label: 'Memory manager', icon: HardDrive },
    { id: 'io', label: 'I/O & DMA', icon: Network },
    { id: 'sync', label: 'Process sync', icon: Lock },
    { id: 'optimization', label: 'Optimization center', icon: Sparkles, badge: `${activeOptimizationsCount}/8` },
    { id: 'architecture', label: 'System architecture', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700/80 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-sm text-white">
                  FrameOS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-800 text-slate-400 border border-slate-700/60 font-medium">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Gaming PC simulator
              </p>
            </div>
          </div>
          
          <div className="mt-3 text-[10px] text-slate-400 font-mono flex items-center gap-2 bg-dark-950 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>A freeze is a missed deadline</span>
          </div>
        </div>

        {/* System Simulation Status Banner */}
        <div className="px-3 pt-3">
          <div className={`p-2.5 rounded-xl border ${
            isOptimized 
              ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' 
              : activeOptimizationsCount > 0
              ? 'bg-amber-950/20 border-amber-800/50 text-amber-300'
              : 'bg-rose-950/20 border-rose-800/50 text-rose-300'
          }`}>
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-1.5">
                {isOptimized ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{isOptimized ? 'Optimized profile' : activeOptimizationsCount > 0 ? 'Custom profile' : 'Baseline bottleneck'}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 border border-slate-800">
                {isOptimized ? '60 FPS' : '28 FPS'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              {isOptimized 
                ? 'All four kernel bottlenecks mitigated.' 
                : 'Paging stalls, scheduling lag & inversion active.'}
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors group ${
                  isActive
                    ? 'bg-dark-800 text-cyan-300 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    activeOptimizationsCount === 8
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-dark-950 text-slate-400 border border-slate-800'
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
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-colors border ${
            presentationMode
              ? 'bg-cyan-500 text-black border-cyan-400 font-semibold'
              : 'bg-dark-800 text-slate-300 hover:bg-dark-750 hover:text-white border-slate-700'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>{presentationMode ? 'Exit presentation' : 'Presentation mode'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-slate-300 bg-dark-850 hover:bg-dark-800 hover:text-white border border-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-400" />
            <span>Config</span>
          </button>
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-rose-400" />
            <span>Reset</span>
          </button>
        </div>

        <div className="pt-1 text-center">
          <span className="text-[10px] text-slate-400 font-mono">
            Academic model · Uniprocessor
          </span>
        </div>
      </div>
    </aside>
  );
};
