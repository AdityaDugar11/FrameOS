import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Zap, 
  ShieldAlert, 
  Layers, 
  Gauge,
  Sliders
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const SchedulerControls: React.FC = () => {
  const { 
    schedulerAlgorithm, 
    setSchedulerAlgorithm, 
    isPlaying, 
    startSimulation, 
    pauseSimulation, 
    stepForward, 
    resetSimulationTime,
    playbackSpeed,
    setPlaybackSpeed,
    optimizations,
    toggleOptimization
  } = useFrameOSStore();

  const isFwrr = schedulerAlgorithm === 'PROPOSED_FWRR';

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Algorithm Selector Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold shrink-0">
          Scheduling Policy:
        </span>
        <div className="flex items-center gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSchedulerAlgorithm('BASELINE_RR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              !isFwrr
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            [A] Baseline Round Robin (q = 4ms)
          </button>
          <button
            onClick={() => setSchedulerAlgorithm('PROPOSED_FWRR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isFwrr
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            [B] Proposed Foreground-Weighted RR
          </button>
        </div>
      </div>

      {/* Aging Toggle */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={optimizations.aging}
            onChange={() => toggleOptimization('aging')}
            className="w-4 h-4 rounded bg-dark-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-200 block">Aging Mechanism</span>
            <span className="text-[10px] text-slate-400 font-mono">Prevents background starvation</span>
          </div>
        </label>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800">
          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          )}

          <button
            onClick={stepForward}
            className="px-2.5 py-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-700 font-mono text-xs transition-colors"
            title="Step Forward (+1 ms)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="px-2.5 py-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-rose-400 hover:bg-dark-700 font-mono text-xs transition-colors"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                playbackSpeed === spd
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
