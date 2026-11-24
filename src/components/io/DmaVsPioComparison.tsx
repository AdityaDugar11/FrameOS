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
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Direct memory access (DMA) vs programmed I/O (PIO)
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Network download throughput: 100 Mbps = 12.5 MB/s (12,500,000 bytes/sec)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('dma')}
          className={`px-3 py-1.5 rounded font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
            isDma
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-copper-600 hover:bg-copper-700 text-white'
          }`}
        >
          {isDma ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
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
        <div className={`p-4 rounded-lg border transition-all ${
          !isDma 
            ? 'bg-red-50/50 border-red-200 shadow-xs' 
            : 'bg-paper-100 border-paper-300 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-semibold text-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Mode A: Programmed I/O (PIO)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-semibold">
              31.25% CPU cost
            </span>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed mb-3">
            The CPU core executes assembly instructions to read each 4-byte packet word from the NIC into a register, then stores it in RAM.
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded bg-paper-50 border border-paper-300 flex items-center justify-between font-mono text-xs text-center shadow-xs">
            <div className="p-2 rounded bg-paper-100 text-ink-primary border border-paper-300">
              <Network className="w-4 h-4 mx-auto mb-1 text-ink-muted" />
              <span>NIC buffer</span>
            </div>

            <div className="flex flex-col items-center text-red-700">
              <span className="text-[9px]">in / out</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-red-100 border border-red-200 text-red-900 font-semibold">
              <Cpu className="w-4 h-4 mx-auto mb-1 text-red-700" />
              <span>CPU core</span>
              <span className="text-[8px] block font-normal">(stalled)</span>
            </div>

            <div className="flex flex-col items-center text-red-700">
              <span className="text-[9px]">mov to RAM</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-paper-100 text-ink-primary border border-paper-300">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-ink-muted" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] font-mono text-ink-muted">
            3,125,000 words copied per second by CPU instructions
          </div>
        </div>

        {/* Mode B: Direct Memory Access (DMA) */}
        <div className={`p-4 rounded-lg border transition-all ${
          isDma 
            ? 'bg-emerald-50/50 border-emerald-200 shadow-xs' 
            : 'bg-paper-100 border-paper-300 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Mode B: Direct memory access (DMA)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              0.38% CPU cost
            </span>
          </div>

          <p className="text-xs text-ink-secondary leading-relaxed mb-3">
            The dedicated DMA controller streams full packet frames directly into RAM over the system bus. The CPU only receives one interrupt per buffer completion.
          </p>

          {/* Visual Data Flow */}
          <div className="p-3 rounded bg-paper-50 border border-paper-300 flex items-center justify-between font-mono text-xs text-center shadow-xs">
            <div className="p-2 rounded bg-paper-100 text-ink-primary border border-paper-300">
              <Network className="w-4 h-4 mx-auto mb-1 text-ink-muted" />
              <span>NIC buffer</span>
            </div>

            <div className="flex flex-col items-center text-emerald-700">
              <span className="text-[9px]">Bus</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-emerald-100 border border-emerald-200 text-emerald-900 font-semibold">
              <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
              <span>DMA engine</span>
              <span className="text-[8px] block font-normal">(offloaded)</span>
            </div>

            <div className="flex flex-col items-center text-emerald-700">
              <span className="text-[9px]">RAM write</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="p-2 rounded bg-paper-100 text-ink-primary border border-paper-300">
              <HardDrive className="w-4 h-4 mx-auto mb-1 text-ink-muted" />
              <span>RAM</span>
            </div>
          </div>

          <div className="mt-2.5 text-[11px] font-mono text-ink-muted">
            CPU reclaimed: Saves nearly a third of all available CPU cycles
          </div>
        </div>
      </div>

      {/* Case Study Calculation Proof Box */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 font-mono text-xs space-y-1.5 shadow-xs">
        <div className="text-[10px] uppercase text-ink-muted font-semibold">
          Case study derivation:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ink-primary text-[11px]">
          <div>
            <span className="text-red-700 font-semibold block mb-0.5">Without DMA (Programmed I/O):</span>
            <ul className="space-y-0.5 list-disc list-inside text-ink-secondary">
              <li>100 Mbps network = 12.5 MB/s throughput</li>
              <li>At 32-bit (4-byte) words: 3.125 million words / sec</li>
              <li>CPU execution cost = <strong className="text-red-700 font-semibold">31.25% of CPU capacity</strong></li>
            </ul>
          </div>

          <div>
            <span className="text-emerald-700 font-semibold block mb-0.5">With DMA controller:</span>
            <ul className="space-y-0.5 list-disc list-inside text-ink-secondary">
              <li>NIC writes ring buffers directly to RAM via PCIe</li>
              <li>Interrupt raised once per block, not per byte</li>
              <li>CPU execution cost = <strong className="text-emerald-700 font-semibold">0.38% overhead</strong> (98.8% reduction)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
