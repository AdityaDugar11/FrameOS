import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Database, 
  Lock, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { NavigationTab } from '../../types/simulation';

export const BottlenecksPanel: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization, 
    setActiveTab,
    schedulerResult,
    memoryResult,
    ioResult,
    syncResult
  } = useFrameOSStore();

  const bottlenecks = [
    {
      id: 'cpu-latency',
      title: 'CPU Scheduling Latency',
      category: 'CPU Scheduler',
      tabId: 'scheduler' as NavigationTab,
      isResolved: optimizations.fwrr,
      toggleKey: 'fwrr' as const,
      description: 'Standard 4ms Round Robin forces the Game to wait 19 ms between slices, violating the 16.67 ms frame deadline.',
      impact: '19 ms max wait > 16.67 ms budget (1 dropped frame)',
      remedy: 'Foreground-Weighted Round Robin (8ms Game slice)',
      resolvedImpact: '12 ms max wait (0 dropped frames, 60 FPS maintained)',
      icon: Clock,
    },
    {
      id: 'memory-overcommit',
      title: 'Virtual Memory Overcommit & Paging',
      category: 'Memory Management',
      tabId: 'memory' as NavigationTab,
      isResolved: optimizations.workingSetTrimming || optimizations.ssdPagefile,
      toggleKey: 'workingSetTrimming' as const,
      description: '17 GB demanded on 16 GB physical RAM. Background tasks force game textures into mechanical HDD pagefile.',
      impact: '8 ms page fault penalty (EAT jumps from 100ns to 900ns)',
      remedy: 'Working-Set Trimming (evict idle tabs) or NVMe SSD Pagefile',
      resolvedImpact: 'Demand reduced to 13.7 GB (Zero page thrashing, EAT 110ns)',
      icon: HardDrive,
    },
    {
      id: 'disk-contention',
      title: 'Disk Contention & Programmed I/O',
      category: 'I/O Subsystem',
      tabId: 'io' as NavigationTab,
      isResolved: optimizations.dma && optimizations.ioPrioritization,
      toggleKey: 'dma' as const,
      description: '120 req/s load on 100 req/s disk. Without DMA, CPU wastes 31.25% of cycles manually copying network bytes.',
      impact: '31.25% CPU overhead & game asset streaming delays',
      remedy: 'Enable Direct Memory Access (DMA) & I/O Prioritization',
      resolvedImpact: 'CPU overhead drops to 0.38%, game assets jump disk queue',
      icon: Database,
    },
    {
      id: 'priority-inversion',
      title: 'Priority Inversion Stutter',
      category: 'Process Synchronization',
      tabId: 'sync' as NavigationTab,
      isResolved: optimizations.priorityInheritance,
      toggleKey: 'priorityInheritance' as const,
      description: 'Antivirus (Low) holds file lock. Web Browser (Medium) preempts Antivirus. High-priority Game remains blocked for 11 ms!',
      impact: 'Game blocked for 11 ms on shared asset mutex',
      remedy: 'Enable Priority Inheritance Protocol (PIP)',
      resolvedImpact: 'Antivirus inherits High priority, releasing lock in 3 ms',
      icon: Lock,
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              The 4 Architectural Bottlenecks Explained
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Why the gaming PC freezes even when CPU utilization is only ~40%
          </p>
        </div>

        <button
          onClick={() => setActiveTab('optimization')}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          <span>Optimization Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {bottlenecks.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                item.isResolved
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : 'bg-dark-850/80 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${
                      item.isResolved
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    item.isResolved
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}>
                    {item.isResolved ? 'Resolved' : 'Active Bottleneck'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800/80 space-y-1 text-[11px] font-mono">
                  <div className="text-rose-400 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">Flaw:</span>
                    <span>{item.impact}</span>
                  </div>
                  <div className="text-emerald-400 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">Fix:</span>
                    <span>{item.isResolved ? item.resolvedImpact : item.remedy}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60">
                <button
                  onClick={() => setActiveTab(item.tabId)}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open {item.category}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => toggleOptimization(item.toggleKey)}
                  className={`text-[11px] font-mono px-3 py-1 rounded-lg border font-semibold transition-all ${
                    item.isResolved
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 shadow-sm shadow-cyan-500/20'
                  }`}
                >
                  {item.isResolved ? 'Disable Fix' : 'Apply Kernel Fix'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
