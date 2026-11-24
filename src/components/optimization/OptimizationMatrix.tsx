import React from 'react';
import { 
  RotateCcw, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Clock, 
  Database,
  Sliders,
  ShieldCheck,
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

  const cards: OptimizationCard[] = [
    {
      key: 'fwrr',
      title: 'Foreground-weighted round robin',
      category: 'Scheduler',
      description: 'Grants the game thread an 8ms slice while restricting background tasks to 2-4ms slices.',
      baselineImpact: '4ms flat: Game waits 19 ms between slices (misses 16.67ms deadline)',
      proposedImpact: '8ms slice: Game waits only 12 ms (60 FPS maintained)',
      icon: Clock,
    },
    {
      key: 'aging',
      title: 'Queue aging mechanism',
      category: 'Scheduler',
      description: 'Gradually boosts priority of background tasks waiting longer than 32ms in ready queue.',
      baselineImpact: 'Risk of background starvation under high foreground demand',
      proposedImpact: 'Guaranteed progress for music, chat, and download threads',
      icon: Cpu,
    },
    {
      key: 'priorityInheritance',
      title: 'Priority inheritance protocol (PIP)',
      category: 'Synchronization',
      description: 'Temporarily promotes low-priority mutex holder to high priority when game requests lock.',
      baselineImpact: 'Game blocked for 11 ms while medium-priority browser runs',
      proposedImpact: 'Game blocked for only 3 ms (73% reduction in mutex delay)',
      icon: Lock,
    },
    {
      key: 'workingSetTrimming',
      title: 'Working-set trimming',
      category: 'Memory',
      description: 'Trims inactive browser tabs and cache buffers from background processes.',
      baselineImpact: '17 GB demand exceeds 16 GB RAM (+1 GB forced to pagefile)',
      proposedImpact: 'Footprint reduced to 13.7 GB (zero page thrashing in RAM)',
      icon: HardDrive,
    },
    {
      key: 'ssdPagefile',
      title: 'NVMe SSD pagefile migration',
      category: 'Memory',
      description: 'Moves swap space from 8 ms mechanical HDD to 100 µs high-speed NVMe flash.',
      baselineImpact: '8 ms page fault penalty (EAT jumps to 900 ns)',
      proposedImpact: '100 µs page fault latency (EAT remains at 110 ns)',
      icon: Database,
    },
    {
      key: 'ioPrioritization',
      title: 'Real-time I/O prioritization',
      category: 'I/O & DMA',
      description: 'Tags game texture/shader requests with real-time elevator priority over AV scans.',
      baselineImpact: '120 req/s overload: Game waits behind 80 background requests',
      proposedImpact: 'Game disk seek latency drops from >800 ms to <12 ms',
      icon: Sliders,
    },
    {
      key: 'dma',
      title: 'Direct memory access (DMA)',
      category: 'I/O & DMA',
      description: 'Offloads network packet byte-copying from CPU ALU instructions to DMA engine.',
      baselineImpact: '31.25% CPU core overhead copying 12.5 MB/s network bytes',
      proposedImpact: '0.38% CPU overhead (nearly a third of CPU capacity reclaimed)',
      icon: Network,
    },
    {
      key: 'interruptModeration',
      title: 'Network interrupt moderation',
      category: 'I/O & DMA',
      description: 'Coalesces packet arrival interrupts into batch windows to prevent CPU interrupt storms.',
      baselineImpact: '8,500 interrupts/sec triggering constant context switches',
      proposedImpact: 'Moderated to 800 Hz batch notifications (0.9% CPU overhead)',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Central Control Action Banner */}
      <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink-primary tracking-tight font-mono">
            Operating system kernel optimization matrix
          </h2>
          <p className="text-xs text-ink-secondary mt-1 max-w-xl leading-relaxed">
            Toggle individual OS kernel mechanisms below to observe their isolated effects, or apply all 8 optimizations simultaneously to eliminate all gaming PC bottlenecks.
          </p>
          <div className="flex items-center gap-2 mt-2 font-mono text-xs">
            <span className="text-ink-muted">Active optimizations:</span>
            <span className={`px-2 py-0.5 rounded font-semibold border ${
              isAllOptimized ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-paper-200 text-ink-secondary border-paper-300'
            }`}>
              {activeCount} / 8 applied
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetAllOptimizations}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-medium text-ink-primary bg-paper-100 hover:bg-paper-200 border border-paper-300 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
            <span>Reset to baseline</span>
          </button>

          <button
            onClick={applyAllOptimizations}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono font-semibold transition-colors shadow-xs ${
              isAllOptimized
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-copper-600 hover:bg-copper-700 text-white'
            }`}
          >
            {isAllOptimized ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>All optimizations active</span>
              </>
            ) : (
              <span>Apply all optimizations</span>
            )}
          </button>
        </div>
      </div>

      {/* 8 Optimization Toggles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isEnabled = optimizations[card.key];

          return (
            <div
              key={card.key}
              onClick={() => toggleOptimization(card.key)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between select-none shadow-xs ${
                isEnabled
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-paper-100 border-paper-300 hover:border-paper-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold">
                    {card.category}
                  </span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors shadow-xs ${
                    isEnabled ? 'bg-emerald-600 text-white' : 'bg-paper-200 text-ink-muted border border-paper-300'
                  }`}>
                    {isEnabled ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-1.5">
                  <div className="p-1 rounded bg-paper-200 border border-paper-300 text-ink-primary mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-semibold text-ink-primary leading-tight">
                    {card.title}
                  </h4>
                </div>

                <p className="text-[11px] text-ink-secondary mb-3 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Before vs After Impact Snippet */}
              <div className="p-2 rounded bg-paper-50 border border-paper-300 font-mono text-[10px] space-y-0.5 shadow-xs">
                <div className="text-red-700 truncate">
                  <span className="font-semibold">Before:</span> {card.baselineImpact}
                </div>
                <div className="text-emerald-700 truncate">
                  <span className="font-semibold">After:</span> {card.proposedImpact}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
