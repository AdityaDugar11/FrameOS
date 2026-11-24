import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
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
    <div className="glass-panel rounded-xl p-4 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Algorithm Selector Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium shrink-0">
          Algorithm:
        </span>
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSchedulerAlgorithm('BASELINE_RR')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
              !isFwrr
                ? 'bg-dark-800 text-rose-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline round robin (q = 4ms)
          </button>
          <button
            onClick={() => setSchedulerAlgorithm('PROPOSED_FWRR')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
              isFwrr
                ? 'bg-cyan-500 text-black font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Foreground-weighted round robin
          </button>
        </div>
      </div>

      {/* Aging Toggle */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={optimizations.aging}
            onChange={() => toggleOptimization('aging')}
            className="w-4 h-4 rounded bg-dark-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-medium text-slate-200 block">Aging mechanism</span>
            <span className="text-[10px] text-slate-400 font-mono">Prevents background task starvation</span>
          </div>
        </label>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-slate-800">
          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-mono text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 font-mono text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          )}

          <button
            onClick={stepForward}
            className="p-1 rounded bg-dark-850 text-slate-300 hover:text-white hover:bg-dark-800 transition-colors"
            title="Step forward (+1 ms)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="p-1 rounded bg-dark-850 text-slate-400 hover:text-rose-400 hover:bg-dark-800 transition-colors"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                playbackSpeed === spd
                  ? 'bg-dark-800 text-white border border-slate-700'
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
