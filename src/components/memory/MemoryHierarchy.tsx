import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Zap, 
  HardDrive, 
  Database, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface Tier {
  name: string;
  category: string;
  latencyNs: number;
  latencyFormatted: string;
  capacity: string;
  description: string;
  ratioToRam: number;
  color: string;
}

export const MemoryHierarchy: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(3); // Default RAM

  const tiers: Tier[] = [
    {
      name: 'CPU Registers',
      category: 'On-Chip Storage',
      latencyNs: 0.5,
      latencyFormatted: '0.5 ns',
      capacity: 'Few Kilobytes (64-bit general purpose)',
      description: 'Ultra-fast memory located directly within the CPU ALU. Holds immediate operands and instructions.',
      ratioToRam: 0.005,
      color: '#00f0ff',
    },
    {
      name: 'L1 Cache (Instruction & Data)',
      category: 'SRAM On-Die',
      latencyNs: 1.0,
      latencyFormatted: '1.0 ns',
      capacity: '32 - 64 KB per core',
      description: 'Dedicated core-level cache operating at full processor frequency. Minimal cycle delay.',
      ratioToRam: 0.01,
      color: '#38bdf8',
    },
    {
      name: 'L2 & L3 Cache (Shared LLC)',
      category: 'SRAM On-Die',
      latencyNs: 3.5,
      latencyFormatted: '3 - 10 ns',
      capacity: '16 - 96 MB shared',
      description: 'Large on-die cache pool bridging the core execution pipeline with the system memory controller.',
      ratioToRam: 0.035,
      color: '#818cf8',
    },
    {
      name: 'Physical RAM (DDR4 / DDR5)',
      category: 'DRAM System Memory',
      latencyNs: 100,
      latencyFormatted: '100 ns',
      capacity: '16 GB',
      description: 'Baseline primary system memory. Stores active process working sets, page tables, and stack/heap.',
      ratioToRam: 1.0,
      color: '#a855f7',
    },
    {
      name: 'NVMe Solid-State Drive (SSD)',
      category: 'Flash Storage Pagefile',
      latencyNs: 100_000,
      latencyFormatted: '100 µs (100,000 ns)',
      capacity: '512 GB - 2 TB',
      description: 'High-speed PCIe Gen 4 storage. 1,000x slower than RAM, but sufficient to avoid catastrophic frame drops.',
      ratioToRam: 1_000,
      color: '#10b981',
    },
    {
      name: 'Mechanical Hard Disk Drive (HDD)',
      category: 'Magnetic Platter Pagefile',
      latencyNs: 8_000_000,
      latencyFormatted: '8 ms (8,000,000 ns)',
      capacity: '1 - 4 TB',
      description: 'Physical spinning platters with mechanical actuator arm seeks. 80,000x slower than RAM! Causes catastrophic game freezes.',
      ratioToRam: 80_000,
      color: '#ff3366',
    },
  ];

  const current = tiers[selectedTier];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              The Computer Memory Hierarchy & Latency Scale
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            From sub-nanosecond CPU registers down to the 8-millisecond mechanical HDD pagefile abyss
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-1 rounded bg-dark-950 text-cyan-300 border border-slate-800">
          Scale: HDD is 80,000× slower than RAM
        </span>
      </div>

      {/* Visual Pyramid / Steps */}
      <div className="space-y-2 mb-4">
        {tiers.map((tier, idx) => {
          const isSelected = selectedTier === idx;
          return (
            <div
              key={tier.name}
              onClick={() => setSelectedTier(idx)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-glow-cyan'
                  : 'border-slate-800/80 bg-dark-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-xs font-mono font-bold text-white">
                  {tier.name}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  ({tier.category})
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">
                  Cap: <span className="text-slate-200">{tier.capacity}</span>
                </span>
                <span 
                  className="font-bold px-2 py-0.5 rounded text-[11px]"
                  style={{ 
                    backgroundColor: `${tier.color}22`, 
                    color: tier.color,
                    border: `1px solid ${tier.color}44` 
                  }}
                >
                  {tier.latencyFormatted}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tier Deep Dive Card */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: current.color }}
            />
            <span className="font-bold text-white font-mono text-sm">
              {current.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ({current.category})
            </span>
          </div>

          <div className="font-mono text-xs">
            <span className="text-slate-400">Relative to RAM: </span>
            <span className="font-bold text-cyan-300">
              {current.ratioToRam < 1 
                ? `${(1 / current.ratioToRam).toFixed(0)}× faster` 
                : current.ratioToRam === 1 
                ? 'Baseline (1×)' 
                : `${current.ratioToRam.toLocaleString()}× slower`}
            </span>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed font-sans mb-3">
          {current.description}
        </p>

        {current.latencyNs >= 8_000_000 && (
          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">The Mechanical HDD Page Fault Penalty</p>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                When RAM is overcommitted (17 GB on 16 GB), accessing paged-out memory requires waiting 8 milliseconds (8,000,000 ns) for the mechanical head to seek the platter sector. In a 16.67 ms frame budget, losing 8 ms on a single page fault consumes nearly half the total frame time!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
