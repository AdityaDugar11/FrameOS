import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Cpu, 
  ArrowRight, 
  Clock, 
  Layers
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { ProcessId } from '../../types/simulation';

export const ReadyQueueLive: React.FC = () => {
  const { 
    schedulerResult, 
    simCurrentTime, 
    isPlaying, 
    startSimulation, 
    pauseSimulation, 
    stepForward, 
    resetSimulationTime, 
    processes,
    schedulerAlgorithm
  } = useFrameOSStore();

  const totalTime = schedulerResult.totalTime;

  const currentSlice = schedulerResult.slices.find(
    s => simCurrentTime >= s.startTime && simCurrentTime < s.endTime
  );

  const activeProcess = currentSlice 
    ? processes.find(p => p.id === currentSlice.processId) 
    : null;

  const remainingAtCurrentTime: Record<ProcessId, number> = {} as Record<ProcessId, number>;
  processes.forEach(p => {
    let executedBefore = 0;
    schedulerResult.slices.forEach(s => {
      if (s.processId === p.id) {
        if (s.endTime <= simCurrentTime) {
          executedBefore += s.duration;
        } else if (s.startTime < simCurrentTime) {
          executedBefore += (simCurrentTime - s.startTime);
        }
      }
    });
    remainingAtCurrentTime[p.id] = Math.max(0, p.cpuBurst - executedBefore);
  });

  const readyQueueProcesses = processes.filter(p => {
    if (activeProcess && p.id === activeProcess.id) return false;
    return remainingAtCurrentTime[p.id] > 0;
  });

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800/80">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Live CPU core & ready queue execution
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Policy: <span className="font-mono text-cyan-300 font-medium">{schedulerAlgorithm === 'BASELINE_RR' ? 'Baseline round robin (4ms flat)' : 'Foreground-weighted round robin'}</span>
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Time:</span>
            <span className="text-white font-semibold">{simCurrentTime}</span>
            <span className="text-slate-400">/ {totalTime} ms</span>
          </div>

          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
              title="Run simulation"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={stepForward}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-750 border border-slate-700/80 transition-colors"
            title="Step forward (+1 ms)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-rose-400 hover:bg-dark-750 border border-slate-700/80 transition-colors"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Ready Queue (Left - 7 cols) */}
        <div className="lg:col-span-7 bg-dark-950 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Ready queue (FIFO order)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {readyQueueProcesses.length} waiting
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[56px]">
            {readyQueueProcesses.length > 0 ? (
              readyQueueProcesses.map((p, idx) => (
                <div
                  key={p.id}
                  className="shrink-0 flex items-center gap-2 bg-dark-900 px-2.5 py-1.5 rounded-lg border border-slate-800"
                >
                  <span 
                    className="w-5 h-5 rounded font-mono font-bold text-xs flex items-center justify-center text-black"
                    style={{ backgroundColor: p.accentHex }}
                  >
                    {p.id}
                  </span>
                  <div className="text-[11px]">
                    <span className="font-medium text-slate-300 block truncate max-w-[75px]">
                      {p.shortName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Rem: {remainingAtCurrentTime[p.id]}ms
                    </span>
                  </div>
                  {idx < readyQueueProcesses.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-slate-400 ml-1" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 font-mono italic py-2">
                {simCurrentTime >= totalTime ? 'All processes completed' : 'Ready queue is empty'}
              </div>
            )}
          </div>
        </div>

        {/* Logical CPU Core (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-dark-950 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Logical CPU core #0
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-dark-850 text-slate-300 border border-slate-700">
              Active slice
            </span>
          </div>

          {activeProcess ? (
            <div className="flex items-center gap-3 bg-dark-900 p-2.5 rounded-lg border border-slate-700/80">
              <span 
                className="w-8 h-8 rounded-lg font-mono font-bold text-sm flex items-center justify-center text-black shadow"
                style={{ backgroundColor: activeProcess.accentHex }}
              >
                {activeProcess.id}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {activeProcess.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-medium">
                    {currentSlice?.startTime} - {currentSlice?.endTime} ms
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span>Slice: {currentSlice?.duration} ms</span>
                  <span>Burst left: {currentSlice?.remainingBurst} ms</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-3 text-xs font-mono text-slate-400">
              CPU idle / waiting for next slice
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
