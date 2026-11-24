import React from 'react';
import { 
  Gamepad2, 
  Globe, 
  ShieldAlert, 
  DownloadCloud, 
  Music, 
  MessageSquare,
  Clock,
  HardDrive,
  Cpu,
  Layers
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { ProcessId } from '../../types/simulation';

const PROCESS_ICONS: Record<string, React.ElementType> = {
  Gamepad2,
  Globe,
  ShieldAlert,
  DownloadCloud,
  Music,
  MessageSquare,
};

export const ProcessCards: React.FC = () => {
  const { 
    processes, 
    schedulerResult, 
    simCurrentTime, 
    memoryResult 
  } = useFrameOSStore();

  // Find the active slice at the current simulation time
  const currentSlice = schedulerResult.slices.find(
    s => simCurrentTime >= s.startTime && simCurrentTime < s.endTime
  );

  const activeProcessId = currentSlice ? currentSlice.processId : (simCurrentTime >= schedulerResult.totalTime ? null : 'G');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Active System Processes ({processes.length})
          </h2>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Uniprocessor Architecture · 6 Processes at t = 0
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {processes.map((proc) => {
          const Icon = PROCESS_ICONS[proc.iconName] || Cpu;
          const isCurrentRunning = activeProcessId === proc.id;
          
          // Determine dynamic process state based on simulation time
          const pMetrics = schedulerResult.processMetrics[proc.id];
          const hasFinished = simCurrentTime >= (pMetrics?.completionTime ?? 999);
          
          let stateLabel: 'RUNNING' | 'READY' | 'WAITING' | 'TERMINATED' = 'READY';
          if (hasFinished && simCurrentTime > 0) {
            stateLabel = 'TERMINATED';
          } else if (isCurrentRunning) {
            stateLabel = 'RUNNING';
          } else if (proc.id === 'G' && !isCurrentRunning && simCurrentTime > 0) {
            // Check if game is waiting for I/O or Mutex
            stateLabel = 'WAITING';
          } else {
            stateLabel = 'READY';
          }

          // Memory details from memoryResult
          const memInfo = memoryResult.processes.find(p => p.id === proc.id);
          const allocatedGB = memInfo?.allocatedGB ?? proc.memoryGB;
          const swappedGB = memInfo?.swappedGB ?? 0;

          return (
            <div
              key={proc.id}
              className={`glass-panel rounded-2xl p-4 flex flex-col justify-between border transition-all duration-300 relative overflow-hidden ${
                isCurrentRunning
                  ? 'border-cyan-400 shadow-glow-cyan bg-cyan-950/20 ring-1 ring-cyan-500/50'
                  : stateLabel === 'WAITING'
                  ? 'border-amber-700/50 bg-amber-950/10'
                  : stateLabel === 'TERMINATED'
                  ? 'border-slate-800/40 opacity-70 bg-dark-900/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Subtle top indicator bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all"
                style={{ backgroundColor: proc.accentHex }}
              />

              {/* Card Header: Icon, ID & State Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-black shadow-md"
                    style={{ backgroundColor: proc.accentHex }}
                  >
                    <Icon className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-white">
                        {proc.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        PID #{1000 + processes.indexOf(proc) * 12}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-200 block truncate max-w-[110px]" title={proc.name}>
                      {proc.shortName}
                    </span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  stateLabel === 'RUNNING'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 animate-pulse'
                    : stateLabel === 'WAITING'
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : stateLabel === 'TERMINATED'
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                }`}>
                  {stateLabel}
                </span>
              </div>

              {/* Middle Metrics: Burst & Memory */}
              <div className="my-3 space-y-2 border-t border-b border-slate-800/80 py-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" /> CPU Burst:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {proc.cpuBurst} ms
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-purple-400" /> Memory:
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">
                      {allocatedGB} GB
                    </span>
                    {swappedGB > 0 && (
                      <span className="text-[9px] text-rose-400 font-mono block">
                        ({swappedGB} GB swap)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority & Scheduling Info */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Priority:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  proc.priority === 'HIGH'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                    : proc.priority === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {proc.priority}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
