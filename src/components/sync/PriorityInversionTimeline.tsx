import React, { useState } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const PriorityInversionTimeline: React.FC = () => {
  const { 
    syncResult, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const [activeStep, setActiveStep] = useState<number>(0);
  const isInheritance = syncResult.priorityInheritanceEnabled;
  const events = syncResult.timeline;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80 space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Priority inversion simulator & timeline
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Shared resource: <span className="font-mono text-cyan-300">game_asset.pak</span> (exclusive mutex lock)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('priorityInheritance')}
          className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isInheritance
              ? 'bg-emerald-500 text-black font-semibold'
              : 'bg-cyan-500 text-black font-semibold'
          }`}
        >
          {isInheritance ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Priority inheritance active</span>
            </>
          ) : (
            <span>Enable priority inheritance</span>
          )}
        </button>
      </div>

      {/* Metric Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Game lock block duration</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${
              syncResult.gameBlockDurationMs > 5 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {syncResult.gameBlockDurationMs} ms
            </span>
            <span className="text-slate-400 text-xs">
              (Paper: {isInheritance ? '3 ms' : '11 ms'})
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isInheritance ? '73% latency reduction' : 'Exceeds safety margin'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Antivirus priority level</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${isInheritance ? 'text-cyan-400' : 'text-slate-300'}`}>
              {isInheritance ? 'Level 3 (inherited)' : 'Level 1 (low)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isInheritance ? 'Promoted to game priority' : 'Subject to browser preemption'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Frame stutter status</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${isInheritance ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isInheritance ? 'Eliminated' : 'Stutter active'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isInheritance ? 'Lock released at t = 5 ms' : 'Lock held until t = 13 ms'}
          </span>
        </div>
      </div>

      {/* Visual Gantt Timeline for the 3 Processes */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-slate-300">
            Execution Gantt (0 to 17 ms)
          </span>
          <span className="text-slate-400 text-[11px]">
            Click any interval to inspect state
          </span>
        </div>

        <div className="w-full h-11 bg-dark-950 rounded-lg p-0.5 flex border border-slate-800 overflow-hidden relative">
          {events.map((evt, idx) => {
            const widthPct = ((evt.endTimeMs - evt.timeMs) / 17) * 100;
            const isGame = evt.runningProcess === 'G';
            const isBrowser = evt.runningProcess === 'B';
            const isSelected = activeStep === idx;

            const bgColor = isGame ? '#00d0e6' : isBrowser ? '#f59e0b' : '#f43f5e';

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-full relative cursor-pointer flex flex-col items-center justify-center border-r border-dark-950/40 transition-opacity ${
                  isSelected ? 'ring-1 ring-white z-10 brightness-110' : 'opacity-85 hover:opacity-100'
                }`}
                style={{ width: `${widthPct}%`, backgroundColor: bgColor }}
              >
                <span className="font-mono font-bold text-xs text-black">
                  {evt.runningProcess}
                </span>
                <span className="text-[8px] font-mono text-black/80 font-medium">
                  {evt.timeMs} - {evt.endTimeMs}ms
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0ms (AV locks)</span>
          <span>2ms (Game blocks)</span>
          <span>5ms</span>
          <span>11ms</span>
          <span>13ms</span>
          <span>17ms</span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-medium">
            Timeline step {activeStep + 1} of {events.length}
          </span>
          <div className="flex gap-1 font-mono text-[10px]">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-5 h-5 rounded flex items-center justify-center font-medium ${
                  activeStep === i ? 'bg-cyan-500 text-black' : 'bg-dark-850 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-medium text-cyan-300">
              Interval: {events[activeStep]?.timeMs}ms → {events[activeStep]?.endTimeMs}ms
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Running: <strong className="text-white">{events[activeStep]?.runningProcess}</strong> · Holder: <strong className="text-slate-200">{events[activeStep]?.lockHeldBy}</strong>
            </span>
          </div>

          <p className="text-slate-200 text-xs font-sans leading-relaxed">
            {events[activeStep]?.description}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Game state: <strong className={events[activeStep]?.gameStatus === 'BLOCKED_ON_LOCK' ? 'text-rose-400' : 'text-emerald-400'}>{events[activeStep]?.gameStatus}</strong></span>
            <span>AV priority: <strong className="text-cyan-300">{events[activeStep]?.avEffectivePriority === 3 ? 'Level 3 (inherited)' : 'Level 1 (normal)'}</strong></span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs">
        <h4 className="font-medium text-slate-200 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          The priority inversion mechanism explained:
        </h4>
        <div className="space-y-1 text-slate-300 font-sans text-xs leading-relaxed">
          {syncResult.explanation.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-slate-400 font-mono mt-0.5">•</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
