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
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Priority inversion simulator & timeline
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Shared resource: <span className="font-mono text-copper-700 font-semibold">game_asset.pak</span> (exclusive mutex lock)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('priorityInheritance')}
          className={`px-3.5 py-1.5 rounded font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs ${
            isInheritance
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-copper-600 hover:bg-copper-700 text-white'
          }`}
        >
          {isInheritance ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Priority inheritance active</span>
            </>
          ) : (
            <span>Enable priority inheritance</span>
          )}
        </button>
      </div>

      {/* Metric Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase block font-semibold">Game lock block duration</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${
              syncResult.gameBlockDurationMs > 5 ? 'text-red-700' : 'text-emerald-700'
            }`}>
              {syncResult.gameBlockDurationMs} ms
            </span>
            <span className="text-ink-secondary text-xs">
              (Paper: {isInheritance ? '3 ms' : '11 ms'})
            </span>
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isInheritance ? '73% latency reduction' : 'Exceeds safety margin'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase block font-semibold">Antivirus priority level</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${isInheritance ? 'text-copper-700' : 'text-ink-primary'}`}>
              {isInheritance ? 'Level 3 (inherited)' : 'Level 1 (low)'}
            </span>
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isInheritance ? 'Promoted to game priority' : 'Subject to browser preemption'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase block font-semibold">Frame stutter status</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-semibold ${isInheritance ? 'text-emerald-700' : 'text-red-700'}`}>
              {isInheritance ? 'Eliminated' : 'Stutter active'}
            </span>
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isInheritance ? 'Lock released at t = 5 ms' : 'Lock held until t = 13 ms'}
          </span>
        </div>
      </div>

      {/* Visual Gantt Timeline for the 3 Processes */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-ink-primary font-medium">
            Execution Gantt (0 to 17 ms)
          </span>
          <span className="text-ink-muted text-[11px]">
            Click any interval to inspect state
          </span>
        </div>

        <div className="w-full h-11 bg-paper-200 rounded p-0.5 flex border border-paper-300 overflow-hidden relative">
          {events.map((evt, idx) => {
            const widthPct = ((evt.endTimeMs - evt.timeMs) / 17) * 100;
            const isGame = evt.runningProcess === 'G';
            const isBrowser = evt.runningProcess === 'B';
            const isSelected = activeStep === idx;

            const bgColor = isGame ? '#0284c7' : isBrowser ? '#d97706' : '#b91c1c';

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-full relative cursor-pointer flex flex-col items-center justify-center border-r border-paper-50/40 transition-opacity ${
                  isSelected ? 'ring-2 ring-ink-primary z-10 brightness-105' : 'opacity-85 hover:opacity-100'
                }`}
                style={{ width: `${widthPct}%`, backgroundColor: bgColor }}
              >
                <span className="font-mono font-bold text-xs text-white shadow-xs">
                  {evt.runningProcess}
                </span>
                <span className="text-[8px] font-mono text-white/90 font-medium">
                  {evt.timeMs} - {evt.endTimeMs}ms
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1">
          <span>0ms (AV locks)</span>
          <span>2ms (Game blocks)</span>
          <span>5ms</span>
          <span>11ms</span>
          <span>13ms</span>
          <span>17ms</span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 text-xs shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-ink-secondary tracking-wider font-semibold">
            Timeline step {activeStep + 1} of {events.length}
          </span>
          <div className="flex gap-1 font-mono text-[10px]">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-5 h-5 rounded flex items-center justify-center font-medium shadow-xs ${
                  activeStep === i 
                    ? 'bg-ink-primary text-paper-50 font-semibold' 
                    : 'bg-paper-200 text-ink-secondary hover:text-ink-primary border border-paper-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded bg-paper-50 border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-semibold text-copper-700">
              Interval: {events[activeStep]?.timeMs}ms → {events[activeStep]?.endTimeMs}ms
            </span>
            <span className="font-mono text-[11px] text-ink-secondary">
              Running: <strong className="text-ink-primary">{events[activeStep]?.runningProcess}</strong> · Holder: <strong className="text-ink-primary">{events[activeStep]?.lockHeldBy}</strong>
            </span>
          </div>

          <p className="text-ink-secondary text-xs font-sans leading-relaxed">
            {events[activeStep]?.description}
          </p>

          <div className="mt-2 pt-2 border-t border-paper-300 flex items-center justify-between text-[10px] font-mono text-ink-muted">
            <span>Game state: <strong className={events[activeStep]?.gameStatus === 'BLOCKED_ON_LOCK' ? 'text-red-700' : 'text-emerald-700'}>{events[activeStep]?.gameStatus}</strong></span>
            <span>AV priority: <strong className="text-copper-700">{events[activeStep]?.avEffectivePriority === 3 ? 'Level 3 (inherited)' : 'Level 1 (normal)'}</strong></span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 font-mono text-xs shadow-xs">
        <h4 className="font-semibold text-ink-primary mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-ink-muted" />
          The priority inversion mechanism explained:
        </h4>
        <div className="space-y-1 text-ink-secondary font-sans text-xs leading-relaxed">
          {syncResult.explanation.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-ink-muted font-mono mt-0.5">•</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
