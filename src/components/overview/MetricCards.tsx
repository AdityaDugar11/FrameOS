import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Database, 
  Network, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const MetricCards: React.FC = () => {
  const { 
    schedulerResult, 
    memoryResult, 
    ioResult, 
    optimizations 
  } = useFrameOSStore();

  const isFwrr = optimizations.fwrr;
  const isTrimming = optimizations.workingSetTrimming;
  const isDma = optimizations.dma;
  const isAllOptimized = Object.values(optimizations).every(Boolean);

  const fps = isAllOptimized ? 60 : schedulerResult.gameMaxInterSliceWait > 16.6667 ? 28 : 45;
  const hasDeadlineViolation = schedulerResult.gameMaxInterSliceWait > 16.6667;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. CPU Utilization Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            CPU Utilization
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
            <Cpu className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {isDma ? '18.4%' : '41.2%'}
            </span>
            <span className="text-[11px] text-amber-400 font-mono font-medium">
              (Low CPU!)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isDma ? 'bg-cyan-400 w-[18%]' : 'bg-amber-400 w-[41%]'}`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2.5 leading-tight">
          {isDma 
            ? 'DMA active: 0.38% network copy overhead.' 
            : 'Paging I/O stalls cause CPU to idle while game freezes.'}
        </p>
      </div>

      {/* 2. RAM Consumption Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            RAM Consumption
          </span>
          <div className={`p-1.5 rounded-lg border ${
            memoryResult.isOvercommitted 
              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40' 
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
          }`}>
            <HardDrive className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {memoryResult.totalMemoryDemandGB}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 16 GB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                memoryResult.isOvercommitted ? 'bg-rose-500 w-[100%]' : 'bg-emerald-400 w-[85%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2.5 leading-tight font-mono ${
          memoryResult.isOvercommitted ? 'text-rose-400' : 'text-emerald-400'
        }`}>
          {memoryResult.isOvercommitted 
            ? `+${memoryResult.overcommitAmountGB} GB Overcommitted (Paging)` 
            : 'Working sets fit in physical RAM'}
        </p>
      </div>

      {/* 3. Disk Utilization Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Disk Utilization
          </span>
          <div className={`p-1.5 rounded-lg border ${
            ioResult.isOverloaded 
              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40' 
              : 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
          }`}>
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              {ioResult.totalDiskDemandReqPerSec}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100 req/s</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                ioResult.isOverloaded ? 'bg-rose-500 w-[100%]' : 'bg-emerald-400 w-[70%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2.5 leading-tight">
          {optimizations.ioPrioritization 
            ? 'I/O Prioritized: Game assets jump queue.' 
            : 'Overload: +20 req/s accumulating in queue.'}
        </p>
      </div>

      {/* 4. Network & PIO/DMA Card */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Network & DMA
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Network className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold font-mono text-white">
              100
            </span>
            <span className="text-xs font-mono text-slate-400">Mbps (12.5 MB/s)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isDma ? 'bg-emerald-400 w-[1%]' : 'bg-rose-500 w-[31%]'
              }`} 
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2.5 leading-tight font-mono">
          CPU Cost: <span className={isDma ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {ioResult.cpuOverheadPercent}%
          </span> {isDma ? '(DMA Active)' : '(PIO Byte Copy)'}
        </p>
      </div>

      {/* 5. Target FPS Card */}
      <div className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border transition-all ${
        fps === 60 ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-rose-800/50 bg-rose-950/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Rendered FPS
          </span>
          <div className={`p-1.5 rounded-lg border ${
            fps === 60 ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold font-mono ${
              fps === 60 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {fps}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 60 FPS</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                fps === 60 ? 'bg-emerald-400 w-full' : 'bg-rose-500 w-[46%]'
              }`} 
            />
          </div>
        </div>

        <p className={`text-[10px] mt-2.5 leading-tight font-semibold ${
          fps === 60 ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {fps === 60 ? 'Smooth 60 FPS Locked' : 'Severe Microstuttering'}
        </p>
      </div>

      {/* 6. Frame Deadline Status Card */}
      <div className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border transition-all ${
        !hasDeadlineViolation ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-rose-800/50 bg-rose-950/20'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Frame Deadline
          </span>
          <div className={`p-1.5 rounded-lg border ${
            !hasDeadlineViolation ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold font-mono ${
              !hasDeadlineViolation ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {schedulerResult.gameMaxInterSliceWait} ms
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-500 ${
                !hasDeadlineViolation ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (schedulerResult.gameMaxInterSliceWait / 20) * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mt-2.5 leading-tight">
          Limit: <span className="font-mono text-cyan-300 font-bold">16.67 ms</span>{' '}
          {hasDeadlineViolation ? (
            <span className="text-rose-400 font-bold">(MISSED!)</span>
          ) : (
            <span className="text-emerald-400 font-bold">(MET)</span>
          )}
        </p>
      </div>
    </div>
  );
};
