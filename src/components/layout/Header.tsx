import React from 'react';
import { 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  HardDrive, 
  Presentation, 
  Sliders, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    optimizations, 
    applyAllOptimizations, 
    resetAllOptimizations, 
    setPresentationMode,
    presentationMode,
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
      title: 'Gaming PC Performance Overview',
      subtitle: 'Real-time telemetry showing why the game freezes despite low CPU utilization',
    },
    scheduler: {
      title: 'CPU Scheduler Laboratory',
      subtitle: 'Round Robin vs Foreground-Weighted Round Robin & 16.67ms frame deadline tracking',
    },
    memory: {
      title: 'Virtual Memory & Paging Manager',
      subtitle: '17 GB demand on 16 GB RAM: The 8ms mechanical HDD page fault penalty',
    },
    io: {
      title: 'I/O Subsystem & DMA Laboratory',
      subtitle: 'Disk request queue overload & 31.25% Programmed I/O vs 0.38% DMA overhead',
    },
    sync: {
      title: 'Process Synchronization & Priority Inversion',
      subtitle: 'Low-priority Antivirus lock blocks High-priority Game while Browser preempts',
    },
    optimization: {
      title: 'Optimization Center',
      subtitle: 'Apply OS kernel mechanisms to eliminate frame drops and restore 60 FPS',
    },
    architecture: {
      title: 'Operating System Architecture',
      subtitle: 'Interactive architectural blueprint of hardware, queues, memory, and scheduler',
    },
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.overview;

  return (
    <header className="h-16 bg-dark-900/90 border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 select-none backdrop-blur-md z-10">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            {currentInfo.title}
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
            Case Study Model
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate max-w-md">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Quick Telemetry Bar */}
      <div className="flex items-center gap-4">
        {/* FPS Ticker */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs ${
          currentFPS === 60
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            currentFPS === 60 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-ping'
          }`} />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 leading-none">FRAME RATE</span>
            <span className="font-bold text-sm leading-tight">{currentFPS} FPS</span>
          </div>
          <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2 ml-1">
            {frameTimeMs} ms
          </span>
        </div>

        {/* CPU & RAM Telemetry Pills */}
        <div className="hidden lg:flex items-center gap-2 bg-dark-850 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[10px]">CPU:</span>
            <span className="text-cyan-300 font-bold">40%</span>
            <span className="text-[9px] text-amber-400/90 font-sans italic ml-0.5">(Idle stalls)</span>
          </div>
          <div className="h-3 w-px bg-slate-700 mx-1" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400 text-[10px]">RAM:</span>
            <span className={memoryResult.isOvercommitted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {memoryResult.totalMemoryDemandGB} / 16 GB
            </span>
          </div>
        </div>

        {/* Bottleneck Warning / Success Badge */}
        <div className="flex items-center gap-2">
          {totalBottlenecks > 0 ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs font-medium">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                {totalBottlenecks} Bottlenecks Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px]">
                System Stable (60 FPS)
              </span>
            </div>
          )}

          {/* Quick Action Toggle All */}
          {isAllOptimized ? (
            <button
              onClick={resetAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <span>Revert to Baseline</span>
            </button>
          ) : (
            <button
              onClick={applyAllOptimizations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Optimize All</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
