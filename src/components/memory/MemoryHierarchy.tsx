import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle,
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
      name: 'CPU registers',
      category: 'On-chip storage',
      latencyNs: 0.5,
      latencyFormatted: '0.5 ns',
      capacity: 'Few kilobytes (64-bit general purpose)',
      description: 'Memory located directly within the CPU ALU. Holds immediate operands and execution pointers.',
      ratioToRam: 0.005,
      color: '#00d0e6',
    },
    {
      name: 'L1 cache (instruction & data)',
      category: 'SRAM on-die',
      latencyNs: 1.0,
      latencyFormatted: '1.0 ns',
      capacity: '32 - 64 KB per core',
      description: 'Dedicated core-level cache operating at full processor frequency with minimal cycle delay.',
      ratioToRam: 0.01,
      color: '#38bdf8',
    },
    {
      name: 'L2 & L3 cache (shared LLC)',
      category: 'SRAM on-die',
      latencyNs: 3.5,
      latencyFormatted: '3 - 10 ns',
      capacity: '16 - 96 MB shared',
      description: 'Large on-die cache pool bridging execution cores with the memory controller.',
      ratioToRam: 0.035,
      color: '#818cf8',
    },
    {
      name: 'Physical RAM (DDR4 / DDR5)',
      category: 'DRAM system memory',
      latencyNs: 100,
      latencyFormatted: '100 ns',
      capacity: '16 GB',
      description: 'Baseline primary system memory. Stores active process working sets, page tables, and stack/heap.',
      ratioToRam: 1.0,
      color: '#a855f7',
    },
    {
      name: 'NVMe solid-state drive (SSD)',
      category: 'Flash storage pagefile',
      latencyNs: 100_000,
      latencyFormatted: '100 µs (100,000 ns)',
      capacity: '512 GB - 2 TB',
      description: 'High-speed PCIe Gen 4 storage. 1,000x slower than RAM, but fast enough to minimize frame hitching.',
      ratioToRam: 1_000,
      color: '#10b981',
    },
    {
      name: 'Mechanical hard disk drive (HDD)',
      category: 'Magnetic platter pagefile',
      latencyNs: 8_000_000,
      latencyFormatted: '8 ms (8,000,000 ns)',
      capacity: '1 - 4 TB',
      description: 'Physical spinning platters with mechanical actuator seeks. 80,000x slower than RAM. Causes severe game freezes.',
      ratioToRam: 80_000,
      color: '#f43f5e',
    },
  ];

  const current = tiers[selectedTier];

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Computer memory hierarchy & latency scale
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            From sub-nanosecond CPU registers to the 8-millisecond mechanical HDD pagefile
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-800">
          Scale: HDD is 80,000× slower than RAM
        </span>
      </div>

      {/* Visual Hierarchy Steps */}
      <div className="space-y-1.5 mb-4">
        {tiers.map((tier, idx) => {
          const isSelected = selectedTier === idx;
          return (
            <div
              key={tier.name}
              onClick={() => setSelectedTier(idx)}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-slate-700 bg-dark-850'
                  : 'border-slate-800/80 bg-dark-950 hover:border-slate-750'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-xs font-mono font-medium text-white">
                  {tier.name}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  ({tier.category})
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400 text-[11px]">
                  Cap: <span className="text-slate-300">{tier.capacity}</span>
                </span>
                <span 
                  className="font-mono text-[11px] px-1.5 py-0.2 rounded"
                  style={{ 
                    color: tier.color,
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
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: current.color }}
            />
            <span className="font-semibold text-white font-mono text-xs">
              {current.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ({current.category})
            </span>
          </div>

          <div className="font-mono text-xs">
            <span className="text-slate-400">Relative to RAM: </span>
            <span className="text-cyan-300 font-medium">
              {current.ratioToRam < 1 
                ? `${(1 / current.ratioToRam).toFixed(0)}× faster` 
                : current.ratioToRam === 1 
                ? 'Baseline (1×)' 
                : `${current.ratioToRam.toLocaleString()}× slower`}
            </span>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed font-sans mb-2.5">
          {current.description}
        </p>

        {current.latencyNs >= 8_000_000 && (
          <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/50 flex items-start gap-2 text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-rose-200">Mechanical HDD page fault penalty</p>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">
                When RAM is overcommitted (17 GB on 16 GB), retrieving paged-out memory requires waiting 8 milliseconds (8,000,000 ns) for the mechanical head to seek the platter sector. In a 16.67 ms frame budget, losing 8 ms on a single page fault consumes nearly half the total frame time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
