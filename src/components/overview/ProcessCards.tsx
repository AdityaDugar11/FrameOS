import React from 'react';
import { 
  Gamepad2, 
  Globe, 
  ShieldAlert, 
  DownloadCloud, 
  Music, 
  MessageSquare,
  HardDrive,
  Cpu,
  Layers
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

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
          <Layers className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-300">
            Active system processes ({processes.length})
          </h2>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Uniprocessor · 6 processes at t = 0
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {processes.map((proc) => {
          const Icon = PROCESS_ICONS[proc.iconName] || Cpu;
          const isCurrentRunning = activeProcessId === proc.id;
          
          const pMetrics = schedulerResult.processMetrics[proc.id];
          const hasFinished = simCurrentTime >= (pMetrics?.completionTime ?? 999);
          
          let stateLabel: 'Running' | 'Ready' | 'Waiting' | 'Terminated' = 'Ready';
          if (hasFinished && simCurrentTime > 0) {
            stateLabel = 'Terminated';
          } else if (isCurrentRunning) {
            stateLabel = 'Running';
          } else if (proc.id === 'G' && !isCurrentRunning && simCurrentTime > 0) {
            stateLabel = 'Waiting';
          } else {
            stateLabel = 'Ready';
          }

          const memInfo = memoryResult.processes.find(p => p.id === proc.id);
          const allocatedGB = memInfo?.allocatedGB ?? proc.memoryGB;
          const swappedGB = memInfo?.swappedGB ?? 0;

          return (
            <div
              key={proc.id}
              className={`surface-subtle rounded-xl p-3.5 flex flex-col justify-between border transition-colors ${
                isCurrentRunning
                  ? 'border-cyan-500/80 bg-dark-850'
                  : stateLabel === 'Waiting'
                  ? 'border-amber-700/50 bg-dark-900'
                  : stateLabel === 'Terminated'
                  ? 'border-slate-800/40 opacity-60 bg-dark-950'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Icon, ID & State Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-black"
                    style={{ backgroundColor: proc.accentHex }}
                  >
                    <Icon className="w-3.5 h-3.5 text-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-xs text-white">
                        {proc.id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        #{1000 + processes.indexOf(proc) * 12}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-300 block truncate max-w-[100px]" title={proc.name}>
                      {proc.shortName}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded border ${
                  stateLabel === 'Running'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700'
                    : stateLabel === 'Waiting'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                    : stateLabel === 'Terminated'
                    ? 'bg-dark-850 text-slate-400 border-slate-800'
                    : 'bg-dark-850 text-slate-300 border-slate-800'
                }`}>
                  {stateLabel}
                </span>
              </div>

              {/* Middle Metrics: Burst & Memory */}
              <div className="my-3 space-y-1.5 border-t border-b border-slate-800/80 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-400" /> Burst:
                  </span>
                  <span className="font-mono font-semibold text-slate-200">
                    {proc.cpuBurst} ms
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-400" /> RAM:
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-slate-200">
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
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  proc.priority === 'HIGH'
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
                    : proc.priority === 'MEDIUM'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    : 'bg-dark-850 text-slate-400 border border-slate-800'
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
