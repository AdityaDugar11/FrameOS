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
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Hardware interrupt subsystem & APIC controller
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Total frequency: {ioResult.totalInterruptsPerSec.toLocaleString()} Hz · Latency penalty: ~{ioResult.interruptContextSwitchPenaltyMs} ms/sec
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('interruptModeration')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isModerated
              ? 'bg-emerald-500 text-black font-semibold'
              : 'bg-cyan-500 text-black font-semibold'
          }`}
        >
          {isModerated ? (
            <>
              <ShieldCheck className="w-4 h-4" />
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
              className={`p-3.5 rounded-xl border bg-dark-950 flex flex-col justify-between ${
                isNic && !isModerated 
                  ? 'border-amber-700/50 bg-dark-900' 
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-dark-850 text-slate-300 border border-slate-700/80">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-slate-200 leading-tight">
                        {int.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {int.type} interrupt
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-medium text-slate-200">
                    {int.frequencyHz.toLocaleString()} Hz
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mb-2 font-sans leading-relaxed">
                  {int.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">CPU overhead:</span>
                <span className="font-semibold text-cyan-300">{int.cpuOverheadPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interrupt Explanation */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <h4 className="font-medium text-slate-200 font-mono mb-1">
          How hardware interrupts affect frame latency:
        </h4>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          When a hardware device asserts an interrupt, the CPU pauses the currently running user thread (the game loop), pushes execution registers to the kernel stack, and invokes the Interrupt Service Routine (ISR). Without <strong>interrupt moderation</strong>, a flood of 8,500 network packets per second causes constant context switches and cache flushes.
        </p>
      </div>
    </div>
  );
};
