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
      color: '#0284c7',
    },
    {
      name: 'L1 cache (instruction & data)',
      category: 'SRAM on-die',
      latencyNs: 1.0,
      latencyFormatted: '1.0 ns',
      capacity: '32 - 64 KB per core',
      description: 'Dedicated core-level cache operating at full processor frequency with minimal cycle delay.',
      ratioToRam: 0.01,
      color: '#0369a1',
    },
    {
      name: 'L2 & L3 cache (shared LLC)',
      category: 'SRAM on-die',
      latencyNs: 3.5,
      latencyFormatted: '3 - 10 ns',
      capacity: '16 - 96 MB shared',
      description: 'Large on-die cache pool bridging execution cores with the memory controller.',
      ratioToRam: 0.035,
      color: '#4338ca',
    },
    {
      name: 'Physical RAM (DDR4 / DDR5)',
      category: 'DRAM system memory',
      latencyNs: 100,
      latencyFormatted: '100 ns',
      capacity: '16 GB',
      description: 'Baseline primary system memory. Stores active process working sets, page tables, and stack/heap.',
      ratioToRam: 1.0,
      color: '#7e22ce',
    },
    {
      name: 'NVMe solid-state drive (SSD)',
      category: 'Flash storage pagefile',
      latencyNs: 100_000,
      latencyFormatted: '100 µs (100,000 ns)',
      capacity: '512 GB - 2 TB',
      description: 'High-speed PCIe Gen 4 storage. 1,000x slower than RAM, but fast enough to minimize frame hitching.',
      ratioToRam: 1_000,
      color: '#15803d',
    },
    {
      name: 'Mechanical hard disk drive (HDD)',
      category: 'Magnetic platter pagefile',
      latencyNs: 8_000_000,
      latencyFormatted: '8 ms (8,000,000 ns)',
      capacity: '1 - 4 TB',
      description: 'Physical spinning platters with mechanical actuator seeks. 80,000x slower than RAM. Causes severe game freezes.',
      ratioToRam: 80_000,
      color: '#b91c1c',
    },
  ];

  const current = tiers[selectedTier];

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Computer memory hierarchy & latency scale
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            From sub-nanosecond CPU registers to the 8-millisecond mechanical HDD pagefile
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-200 text-ink-primary border border-paper-300 font-medium">
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
              className={`p-2.5 rounded border transition-colors cursor-pointer flex items-center justify-between shadow-xs ${
                isSelected
                  ? 'border-paper-400 bg-paper-200'
                  : 'border-paper-300 bg-paper-100 hover:border-paper-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="text-xs font-mono font-semibold text-ink-primary">
                  {tier.name}
                </span>
                <span className="text-[10px] text-ink-secondary hidden sm:inline">
                  ({tier.category})
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-ink-muted text-[11px]">
                  Cap: <span className="text-ink-secondary font-medium">{tier.capacity}</span>
                </span>
                <span 
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded font-semibold"
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
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 text-xs shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-300 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: current.color }}
            />
            <span className="font-semibold text-ink-primary font-mono text-xs">
              {current.name}
            </span>
            <span className="text-[10px] font-mono text-ink-secondary">
              ({current.category})
            </span>
          </div>

          <div className="font-mono text-xs">
            <span className="text-ink-secondary">Relative to RAM: </span>
            <span className="text-copper-700 font-semibold">
              {current.ratioToRam < 1 
                ? `${(1 / current.ratioToRam).toFixed(0)}× faster` 
                : current.ratioToRam === 1 
                ? 'Baseline (1×)' 
                : `${current.ratioToRam.toLocaleString()}× slower`}
            </span>
          </div>
        </div>

        <p className="text-ink-secondary leading-relaxed font-sans mb-2.5">
          {current.description}
        </p>

        {current.latencyNs >= 8_000_000 && (
          <div className="p-2.5 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-red-900 text-xs shadow-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Mechanical HDD page fault penalty</p>
              <p className="text-[11px] text-ink-secondary font-sans mt-0.5 leading-relaxed">
                When RAM is overcommitted (17 GB on 16 GB), retrieving paged-out memory requires waiting 8 milliseconds (8,000,000 ns) for the mechanical head to seek the platter sector. In a 16.67 ms frame budget, losing 8 ms on a single page fault consumes nearly half the total frame time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
