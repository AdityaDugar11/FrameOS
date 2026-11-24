import React from 'react';
import { 
  Network, 
  Cpu, 
  HardDrive, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const DmaVsPioComparison: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const isDma = optimizations.dma;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80 space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Direct memory access (DMA) vs programmed I/O (PIO)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Network download throughput: 100 Mbps = 12.5 MB/s (12,500,000 bytes/sec)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('dma')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isDma
              ? 'bg-emerald-500 text-black font-semibold'
              : 'bg-cyan-500 text-black font-semibold'
          }`}
        >
          {isDma ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>DMA controller active</span>
            </>
          ) : (
            <span>Enable DMA controller</span>
          )}
        </button>
      </div>

      {/* Side-by-Side Architectural Flow Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Mode A: Programmed I/O */}
        <div className={`p-4 rounded-xl border transition-colors ${
          !isDma 
            ? 'bg-rose-950/15 border-rose-800/50' 
            : 'bg-dark-950 border-slate-800/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-medium text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Mode A: Programmed I/O (PIO)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">
              31.25% CPU cost
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            The CPU core executes assembly instructions to read each 4-byte packet word from the NIC into a register, then stores it in RAM.
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 flex items-center justify-between font-mono text-xs text-center">
            <div className="p-2 rounded bg-dark-850 text-slate-200 border border-slate-800">
              <Network className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <span>NIC buffer</span>
            </div>

            <div className="flex flex-col items-center text-rose-400">
              <span className="text-[9px]">in / out</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300">
              <Cpu className="w-4 h-4 mx-auto mb-1 text-rose-400" />
              <span className="font-semibold">CPU core</span>
              <span className="text-[8px] block">(stalled)</span>
            </div>

            <div className="flex flex-col items-center text-rose-400">
              <span className="text-[9px]">mov to RAM</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-dark-850 text-slate-200 border border-slate-800">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] font-mono text-slate-400">
            3,125,000 words copied per second by CPU instructions
          </div>
        </div>

        {/* Mode B: Direct Memory Access (DMA) */}
        <div className={`p-4 rounded-xl border transition-colors ${
          isDma 
            ? 'bg-emerald-950/15 border-emerald-800/50' 
            : 'bg-dark-950 border-slate-800/60 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Mode B: Direct memory access (DMA)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              0.38% CPU cost
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            The dedicated DMA controller streams full packet frames directly into RAM over the system bus. The CPU only receives one interrupt per buffer completion.
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 flex items-center justify-between font-mono text-xs text-center">
            <div className="p-2 rounded bg-dark-850 text-slate-200 border border-slate-800">
              <Network className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <span>NIC buffer</span>
            </div>

            <div className="flex flex-col items-center text-emerald-400">
              <span className="text-[9px]">Bus</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300">
              <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              <span className="font-semibold">DMA engine</span>
              <span className="text-[8px] block">(offloaded)</span>
            </div>

            <div className="flex flex-col items-center text-emerald-400">
              <span className="text-[9px]">RAM write</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-dark-850 text-slate-200 border border-slate-800">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-slate-400" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] font-mono text-slate-400">
            CPU reclaimed: Saves nearly a third of all available CPU cycles
          </div>
        </div>
      </div>

      {/* Case Study Calculation Proof Box */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs space-y-1.5">
        <div className="text-[10px] uppercase text-slate-400 font-medium">
          Case study derivation:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-[11px]">
          <div>
            <span className="text-rose-400 font-medium block mb-0.5">Without DMA (Programmed I/O):</span>
            <ul className="space-y-0.5 list-disc list-inside text-slate-400">
              <li>100 Mbps network = 12.5 MB/s throughput</li>
              <li>At 32-bit (4-byte) words: 3.125 million words / sec</li>
              <li>CPU execution cost = <strong className="text-rose-300">31.25% of CPU capacity</strong></li>
            </ul>
          </div>

          <div>
            <span className="text-emerald-400 font-medium block mb-0.5">With DMA controller:</span>
            <ul className="space-y-0.5 list-disc list-inside text-slate-400">
              <li>NIC writes ring buffers directly to RAM via PCIe</li>
              <li>Interrupt raised once per block, not per byte</li>
              <li>CPU execution cost = <strong className="text-emerald-300">0.38% overhead</strong> (98.8% reduction)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
