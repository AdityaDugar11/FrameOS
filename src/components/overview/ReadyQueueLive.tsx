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
    <div className="bg-paper-50 rounded-lg p-4 border border-paper-300 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Live CPU core & ready queue execution
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Policy: <span className="font-mono text-copper-700 font-semibold">{schedulerAlgorithm === 'BASELINE_RR' ? 'Baseline round robin (4ms flat)' : 'Foreground-weighted round robin'}</span>
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-paper-200 px-2.5 py-1 rounded border border-paper-300 font-mono text-xs text-ink-primary">
            <Clock className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-ink-secondary">Time:</span>
            <span className="font-semibold">{simCurrentTime}</span>
            <span className="text-ink-muted">/ {totalTime} ms</span>
          </div>

          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="p-1.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors shadow-xs"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="p-1.5 rounded bg-copper-600 text-white hover:bg-copper-700 transition-colors shadow-xs"
              title="Run simulation"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={stepForward}
            className="p-1.5 rounded bg-paper-100 text-ink-primary hover:bg-paper-200 border border-paper-300 transition-colors shadow-xs"
            title="Step forward (+1 ms)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="p-1.5 rounded bg-paper-100 text-ink-muted hover:text-red-700 hover:bg-red-50 border border-paper-300 transition-colors shadow-xs"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Ready Queue (Left - 7 cols) */}
        <div className="lg:col-span-7 bg-paper-100 rounded-lg p-3 border border-paper-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-ink-secondary tracking-wider font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-ink-muted" />
              Ready queue (FIFO order)
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              {readyQueueProcesses.length} waiting
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 min-h-[56px]">
            {readyQueueProcesses.length > 0 ? (
              readyQueueProcesses.map((p, idx) => (
                <div
                  key={p.id}
                  className="shrink-0 flex items-center gap-2 bg-paper-50 px-2.5 py-1.5 rounded border border-paper-300 shadow-xs"
                >
                  <span 
                    className="w-5 h-5 rounded font-mono font-bold text-xs flex items-center justify-center text-white"
                    style={{ backgroundColor: p.accentHex }}
                  >
                    {p.id}
                  </span>
                  <div className="text-[11px]">
                    <span className="font-semibold text-ink-primary block truncate max-w-[75px]">
                      {p.shortName}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">
                      Rem: {remainingAtCurrentTime[p.id]}ms
                    </span>
                  </div>
                  {idx < readyQueueProcesses.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-ink-muted ml-1" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-xs text-ink-muted font-mono italic py-2">
                {simCurrentTime >= totalTime ? 'All processes completed' : 'Ready queue is empty'}
              </div>
            )}
          </div>
        </div>

        {/* Logical CPU Core (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-paper-100 rounded-lg p-3 border border-paper-300 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-ink-secondary tracking-wider font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-copper-600" />
              Logical CPU core #0
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-paper-200 text-ink-primary border border-paper-300 font-medium">
              Active slice
            </span>
          </div>

          {activeProcess ? (
            <div className="flex items-center gap-3 bg-paper-50 p-2.5 rounded border border-paper-300 shadow-xs">
              <span 
                className="w-8 h-8 rounded-md font-mono font-bold text-sm flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: activeProcess.accentHex }}
              >
                {activeProcess.id}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-primary">
                    {activeProcess.name}
                  </span>
                  <span className="text-[10px] font-mono text-copper-700 font-semibold">
                    {currentSlice?.startTime} - {currentSlice?.endTime} ms
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-ink-secondary mt-0.5">
                  <span>Slice: {currentSlice?.duration} ms</span>
                  <span>Burst left: {currentSlice?.remainingBurst} ms</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-3 text-xs font-mono text-ink-muted">
              CPU idle / waiting for next slice
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
