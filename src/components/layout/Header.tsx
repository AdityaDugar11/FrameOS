import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Sparkles,
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    optimizations, 
    applyAllOptimizations, 
    resetAllOptimizations, 
    schedulerResult,
    memoryResult,
    ioResult,
    syncResult
  } = useFrameOSStore();

  const isAllOptimized = Object.values(optimizations).every(Boolean);

  // Dynamic status evaluation
  const hasDeadlineViolation = schedulerResult.gameMaxInterSliceWait > 16.6667;
  const isPaging = memoryResult.isOvercommitted;
  const isDiskSaturated = ioResult.isOverloaded && !optimizations.ioPrioritization;
  const isPriorityInverted = !syncResult.priorityInheritanceEnabled;

  const totalBottlenecks = [hasDeadlineViolation, isPaging, isDiskSaturated, isPriorityInverted].filter(Boolean).length;

  const currentFPS = isAllOptimized ? 60 : hasDeadlineViolation || isPaging ? 28 : 45;
  const frameTimeMs = isAllOptimized ? 16.6 : 35.7;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    overview: {
      title: 'Gaming PC performance overview',
      subtitle: 'Real-time telemetry showing why the game freezes despite low CPU utilization',
    },
    scheduler: {
      title: 'CPU scheduler laboratory',
      subtitle: 'Round robin vs foreground-weighted round robin with 16.67ms frame deadline tracking',
    },
    memory: {
      title: 'Virtual memory & paging manager',
      subtitle: '17 GB demand on 16 GB RAM: The 8ms mechanical HDD page fault penalty',
    },
    io: {
      title: 'I/O subsystem & DMA laboratory',
      subtitle: 'Disk request queue overload and 31.25% programmed I/O vs 0.38% DMA overhead',
    },
    sync: {
      title: 'Process synchronization & priority inversion',
      subtitle: 'Low-priority antivirus lock blocks high-priority game while browser preempts',
    },
    optimization: {
      title: 'Optimization center',
      subtitle: 'Apply OS kernel mechanisms to eliminate frame drops and restore 60 FPS',
    },
    architecture: {
      title: 'Operating system architecture',
      subtitle: 'Interactive architectural blueprint of hardware, queues, memory, and scheduler',
    },
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="h-16 bg-dark-900 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 select-none z-10">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-slate-100 tracking-tight">
            {currentInfo.title}
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-400 border border-slate-700/60">
            Case study model
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate max-w-md">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Quick Telemetry Bar */}
      <div className="flex items-center gap-3">
        {/* FPS Ticker */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs ${
          currentFPS === 60
            ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300'
            : 'bg-rose-950/20 border-rose-800/50 text-rose-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            currentFPS === 60 ? 'bg-emerald-400' : 'bg-rose-500'
          }`} />
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 leading-none">Frame rate</span>
            <span className="font-semibold text-xs leading-tight">{currentFPS} FPS</span>
          </div>
          <span className="text-[10px] text-slate-400 border-l border-slate-700/60 pl-2 ml-1">
            {frameTimeMs} ms
          </span>
        </div>

        {/* CPU & RAM Telemetry Pills */}
        <div className="hidden lg:flex items-center gap-2 bg-dark-850 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[10px]">CPU:</span>
            <span className="text-slate-200 font-semibold">41.2%</span>
            <span className="text-[10px] text-slate-400 ml-0.5">(stalling on I/O)</span>
          </div>
          <div className="h-3 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 text-[10px]">RAM:</span>
            <span className={memoryResult.isOvercommitted ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
              {memoryResult.totalMemoryDemandGB} / 16 GB
            </span>
          </div>
        </div>

        {/* Bottleneck Warning / Success Badge */}
        <div className="flex items-center gap-2">
          {totalBottlenecks > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/20 border border-rose-800/50 text-rose-300 text-xs font-medium">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {totalBottlenecks} bottlenecks active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-800/50 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                System stable (60 FPS)
              </span>
            </div>
          )}

          {/* Quick Action Toggle All */}
          {isAllOptimized ? (
            <button
              onClick={resetAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors"
            >
              <span>Revert to baseline</span>
            </button>
          ) : (
            <button
              onClick={applyAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors"
            >
              <span>Apply all fixes</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
