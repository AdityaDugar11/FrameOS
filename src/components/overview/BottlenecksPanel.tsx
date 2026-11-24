import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  HardDrive, 
  Database, 
  Lock, 
  ArrowRight,
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { NavigationTab } from '../../types/simulation';

export const BottlenecksPanel: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization, 
    setActiveTab,
  } = useFrameOSStore();

  const bottlenecks = [
    {
      id: 'cpu-latency',
      title: 'CPU scheduling latency',
      category: 'CPU scheduler',
      tabId: 'scheduler' as NavigationTab,
      isResolved: optimizations.fwrr,
      toggleKey: 'fwrr' as const,
      description: 'Standard 4ms round robin forces the game to wait 19 ms between slices, violating the 16.67 ms frame deadline.',
      impact: '19 ms max wait > 16.67 ms budget (1 dropped frame)',
      remedy: 'Foreground-weighted round robin (8ms game slice)',
      resolvedImpact: '12 ms max wait (0 dropped frames, 60 FPS maintained)',
      icon: Clock,
    },
    {
      id: 'memory-overcommit',
      title: 'Virtual memory overcommit & paging',
      category: 'Memory management',
      tabId: 'memory' as NavigationTab,
      isResolved: optimizations.workingSetTrimming || optimizations.ssdPagefile,
      toggleKey: 'workingSetTrimming' as const,
      description: '17 GB demanded on 16 GB physical RAM. Background tasks force game textures into mechanical HDD pagefile.',
      impact: '8 ms page fault penalty (EAT increases from 100ns to 900ns)',
      remedy: 'Working-set trimming (evict idle tabs) or NVMe SSD pagefile',
      resolvedImpact: 'Demand reduced to 13.7 GB (zero page thrashing, EAT 110ns)',
      icon: HardDrive,
    },
    {
      id: 'disk-contention',
      title: 'Disk contention & programmed I/O',
      category: 'I/O subsystem',
      tabId: 'io' as NavigationTab,
      isResolved: optimizations.dma && optimizations.ioPrioritization,
      toggleKey: 'dma' as const,
      description: '120 req/s load on 100 req/s disk. Without DMA, CPU wastes 31.25% of cycles manually copying network bytes.',
      impact: '31.25% CPU overhead and game asset streaming delays',
      remedy: 'Enable direct memory access (DMA) & I/O prioritization',
      resolvedImpact: 'CPU overhead drops to 0.38%, game assets jump disk queue',
      icon: Database,
    },
    {
      id: 'priority-inversion',
      title: 'Priority inversion stutter',
      category: 'Process synchronization',
      tabId: 'sync' as NavigationTab,
      isResolved: optimizations.priorityInheritance,
      toggleKey: 'priorityInheritance' as const,
      description: 'Antivirus (Low) holds file lock. Web browser (Medium) preempts antivirus. High-priority game remains blocked for 11 ms.',
      impact: 'Game blocked for 11 ms on shared asset mutex',
      remedy: 'Enable priority inheritance protocol (PIP)',
      resolvedImpact: 'Antivirus inherits high priority, releasing lock in 3 ms',
      icon: Lock,
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              The four architectural bottlenecks
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Why the gaming PC freezes even when CPU utilization is only ~40%
          </p>
        </div>

        <button
          onClick={() => setActiveTab('optimization')}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <span>Optimization matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {bottlenecks.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-colors flex flex-col justify-between ${
                item.isResolved
                  ? 'bg-emerald-950/15 border-emerald-800/40 text-emerald-300'
                  : 'bg-dark-900 border-slate-800/80 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-dark-850 border border-slate-800 text-slate-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${
                    item.isResolved
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950/60 text-rose-400 border-rose-800'
                  }`}>
                    {item.isResolved ? 'Resolved' : 'Active'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1 text-[11px] font-mono">
                  <div className="text-rose-400 flex items-start gap-1.5">
                    <span className="font-semibold shrink-0">Issue:</span>
                    <span>{item.impact}</span>
                  </div>
                  <div className="text-emerald-400 flex items-start gap-1.5">
                    <span className="font-semibold shrink-0">Remedy:</span>
                    <span>{item.isResolved ? item.resolvedImpact : item.remedy}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
                <button
                  onClick={() => setActiveTab(item.tabId)}
                  className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
                >
                  <span>Open {item.category}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => toggleOptimization(item.toggleKey)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    item.isResolved
                      ? 'bg-dark-800 text-slate-300 border-slate-700 hover:bg-dark-750'
                      : 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400'
                  }`}
                >
                  {item.isResolved ? 'Disable fix' : 'Apply kernel fix'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
