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
    <div className="bg-paper-50 rounded-lg p-4 border border-paper-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Algorithm Selector Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-secondary font-semibold shrink-0">
          Algorithm:
        </span>
        <div className="flex items-center gap-1 bg-paper-200 p-1 rounded border border-paper-300">
          <button
            onClick={() => setSchedulerAlgorithm('BASELINE_RR')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              !isFwrr
                ? 'bg-paper-50 text-red-800 font-semibold border border-paper-300 shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Baseline round robin (q = 4ms)
          </button>
          <button
            onClick={() => setSchedulerAlgorithm('PROPOSED_FWRR')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
              isFwrr
                ? 'bg-copper-600 text-white font-semibold shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
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
            className="w-4 h-4 rounded bg-paper-50 border-paper-300 text-copper-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <div className="text-xs">
            <span className="font-semibold text-ink-primary block">Aging mechanism</span>
            <span className="text-[10px] text-ink-muted font-mono">Prevents background task starvation</span>
          </div>
        </label>
      </div>

      {/* Playback Controls & Speed */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-paper-200 p-1 rounded border border-paper-300">
          {isPlaying ? (
            <button
              onClick={pauseSimulation}
              className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 font-mono text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="px-2.5 py-1 rounded bg-copper-600 text-white hover:bg-copper-700 font-mono text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          )}

          <button
            onClick={stepForward}
            className="p-1 rounded bg-paper-50 text-ink-primary hover:bg-paper-100 border border-paper-300 transition-colors shadow-xs"
            title="Step forward (+1 ms)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetSimulationTime}
            className="p-1 rounded bg-paper-50 text-ink-muted hover:text-red-700 hover:bg-red-50 border border-paper-300 transition-colors shadow-xs"
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-paper-200 p-1 rounded border border-paper-300 text-xs font-mono">
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                playbackSpeed === spd
                  ? 'bg-paper-50 text-ink-primary font-semibold border border-paper-300 shadow-xs'
                  : 'text-ink-secondary hover:text-ink-primary'
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
