import React from 'react';
import { 
  HardDrive, 
  Database, 
  CheckCircle2, 
  Clock, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const PagingVisualizer: React.FC = () => {
  const { 
    memoryResult, 
    memoryConfig, 
    setMemoryConfig, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const isOvercommitted = memoryResult.isOvercommitted;
  const isSsd = memoryConfig.pagefileType === 'SSD';

  const physicalRam = memoryResult.totalPhysicalRamGB;
  const totalAllocated = memoryResult.totalAllocatedGB;
  const totalDemand = memoryResult.totalMemoryDemandGB;
  const totalSwapped = memoryResult.totalSwappedGB;

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      {/* Header and Pagefile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Paging & virtual memory allocation map
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Physical RAM: 16 GB · Current demand: {totalDemand} GB ({isOvercommitted ? '1 GB overcommitted' : 'Fits in RAM'})
          </p>
        </div>

        {/* Pagefile Technology Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-ink-secondary">Pagefile:</span>
          <div className="flex items-center gap-1 bg-paper-200 p-1 rounded border border-paper-300">
            <button
              onClick={() => {
                setMemoryConfig({ pagefileType: 'HDD' });
                if (optimizations.ssdPagefile) toggleOptimization('ssdPagefile');
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                !isSsd
                  ? 'bg-paper-50 text-red-800 font-semibold border border-paper-300 shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              Mechanical HDD (8 ms)
            </button>
            <button
              onClick={() => {
                setMemoryConfig({ pagefileType: 'SSD' });
                if (!optimizations.ssdPagefile) toggleOptimization('ssdPagefile');
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                isSsd
                  ? 'bg-copper-600 text-white font-semibold shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              NVMe SSD (100 µs)
            </button>
          </div>
        </div>
      </div>

      {/* Memory Allocation Bar Visualizer */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-ink-primary font-medium">
            Physical RAM allocation (16 GB capacity)
          </span>
          <span className={isOvercommitted ? 'text-red-700 font-semibold' : 'text-emerald-700 font-semibold'}>
            {totalAllocated} GB resident in RAM ({((totalAllocated / physicalRam) * 100).toFixed(0)}% full)
          </span>
        </div>

        <div className="w-full h-10 bg-paper-200 rounded p-0.5 flex border border-paper-300 overflow-hidden relative">
          {memoryResult.processes.map((proc) => {
            const widthPercent = (proc.allocatedGB / physicalRam) * 100;
            if (widthPercent <= 0) return null;

            return (
              <div
                key={proc.id}
                className="h-full relative flex flex-col justify-center items-center select-none border-r border-paper-50/40"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: proc.color,
                }}
                title={`${proc.name}: ${proc.allocatedGB} GB in RAM`}
              >
                <span className="font-mono font-bold text-[10px] text-white leading-none truncate px-1 shadow-xs">
                  {proc.id}
                </span>
                <span className="text-[8px] font-mono text-white/90 font-medium leading-none mt-0.5">
                  {proc.allocatedGB}G
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1">
          <span>0 GB</span>
          <span>4 GB</span>
          <span>8 GB</span>
          <span>12 GB</span>
          <span>16 GB (RAM limit)</span>
        </div>
      </div>

      {/* Secondary Storage (Pagefile Swap) Visualization */}
      <div className={`p-3.5 rounded-lg border shadow-xs ${
        isOvercommitted 
          ? 'bg-red-50/50 border-red-200' 
          : 'bg-emerald-50/50 border-emerald-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-ink-muted" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Secondary storage: {isSsd ? 'NVMe SSD pagefile' : 'Mechanical HDD pagefile'}
            </span>
          </div>

          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
            isOvercommitted 
              ? 'bg-red-100 text-red-800 border-red-300' 
              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
          }`}>
            {isOvercommitted ? `Active paging: ${totalSwapped} GB swapped` : 'Paging idle: 0 GB swapped'}
          </span>
        </div>

        {isOvercommitted ? (
          <div>
            <p className="text-xs text-ink-secondary leading-relaxed font-sans mb-3">
              Memory demand ({totalDemand} GB) exceeds physical RAM (16 GB) by {memoryResult.overcommitAmountGB} GB. The OS virtual memory manager had to evict background and game pages to secondary storage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded bg-paper-50 border border-paper-300 shadow-xs">
                <span className="text-[10px] text-ink-muted block font-semibold">Page fault latency</span>
                <span className="text-sm font-semibold text-red-700">
                  {isSsd ? '100 µs (0.1 ms)' : '8.0 ms (8,000 µs)'}
                </span>
              </div>

              <div className="p-2.5 rounded bg-paper-50 border border-paper-300 shadow-xs">
                <span className="text-[10px] text-ink-muted block font-semibold">Paging effective access time (EAT)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-copper-700">
                    ~{memoryResult.pagingEATNs}
                  </span>
                  <span className="text-xs text-ink-muted">ns</span>
                </div>
                <span className="text-[9px] text-ink-muted block mt-0.5">
                  (Report: {isSsd ? 'approx 110 ns' : 'approx 900 ns'})
                </span>
              </div>

              <div className="p-2.5 rounded bg-paper-50 border border-paper-300 shadow-xs">
                <span className="text-[10px] text-ink-muted block font-semibold">CPU stall probability</span>
                <span className="text-sm font-semibold text-amber-800">
                  {memoryResult.cpuStallProbabilityPercent}%
                </span>
                <span className="text-[9px] text-ink-muted block mt-0.5">
                  CPU idles waiting for I/O
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All processes fit within physical RAM. Page fault rate is essentially zero. Effective access time is pure RAM speed (100 ns).
            </span>
          </div>
        )}
      </div>

      {/* Explanation Box */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 text-xs shadow-xs">
        <h4 className="font-semibold text-ink-primary font-mono mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-ink-muted" />
          The academic mystery: Why does CPU utilization remain at ~40% during freezes?
        </h4>
        <p className="text-ink-secondary text-[11px] leading-relaxed">
          When a thread triggers a page fault on an evicted page, the CPU hardware generates a page fault interrupt. The OS switches the thread from the <strong>RUNNING</strong> state to the <strong>WAITING</strong> (I/O blocked) state while issuing a read request to the disk queue. Because an HDD access takes <strong>8,000,000 ns</strong> (compared to 100 ns for RAM), the CPU core has no runnable instructions for that thread and enters the idle loop. Thus, system monitors report low CPU usage (~40%) even though the game has completely frozen.
        </p>
      </div>
    </div>
  );
};
