import React from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Clock, 
  Database,
  Sliders,
  Check
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { OptimizationSettings } from '../../types/simulation';

interface OptimizationCard {
  key: keyof OptimizationSettings;
  title: string;
  category: 'Scheduler' | 'Memory' | 'I/O & DMA' | 'Synchronization';
  description: string;
  baselineImpact: string;
  proposedImpact: string;
  icon: React.ElementType;
}

export const OptimizationMatrix: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization, 
    applyAllOptimizations, 
    resetAllOptimizations 
  } = useFrameOSStore();

  const isAllOptimized = Object.values(optimizations).every(Boolean);
  const activeCount = Object.values(optimizations).filter(Boolean).length;

  const handleApplyAll = () => {
    applyAllOptimizations();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#00ff88', '#a855f7'],
      });
    } catch {
      // safe fallback
    }
  };

  const cards: OptimizationCard[] = [
    {
      key: 'fwrr',
      title: 'Foreground-Weighted Round Robin',
      category: 'Scheduler',
      description: 'Grants the Game thread an 8ms slice while restricting background tasks to 2-4ms slices.',
      baselineImpact: '4ms flat: Game waits 19 ms between slices (Misses 16.67ms deadline)',
      proposedImpact: '8ms game slice: Game waits only 12 ms (60 FPS maintained)',
      icon: Clock,
    },
    {
      key: 'aging',
      title: 'Queue Aging Mechanism',
      category: 'Scheduler',
      description: 'Gradually boosts priority of background tasks if they wait longer than 32ms in ready queue.',
      baselineImpact: 'Risk of background starvation under high foreground demand',
      proposedImpact: 'Guaranteed forward progress for music, chat, and download threads',
      icon: Cpu,
    },
    {
      key: 'priorityInheritance',
      title: 'Priority Inheritance Protocol (PIP)',
      category: 'Synchronization',
      description: 'Temporarily promotes low-priority mutex holder to High priority when Game requests lock.',
      baselineImpact: 'Game blocked for 11 ms while medium-priority Browser runs',
      proposedImpact: 'Game blocked for only 3 ms (73% reduction in mutex delay)',
      icon: Lock,
    },
    {
      key: 'workingSetTrimming',
      title: 'Working-Set Trimming',
      category: 'Memory',
      description: 'Trims inactive browser tabs and cache buffers from background processes.',
      baselineImpact: '17 GB demand exceeds 16 GB RAM (+1 GB forced to pagefile)',
      proposedImpact: 'Footprint reduced to 13.7 GB (Zero page thrashing in RAM)',
      icon: HardDrive,
    },
    {
      key: 'ssdPagefile',
      title: 'NVMe SSD Pagefile Migration',
      category: 'Memory',
      description: 'Moves swap space from 8 ms mechanical HDD to 100 µs high-speed NVMe flash.',
      baselineImpact: '8 ms page fault penalty (EAT jumps to 900 ns)',
      proposedImpact: '100 µs page fault latency (EAT remains at 110 ns)',
      icon: Database,
    },
    {
      key: 'ioPrioritization',
      title: 'Real-Time I/O Prioritization',
      category: 'I/O & DMA',
      description: 'Tags Game texture/shader requests with Real-Time elevator priority over AV scans.',
      baselineImpact: '120 req/s overload: Game waits behind 80 background requests',
      proposedImpact: 'Game disk seek latency drops from >800 ms to <12 ms',
      icon: Sliders,
    },
    {
      key: 'dma',
      title: 'Direct Memory Access (DMA)',
      category: 'I/O & DMA',
      description: 'Offloads network packet byte-copying from CPU ALU instructions to DMA engine.',
      baselineImpact: '31.25% CPU core overhead copying 12.5 MB/s network bytes',
      proposedImpact: '0.38% CPU overhead (nearly a third of CPU capacity reclaimed)',
      icon: Network,
    },
    {
      key: 'interruptModeration',
      title: 'Network Interrupt Moderation',
      category: 'I/O & DMA',
      description: 'Coalesces packet arrival interrupts into batch windows to prevent CPU interrupt storms.',
      baselineImpact: '8,500 interrupts/sec triggering constant context switches & cache flushes',
      proposedImpact: 'Moderated to 800 Hz batch notifications (0.9% CPU overhead)',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Central Control Action Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono">
              Operating System Kernel Optimization Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Toggle individual OS kernel mechanisms below to observe their isolated effects, or apply all 8 optimizations simultaneously to eliminate all gaming PC bottlenecks.
          </p>
          <div className="flex items-center gap-2 mt-2 font-mono text-xs">
            <span className="text-slate-400">Active Optimizations:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              isAllOptimized ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-dark-850 text-cyan-400 border border-slate-700'
            }`}>
              {activeCount} / 8 Applied
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetAllOptimizations}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-800/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All to Baseline</span>
          </button>

          <button
            onClick={handleApplyAll}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
              isAllOptimized
                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-400 text-black shadow-cyan-500/25'
            }`}
          >
            {isAllOptimized ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>All 8 Optimizations Applied!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>APPLY ALL OPTIMIZATIONS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 8 Optimization Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isEnabled = optimizations[card.key];

          return (
            <div
              key={card.key}
              onClick={() => toggleOptimization(card.key)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                isEnabled
                  ? 'bg-emerald-950/25 border-emerald-700/60 shadow-glow-green'
                  : 'bg-dark-900/90 border-slate-800 hover:border-slate-700 hover:bg-dark-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    {card.category}
                  </span>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    isEnabled ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isEnabled ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg border mt-0.5 ${
                    isEnabled ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">
                    {card.title}
                  </h4>
                </div>

                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Before vs After Impact Snippet */}
              <div className="p-2.5 rounded-xl bg-dark-950 border border-slate-800/80 font-mono text-[10px] space-y-1">
                <div className="text-rose-400 truncate">
                  <span className="font-bold">Before:</span> {card.baselineImpact}
                </div>
                <div className="text-emerald-400 truncate">
                  <span className="font-bold">After:</span> {card.proposedImpact}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
