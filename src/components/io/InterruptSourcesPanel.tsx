import React from 'react';
import { 
  Zap, 
  Clock, 
  MousePointer, 
  Network, 
  HardDrive, 
  Tv, 
  ShieldCheck, 
  AlertTriangle,
  Sliders
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
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Hardware Interrupt Subsystem & APIC Controller
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Total Interrupt Frequency: {ioResult.totalInterruptsPerSec.toLocaleString()} Hz · Latency Penalty: ~{ioResult.interruptContextSwitchPenaltyMs} ms/sec
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('interruptModeration')}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            isModerated
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
          }`}
        >
          {isModerated ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Interrupt Moderation Active</span>
            </>
          ) : (
            <>
              <Sliders className="w-4 h-4" />
              <span>Enable Interrupt Moderation</span>
            </>
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
                  ? 'border-amber-700/60 bg-amber-950/10' 
                  : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-dark-850 text-cyan-400 border border-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 leading-tight">
                        {int.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {int.type} Interrupt
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-300">
                    {int.frequencyHz.toLocaleString()} Hz
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mb-2 font-sans leading-relaxed">
                  {int.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">CPU Overhead:</span>
                <span className="font-bold text-cyan-300">{int.cpuOverheadPercent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interrupt Explanation */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <h4 className="font-bold text-slate-200 font-mono mb-1">
          How Hardware Interrupts Affect Frame Latency:
        </h4>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          When a hardware device (such as the NIC or mouse) asserts an interrupt line, the CPU immediately pauses the currently running user process (e.g. the Game loop), pushes its program counter and registers onto the kernel stack, and switches to the Interrupt Service Routine (ISR) via the Interrupt Descriptor Table (IDT). Without <strong>Interrupt Moderation</strong>, a flood of 8,500 network packets per second forces constant pipeline stalls and L1 instruction cache invalidations.
        </p>
      </div>
    </div>
  );
};
