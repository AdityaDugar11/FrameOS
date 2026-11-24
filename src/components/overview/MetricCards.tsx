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
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            CPU utilization
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <Cpu className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-ink-primary">
              {isDma ? '18.4%' : '41.2%'}
            </span>
            <span className="text-[10px] text-amber-800 font-mono font-medium">
              (stalling)
            </span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden border border-paper-300">
            <div 
              className={`h-full transition-all ${isDma ? 'bg-emerald-600 w-[18%]' : 'bg-amber-600 w-[41%]'}`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-ink-muted mt-2 leading-tight">
          {isDma 
            ? 'DMA active: 0.38% overhead' 
            : 'Paging stalls force CPU idle during game freeze'}
        </p>
      </div>

      {/* 2. RAM Consumption Card */}
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            RAM consumption
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <HardDrive className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-ink-primary">
              {memoryResult.totalMemoryDemandGB}
            </span>
            <span className="text-xs font-mono text-ink-muted">/ 16 GB</span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden border border-paper-300">
            <div 
              className={`h-full transition-all ${
                memoryResult.isOvercommitted ? 'bg-red-600 w-full' : 'bg-emerald-600 w-[85%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2 leading-tight font-mono font-medium ${
          memoryResult.isOvercommitted ? 'text-red-700' : 'text-emerald-700'
        }`}>
          {memoryResult.isOvercommitted 
            ? `+${memoryResult.overcommitAmountGB} GB overcommit (paging)` 
            : 'Fits in physical RAM'}
        </p>
      </div>

      {/* 3. Disk Utilization Card */}
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            Disk request load
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <Database className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-ink-primary">
              {ioResult.totalDiskDemandReqPerSec}
            </span>
            <span className="text-xs font-mono text-ink-muted">/ 100 req/s</span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden border border-paper-300">
            <div 
              className={`h-full transition-all ${
                ioResult.isOverloaded ? 'bg-red-600 w-full' : 'bg-emerald-600 w-[70%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-ink-muted mt-2 leading-tight">
          {optimizations.ioPrioritization 
            ? 'I/O prioritized: game assets jump queue' 
            : 'Overload: +20 req/s queue accumulation'}
        </p>
      </div>

      {/* 4. Network & PIO/DMA Card */}
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            Network & DMA
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <Network className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold font-mono text-ink-primary">
              100
            </span>
            <span className="text-xs font-mono text-ink-muted">Mbps (12.5 MB/s)</span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden border border-paper-300">
            <div 
              className={`h-full transition-all ${
                isDma ? 'bg-emerald-600 w-[1%]' : 'bg-red-600 w-[31%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-ink-muted mt-2 leading-tight font-mono">
          CPU cost: <span className={isDma ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
            {ioResult.cpuOverheadPercent}%
          </span> {isDma ? '(DMA)' : '(PIO copy)'}
        </p>
      </div>

      {/* 5. Target FPS Card */}
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            Rendered frame rate
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-semibold font-mono ${
              fps === 60 ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {fps}
            </span>
            <span className="text-xs font-mono text-ink-muted">/ 60 FPS</span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden border border-paper-300">
            <div 
              className={`h-full transition-all ${
                fps === 60 ? 'bg-emerald-600 w-full' : 'bg-red-600 w-[46%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2 leading-tight font-medium ${
          fps === 60 ? 'text-emerald-700' : 'text-red-700'
        }`}>
          {fps === 60 ? 'Stable 60 FPS target' : 'Microstuttering detected'}
        </p>
      </div>

      {/* 6. Frame Deadline Status Card */}
      <div className="bg-paper-50 rounded-lg p-3.5 flex flex-col justify-between border border-paper-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-secondary">
            Frame deadline
          </span>
          <div className="p-1 rounded bg-paper-200 text-ink-muted border border-paper-300">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-semibold font-mono ${
              !hasDeadlineViolation ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {schedulerResult.gameMaxInterSliceWait} ms
            </span>
          </div>
          <div className="w-full bg-paper-200 h-1.5 rounded-full mt-2 overflow-hidden relative border border-paper-300">
            <div 
              className={`h-full transition-all ${
                !hasDeadlineViolation ? 'bg-emerald-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(100, (schedulerResult.gameMaxInterSliceWait / 20) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-ink-muted mt-2 leading-tight">
          Budget: <span className="font-mono text-ink-primary font-medium">16.67 ms</span>{' '}
          {hasDeadlineViolation ? (
            <span className="text-red-700 font-semibold">(missed)</span>
          ) : (
            <span className="text-emerald-700 font-semibold">(met)</span>
          )}
        </p>
      </div>
    </div>
  );
};
