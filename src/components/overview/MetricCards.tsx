import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Database, 
  Network, 
  Activity, 
  Clock,
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const MetricCards: React.FC = () => {
  const { 
    schedulerResult, 
    memoryResult, 
    ioResult, 
    optimizations 
  } = useFrameOSStore();

  const isDma = optimizations.dma;
  const isAllOptimized = Object.values(optimizations).every(Boolean);

  const fps = isAllOptimized ? 60 : schedulerResult.gameMaxInterSliceWait > 16.6667 ? 28 : 45;
  const hasDeadlineViolation = schedulerResult.gameMaxInterSliceWait > 16.6667;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. CPU Utilization Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            CPU utilization
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-white">
              {isDma ? '18.4%' : '41.2%'}
            </span>
            <span className="text-[10px] text-amber-400 font-mono">
              (stalling)
            </span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${isDma ? 'bg-cyan-400 w-[18%]' : 'bg-amber-400 w-[41%]'}`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 leading-tight">
          {isDma 
            ? 'DMA active: 0.38% overhead' 
            : 'Paging stalls force CPU idle during game freeze'}
        </p>
      </div>

      {/* 2. RAM Consumption Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            RAM consumption
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-white">
              {memoryResult.totalMemoryDemandGB}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 16 GB</span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${
                memoryResult.isOvercommitted ? 'bg-rose-500 w-full' : 'bg-emerald-400 w-[85%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2 leading-tight font-mono ${
          memoryResult.isOvercommitted ? 'text-rose-400' : 'text-emerald-400'
        }`}>
          {memoryResult.isOvercommitted 
            ? `+${memoryResult.overcommitAmountGB} GB overcommit (paging)` 
            : 'Fits in physical RAM'}
        </p>
      </div>

      {/* 3. Disk Utilization Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Disk request load
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <Database className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-white">
              {ioResult.totalDiskDemandReqPerSec}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100 req/s</span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${
                ioResult.isOverloaded ? 'bg-rose-500 w-full' : 'bg-emerald-400 w-[70%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 leading-tight">
          {optimizations.ioPrioritization 
            ? 'I/O prioritized: game assets jump queue' 
            : 'Overload: +20 req/s queue accumulation'}
        </p>
      </div>

      {/* 4. Network & PIO/DMA Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Network & DMA
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <Network className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-white">
              100
            </span>
            <span className="text-xs font-mono text-slate-400">Mbps (12.5 MB/s)</span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${
                isDma ? 'bg-emerald-400 w-[1%]' : 'bg-rose-500 w-[31%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 leading-tight font-mono">
          CPU cost: <span className={isDma ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
            {ioResult.cpuOverheadPercent}%
          </span> {isDma ? '(DMA)' : '(PIO copy)'}
        </p>
      </div>

      {/* 5. Target FPS Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Rendered frame rate
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-semibold font-mono ${
              fps === 60 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {fps}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 60 FPS</span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${
                fps === 60 ? 'bg-emerald-400 w-full' : 'bg-rose-500 w-[46%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2 leading-tight font-medium ${
          fps === 60 ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {fps === 60 ? 'Stable 60 FPS target' : 'Microstuttering detected'}
        </p>
      </div>

      {/* 6. Frame Deadline Status Card */}
      <div className="glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            Frame deadline
          </span>
          <div className="p-1 rounded bg-dark-850 text-slate-400 border border-slate-800">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-semibold font-mono ${
              !hasDeadlineViolation ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {schedulerResult.gameMaxInterSliceWait} ms
            </span>
          </div>
          <div className="w-full bg-dark-950 h-1.5 rounded-full mt-2 overflow-hidden relative border border-slate-800/60">
            <div 
              className={`h-full transition-colors ${
                !hasDeadlineViolation ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (schedulerResult.gameMaxInterSliceWait / 20) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2 leading-tight">
          Budget: <span className="font-mono text-slate-200">16.67 ms</span>{' '}
          {hasDeadlineViolation ? (
            <span className="text-rose-400 font-medium">(missed)</span>
          ) : (
            <span className="text-emerald-400 font-medium">(met)</span>
          )}
        </p>
      </div>
    </div>
  );
};
