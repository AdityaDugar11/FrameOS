import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Sliders, 
  Layers, 
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
    { id: 'optimization', label: 'Optimization center', icon: Sliders, badge: `${activeOptimizationsCount}/8` },
    { id: 'architecture', label: 'System architecture', icon: Layers },
  ];

  return (
    <aside className="w-64 bg-paper-50 border-r border-paper-300 flex flex-col justify-between shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-paper-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-paper-200 border border-paper-300 flex items-center justify-center text-copper-600 font-semibold shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-sm text-ink-primary font-mono">
                  FrameOS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-200 text-ink-secondary border border-paper-300 font-medium">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-ink-muted font-mono">
                Gaming PC simulator
              </p>
            </div>
          </div>
          
          <div className="mt-3 text-[10px] text-ink-secondary font-mono flex items-center gap-2 bg-paper-200 px-2.5 py-1.5 rounded border border-paper-300">
            <span className="w-1.5 h-1.5 rounded-full bg-copper-600" />
            <span>A freeze is a missed deadline</span>
          </div>
        </div>

        {/* System Simulation Status Banner */}
        <div className="px-3 pt-3">
          <div className={`p-2.5 rounded-lg border text-xs ${
            isOptimized 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : activeOptimizationsCount > 0
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center justify-between font-medium">
              <div className="flex items-center gap-1.5">
                {isOptimized ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                )}
                <span className="font-semibold">
                  {isOptimized ? 'Optimized profile' : activeOptimizationsCount > 0 ? 'Custom profile' : 'Baseline bottleneck'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-50 border border-paper-300 font-medium text-ink-primary">
                {isOptimized ? '60 FPS' : '28 FPS'}
              </span>
            </div>
            <p className="text-[11px] text-ink-secondary mt-1 leading-snug">
              {isOptimized 
                ? 'All four kernel bottlenecks mitigated.' 
                : 'Paging stalls, scheduling lag & inversion active.'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted px-3 py-1 font-semibold">
            Laboratories
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors group ${
                  isActive
                    ? 'bg-paper-200 text-ink-primary border border-paper-300 font-semibold shadow-xs'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-paper-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-copper-600' : 'text-ink-muted group-hover:text-ink-secondary'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    activeOptimizationsCount === 8
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-paper-200 text-ink-secondary border border-paper-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-paper-300 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium text-ink-primary bg-paper-100 hover:bg-paper-200 border border-paper-300 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-3 h-3 text-ink-secondary" />
            <span>Config</span>
          </button>
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3 h-3 text-red-600" />
            <span>Reset</span>
          </button>
        </div>

        <div className="pt-1 text-center">
          <span className="text-[10px] text-ink-muted font-mono">
            Academic model · Uniprocessor
          </span>
        </div>
      </div>
    </aside>
  );
};
