import React from 'react';
import { 
  HardDrive, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowDownUp, 
  Clock, 
  Sparkles,
  Layers
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
  const isTrimming = optimizations.workingSetTrimming;

  // Total physical RAM = 16 GB
  const physicalRam = memoryResult.totalPhysicalRamGB;
  const totalAllocated = memoryResult.totalAllocatedGB;
  const totalDemand = memoryResult.totalMemoryDemandGB;
  const totalSwapped = memoryResult.totalSwappedGB;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
      {/* Header and Pagefile Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Paging & Virtual Memory Allocation Map
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Physical RAM: 16 GB · Current Demand: {totalDemand} GB ({isOvercommitted ? '1 GB Overcommitted' : 'Fits in RAM'})
          </p>
        </div>

        {/* Pagefile Technology Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Pagefile Storage:</span>
          <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setMemoryConfig({ pagefileType: 'HDD' });
                if (optimizations.ssdPagefile) toggleOptimization('ssdPagefile');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                !isSsd
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mechanical HDD (8 ms)
            </button>
            <button
              onClick={() => {
                setMemoryConfig({ pagefileType: 'SSD' });
                if (!optimizations.ssdPagefile) toggleOptimization('ssdPagefile');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                isSsd
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NVMe SSD (100 µs)
            </button>
          </div>
        </div>
      </div>

      {/* Memory Allocation Bar Visualizer */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-slate-300 font-semibold">
            Physical RAM Allocation (16 GB Capacity)
          </span>
          <span className={isOvercommitted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {totalAllocated} GB Resident in RAM ({((totalAllocated / physicalRam) * 100).toFixed(0)}% full)
          </span>
        </div>

        {/* Main 16 GB RAM Container */}
        <div className="w-full h-12 bg-dark-950 rounded-xl p-1 flex border border-slate-700/80 overflow-hidden relative">
          {memoryResult.processes.map((proc) => {
            const widthPercent = (proc.allocatedGB / physicalRam) * 100;
            if (widthPercent <= 0) return null;

            return (
              <div
                key={proc.id}
                className="h-full relative flex flex-col justify-center items-center select-none border-r border-dark-950/40 transition-all duration-300"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: proc.color,
                }}
                title={`${proc.name}: ${proc.allocatedGB} GB in RAM`}
              >
                <span className="font-mono font-bold text-[11px] text-black leading-none truncate px-1">
                  {proc.id}
                </span>
                <span className="text-[9px] font-mono text-black/80 font-semibold leading-none mt-0.5">
                  {proc.allocatedGB}G
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0 GB</span>
          <span>4 GB</span>
          <span>8 GB</span>
          <span>12 GB</span>
          <span>16 GB (RAM Limit)</span>
        </div>
      </div>

      {/* Secondary Storage (Pagefile Swap) Visualization */}
      <div className={`p-4 rounded-xl border transition-all ${
        isOvercommitted 
          ? 'bg-rose-950/20 border-rose-800/50' 
          : 'bg-emerald-950/20 border-emerald-800/50'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Secondary Storage Pagefile: {isSsd ? 'NVMe SSD Pagefile' : 'Mechanical HDD Pagefile'}
            </span>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            isOvercommitted 
              ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse' 
              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
          }`}>
            {isOvercommitted ? `ACTIVE PAGING: ${totalSwapped} GB SWAPPED` : 'PAGING IDLE: 0 GB SWAPPED'}
          </span>
        </div>

        {isOvercommitted ? (
          <div>
            <p className="text-xs text-rose-300 leading-relaxed font-sans mb-3">
              Memory demand ({totalDemand} GB) exceeds physical RAM (16 GB) by {memoryResult.overcommitAmountGB} GB. The OS Virtual Memory Manager had to evict background and game pages to the {isSsd ? 'SSD' : 'mechanical HDD'} pagefile!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Page Fault Latency</span>
                <span className="text-base font-bold text-rose-400">
                  {isSsd ? '100 µs (0.1 ms)' : '8.0 ms (8,000 µs)'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Paging Effective Access Time (EAT)</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-cyan-300">
                    ~{memoryResult.pagingEATNs}
                  </span>
                  <span className="text-xs text-slate-400">ns</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  (Report: {isSsd ? 'approx 110 ns' : 'approx 900 ns'})
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CPU Stalling Probability</span>
                <span className="text-base font-bold text-amber-400">
                  {memoryResult.cpuStallProbabilityPercent}%
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  CPU stays idle waiting for disk I/O!
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All processes fit within physical RAM! Page fault rate is essentially zero. Effective Access Time is pure RAM speed (100 ns).
            </span>
          </div>
        )}
      </div>

      {/* Explanation Box: Why CPU is Idle During Paging */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <h4 className="font-bold text-slate-200 font-mono mb-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          The Academic Mystery: Why Does CPU Utilization Remain at Only ~40% During Freezes?
        </h4>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          When a thread triggers a page fault on an evicted page, the CPU hardware generates a page fault interrupt. The OS switches the thread from the <strong>RUNNING</strong> state to the <strong>WAITING</strong> (I/O Blocked) state while sending a read request to the secondary storage disk queue. Because an HDD access takes <strong>8,000,000 ns</strong> (compared to 100 ns for RAM), the CPU core has no runnable instructions for that thread and enters the idle loop. Thus, system monitors report low CPU usage (~40%) even though the game has completely frozen!
        </p>
      </div>
    </div>
  );
};
