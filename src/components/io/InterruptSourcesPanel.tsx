import React from 'react';
import { 
  Zap, 
  Clock, 
  MousePointer, 
  Network, 
  HardDrive, 
  Tv, 
  ShieldCheck, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

const INTERRUPT_ICONS: Record<string, React.ElementType> = {
  timer: Clock,
  input: MousePointer,
  nic: Network,
  storage: HardDrive,
  gpu: Tv,
};

export const InterruptSourcesPanel: React.FC = () => {
  const { 
    ioResult, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const isModerated = optimizations.interruptModeration;

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Hardware interrupt subsystem & APIC controller
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Total frequency: {ioResult.totalInterruptsPerSec.toLocaleString()} Hz · Latency penalty: ~{ioResult.interruptContextSwitchPenaltyMs} ms/sec
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('interruptModeration')}
          className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
            isModerated
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-copper-600 hover:bg-copper-700 text-white'
          }`}
        >
          {isModerated ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Interrupt moderation active</span>
            </>
          ) : (
            <span>Enable interrupt moderation</span>
          )}
        </button>
      </div>

      {/* Interrupt Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ioResult.interrupts.map((int) => {
          const Icon = INTERRUPT_ICONS[int.id] || Zap;
          const isNic = int.id === 'nic';

          return (
            <div
              key={int.id}
              className={`p-3.5 rounded-lg border bg-paper-100 shadow-xs flex flex-col justify-between ${
                isNic && !isModerated 
                  ? 'border-amber-300 bg-amber-50/50' 
                  : 'border-paper-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-paper-200 text-ink-primary border border-paper-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-ink-primary leading-tight">
                        {int.name}
                      </h4>
                      <span className="text-[10px] font-mono text-ink-muted">
                        {int.type} interrupt
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold text-ink-primary">
                    {int.frequencyHz.toLocaleString()} Hz
                  </span>
                </div>

                <p className="text-[11px] text-ink-secondary mb-2 font-sans leading-relaxed">
                  {int.description}
                </p>
              </div>

              <div className="pt-2 border-t border-paper-300 flex items-center justify-between text-[10px] font-mono">
                <span className="text-ink-muted">CPU overhead:</span>
                <span className="font-semibold text-copper-700">{int.cpuOverheadPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interrupt Explanation */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 text-xs shadow-xs">
        <h4 className="font-semibold text-ink-primary font-mono mb-1">
          How hardware interrupts affect frame latency:
        </h4>
        <p className="text-ink-secondary text-[11px] leading-relaxed">
          When a hardware device asserts an interrupt, the CPU pauses the currently running user thread (the game loop), pushes execution registers to the kernel stack, and invokes the Interrupt Service Routine (ISR). Without <strong>interrupt moderation</strong>, a flood of 8,500 network packets per second causes constant context switches and cache flushes.
        </p>
      </div>
    </div>
  );
};
