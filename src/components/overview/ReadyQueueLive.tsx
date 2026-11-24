import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Cpu, 
  ArrowRight, 
  Clock, 
  Layers,
  AlertTriangle,
  Lock
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
    setSimTime,
    processes,
    schedulerAlgorithm
  } = useFrameOSStore();

  const totalTime = schedulerResult.totalTime;

  // Active slice at current simulation time
  const currentSlice = schedulerResult.slices.find(
    s => simCurrentTime >= s.startTime && simCurrentTime < s.endTime
  );

  const activeProcess = currentSlice 
    ? processes.find(p => p.id === currentSlice.processId) 
    : null;

  // Calculate remaining burst for each process at simCurrentTime
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

  // Calculate ready queue order at current time
  // Filter active processes that still have remaining burst and aren't currently executing
  const readyQueueProcesses = processes.filter(p => {
    if (activeProcess && p.id === activeProcess.id) return false;
    return remainingAtCurrentTime[p.id] > 0;
  });

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Live CPU Core & Ready Queue Execution
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Algorithm: <span className="font-mono text-cyan-300 font-semibold">{schedulerAlgorithm === 'BASELINE_RR' ? 'Baseline Round Robin (4ms flat)' : 'Proposed Foreground-Weighted RR'}</span>
          </p>
        </div>

        {/* Playback & Step Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-dark-950 px-3 py-1 rounded-xl border border-slate-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Time:</span>
            <span className="text-white font-bold">{simCurrentTime}</span>
            <span className="text-slate-400">/ {totalTime} ms</span>
          </div>

          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
              title="Pause"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors"
              title="Play"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={stepForward}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-700 border border-slate-700 transition-colors"
            title="Step Forward (+1 ms)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-rose-400 hover:bg-dark-700 border border-slate-700 transition-colors"
            title="Reset Time to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline: Ready Queue -> CPU Execution -> Done */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* Ready Queue (Left - 7 cols) */}
        <div className="lg:col-span-7 bg-dark-950/70 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Ready Queue (FIFO Order)
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {readyQueueProcesses.length} Waiting Processes
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2 min-h-[64px]">
            {readyQueueProcesses.length > 0 ? (
              readyQueueProcesses.map((p, idx) => (
                <div
                  key={p.id}
                  className="shrink-0 flex items-center gap-2 bg-dark-850 px-3 py-2 rounded-xl border border-slate-700/70"
                >
                  <span 
                    className="w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center text-black"
                    style={{ backgroundColor: p.accentHex }}
                  >
                    {p.id}
                  </span>
                  <div className="text-[11px]">
                    <span className="font-semibold text-slate-200 block truncate max-w-[80px]">
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
                {simCurrentTime >= totalTime ? 'All processes have completed!' : 'Ready queue is currently empty.'}
              </div>
            )}
          </div>
        </div>

        {/* CPU Core (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-cyan-950/30 to-dark-950 rounded-xl p-3 border border-cyan-800/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-cyan-300 tracking-wider font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Logical CPU Core #0 (Running)
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              100% Core Focus
            </span>
          </div>

          {activeProcess ? (
            <div className="flex items-center gap-3 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/40">
              <span 
                className="w-10 h-10 rounded-xl font-mono font-extrabold text-sm flex items-center justify-center text-black shadow-lg shadow-cyan-500/20"
                style={{ backgroundColor: activeProcess.accentHex }}
              >
                {activeProcess.id}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {activeProcess.name}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    Slice: {currentSlice?.startTime} - {currentSlice?.endTime} ms
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300 mt-0.5">
                  <span>Slice Dur: {currentSlice?.duration} ms</span>
                  <span>Rem Burst: {currentSlice?.remainingBurst} ms</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-xs font-mono text-slate-400">
              CPU Idle / Waiting for next slice
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
