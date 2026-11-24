import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Cpu, 
  HardDrive
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
    <header className="h-16 bg-paper-50 border-b border-paper-300 px-6 flex items-center justify-between shrink-0 select-none z-10">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-ink-primary tracking-tight">
            {currentInfo.title}
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-200 text-ink-secondary border border-paper-300 font-medium">
            Academic case study model
          </span>
        </div>
        <p className="text-xs text-ink-secondary truncate max-w-md">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Quick Telemetry Bar */}
      <div className="flex items-center gap-3">
        {/* FPS Ticker */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono text-xs ${
          currentFPS === 60
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            currentFPS === 60 ? 'bg-emerald-600' : 'bg-red-600'
          }`} />
          <div className="flex flex-col">
            <span className="text-[9px] text-ink-muted leading-none">Frame rate</span>
            <span className="font-semibold text-xs leading-tight">{currentFPS} FPS</span>
          </div>
          <span className="text-[10px] text-ink-secondary border-l border-paper-300 pl-2 ml-1">
            {frameTimeMs} ms
          </span>
        </div>

        {/* CPU & RAM Telemetry Pills */}
        <div className="hidden lg:flex items-center gap-2 bg-paper-200 px-3 py-1.5 rounded-md border border-paper-300 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-ink-primary">
            <Cpu className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-ink-secondary text-[10px]">CPU:</span>
            <span className="font-semibold">41.2%</span>
            <span className="text-[10px] text-ink-muted ml-0.5">(stalling on I/O)</span>
          </div>
          <div className="h-3 w-px bg-paper-300 mx-1" />
          <div className="flex items-center gap-1.5 text-ink-primary">
            <HardDrive className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-ink-secondary text-[10px]">RAM:</span>
            <span className={memoryResult.isOvercommitted ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold'}>
              {memoryResult.totalMemoryDemandGB} / 16 GB
            </span>
          </div>
        </div>

        {/* Bottleneck Warning / Success Badge */}
        <div className="flex items-center gap-2">
          {totalBottlenecks > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              <AlertOctagon className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {totalBottlenecks} bottlenecks active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                System stable (60 FPS)
              </span>
            </div>
          )}

          {/* Quick Action Toggle All */}
          {isAllOptimized ? (
            <button
              onClick={resetAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-paper-100 hover:bg-paper-200 text-ink-primary text-xs font-medium border border-paper-300 transition-colors shadow-xs"
            >
              <span>Revert to baseline</span>
            </button>
          ) : (
            <button
              onClick={applyAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-copper-600 hover:bg-copper-700 text-white font-medium text-xs transition-colors shadow-xs"
            >
              <span>Apply all fixes</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
