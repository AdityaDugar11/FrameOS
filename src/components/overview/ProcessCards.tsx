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
          <Layers className="w-4 h-4 text-ink-muted" />
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-secondary">
            Active system processes ({processes.length})
          </h2>
        </div>
        <div className="text-[11px] font-mono text-ink-muted">
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
              className={`rounded-lg p-3.5 flex flex-col justify-between border transition-all shadow-xs ${
                isCurrentRunning
                  ? 'border-ink-primary bg-paper-100 shadow-sm'
                  : stateLabel === 'Waiting'
                  ? 'border-amber-300 bg-amber-50/40'
                  : stateLabel === 'Terminated'
                  ? 'border-paper-300 opacity-60 bg-paper-200/50'
                  : 'bg-paper-50 border-paper-300 hover:border-paper-400'
              }`}
            >
              {/* Card Header: Icon, ID & State Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-xs text-white shadow-xs"
                    style={{ backgroundColor: proc.accentHex }}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-xs text-ink-primary">
                        {proc.id}
                      </span>
                      <span className="text-[10px] text-ink-muted font-mono">
                        #{1000 + processes.indexOf(proc) * 12}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-ink-secondary block truncate max-w-[100px]" title={proc.name}>
                      {proc.shortName}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  stateLabel === 'Running'
                    ? 'bg-paper-200 text-ink-primary border-ink-primary'
                    : stateLabel === 'Waiting'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : stateLabel === 'Terminated'
                    ? 'bg-paper-200 text-ink-muted border-paper-300'
                    : 'bg-paper-100 text-ink-secondary border-paper-300'
                }`}>
                  {stateLabel}
                </span>
              </div>

              {/* Middle Metrics: Burst & Memory */}
              <div className="my-3 space-y-1.5 border-t border-b border-paper-300 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-mono text-[11px] flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-ink-muted" /> Burst:
                  </span>
                  <span className="font-mono font-semibold text-ink-primary">
                    {proc.cpuBurst} ms
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-secondary font-mono text-[11px] flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-ink-muted" /> RAM:
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-ink-primary">
                      {allocatedGB} GB
                    </span>
                    {swappedGB > 0 && (
                      <span className="text-[9px] text-red-700 font-mono block font-medium">
                        ({swappedGB} GB swap)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Priority & Scheduling Info */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-ink-muted">Priority:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  proc.priority === 'HIGH'
                    ? 'bg-copper-600/10 text-copper-700 border border-copper-300'
                    : proc.priority === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-paper-200 text-ink-muted border border-paper-300'
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
