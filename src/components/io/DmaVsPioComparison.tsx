import React from 'react';
import { 
  Network, 
  Cpu, 
  HardDrive, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const DmaVsPioComparison: React.FC = () => {
  const { 
    ioResult, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const isDma = optimizations.dma;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Direct Memory Access (DMA) vs Programmed I/O (PIO)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Network Download Throughput: 100 Mbps = 12.5 MB/s (12,500,000 bytes/sec)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('dma')}
          className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            isDma
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
          }`}
        >
          {isDma ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>DMA Controller Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Enable DMA Engine</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-Side Architectural Flow Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode A: Programmed I/O */}
        <div className={`p-4 rounded-xl border transition-all ${
          !isDma 
            ? 'bg-rose-950/20 border-rose-800/60 shadow-glow-red' 
            : 'bg-dark-950/60 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Mode A: Programmed I/O (PIO)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              31.25% CPU COST
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The CPU core executes software instructions to read each 4-byte packet word from the NIC register into a CPU register, then stores it to RAM.
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 flex items-center justify-between font-mono text-xs text-center">
            <div className="p-2 rounded bg-slate-800 text-slate-200">
              <Network className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <span>NIC Buffer</span>
            </div>

            <div className="flex flex-col items-center text-rose-400">
              <span className="text-[9px] font-bold">in / out asm</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            <div className="p-2 rounded bg-rose-950 border border-rose-800 text-rose-300">
              <Cpu className="w-4 h-4 mx-auto mb-1 text-rose-400" />
              <span className="font-bold">CPU Core</span>
              <span className="text-[8px] block">(Bottleneck)</span>
            </div>

            <div className="flex flex-col items-center text-rose-400">
              <span className="text-[9px] font-bold">mov to RAM</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </div>

            <div className="p-2 rounded bg-slate-800 text-slate-200">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-400">
            Word count: 3,125,000 words copied per second by CPU instructions!
          </div>
        </div>

        {/* Mode B: Direct Memory Access (DMA) */}
        <div className={`p-4 rounded-xl border transition-all ${
          isDma 
            ? 'bg-emerald-950/20 border-emerald-800/60 shadow-glow-green' 
            : 'bg-dark-950/60 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Mode B: Direct Memory Access (DMA)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              0.38% CPU COST
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            The dedicated DMA controller streams full packet frames directly into RAM over the system bus. CPU only receives one interrupt per buffer completion!
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 flex items-center justify-between font-mono text-xs text-center">
            <div className="p-2 rounded bg-slate-800 text-slate-200">
              <Network className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
              <span>NIC Buffer</span>
            </div>

            <div className="flex flex-col items-center text-emerald-400">
              <span className="text-[9px] font-bold">Direct Bus</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
              <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="font-bold">DMA Engine</span>
              <span className="text-[8px] block">(Offloaded)</span>
            </div>

            <div className="flex flex-col items-center text-emerald-400">
              <span className="text-[9px] font-bold">RAM Write</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-slate-800 text-slate-200">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-mono text-slate-400">
            CPU Freed: Saves nearly a third of all available CPU cycles for game physics!
          </div>
        </div>
      </div>

      {/* Case Study Calculation Proof Box */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs space-y-2">
        <div className="text-[10px] uppercase text-slate-400 font-bold">
          Mathematical Proof from Academic Case Study:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px]">
          <div>
            <span className="text-rose-400 font-bold block mb-1">Without DMA (Programmed I/O):</span>
            <ul className="space-y-1 list-disc list-inside text-slate-400">
              <li>100 Mbps Network = 12.5 MB/s throughput</li>
              <li>At 32-bit (4-byte) words: 3.125 million words / sec</li>
              <li>CPU execution cost = <strong className="text-rose-300">31.25% of all CPU capacity</strong></li>
            </ul>
          </div>

          <div>
            <span className="text-emerald-400 font-bold block mb-1">With DMA Controller:</span>
            <ul className="space-y-1 list-disc list-inside text-slate-400">
              <li>NIC writes ring buffers directly to RAM via PCIe bus</li>
              <li>Interrupt raised once per 64 KB block, not per byte</li>
              <li>CPU execution cost = <strong className="text-emerald-300">0.38% overhead</strong> (98.8% reduction!)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
