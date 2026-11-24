import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Globe, 
  Gamepad2, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { SyncTimelineEvent } from '../../engine/syncEngine';

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
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Priority Inversion Simulator & Timeline
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Shared Resource: <span className="font-mono text-cyan-300">game_asset.pak</span> (Exclusive Mutex Lock)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('priorityInheritance')}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            isInheritance
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
          }`}
        >
          {isInheritance ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Priority Inheritance Protocol Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Enable Priority Inheritance</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Game Mutex Block Duration</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-bold ${
              syncResult.gameBlockDurationMs > 5 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {syncResult.gameBlockDurationMs} ms
            </span>
            <span className="text-slate-400 text-xs">
              (Report: {isInheritance ? '3 ms' : '11 ms'})
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isInheritance ? '73% latency reduction!' : 'Severe stall exceeding frame budget'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Antivirus Priority Level</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${isInheritance ? 'text-cyan-400' : 'text-slate-300'}`}>
              {isInheritance ? 'Level 3 (Inherited)' : 'Level 1 (Low)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isInheritance ? 'Elevated to match Game priority' : 'Subject to preemption by Browser'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Frame Stutter Verdict</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-bold ${isInheritance ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isInheritance ? 'STUTTER ELIMINATED' : 'STUTTER TRIGGERED'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isInheritance ? 'Lock released at t = 5 ms' : 'Lock withheld until t = 13 ms'}
          </span>
        </div>
      </div>

      {/* Visual Gantt Timeline for the 3 Processes */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-slate-300 font-semibold">
            Execution Gantt (0 to 17 ms)
          </span>
          <span className="text-slate-400">
            Click any interval to inspect state
          </span>
        </div>

        <div className="w-full h-14 bg-dark-950 rounded-xl p-1 flex border border-slate-800 overflow-hidden relative">
          {events.map((evt, idx) => {
            const widthPct = ((evt.endTimeMs - evt.timeMs) / 17) * 100;
            const isGame = evt.runningProcess === 'G';
            const isBrowser = evt.runningProcess === 'B';
            const isAv = evt.runningProcess === 'AV';
            const isSelected = activeStep === idx;

            const bgColor = isGame ? '#00f0ff' : isBrowser ? '#f59e0b' : '#ff3366';

            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`h-full relative cursor-pointer flex flex-col items-center justify-center border-r border-dark-950/40 transition-all ${
                  isSelected ? 'ring-2 ring-white z-10 brightness-125' : 'hover:brightness-110'
                }`}
                style={{ width: `${widthPct}%`, backgroundColor: bgColor }}
              >
                <span className="font-mono font-bold text-xs text-black">
                  {evt.runningProcess}
                </span>
                <span className="text-[9px] font-mono text-black/80 font-semibold">
                  {evt.timeMs} - {evt.endTimeMs}ms
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>0ms (AV enters lock)</span>
          <span>2ms (Game blocks)</span>
          <span>5ms</span>
          <span>11ms</span>
          <span>13ms</span>
          <span>17ms</span>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-semibold">
            Timeline Step #{activeStep + 1} of {events.length}
          </span>
          <div className="flex gap-1.5 font-mono text-[10px]">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                  activeStep === i ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-dark-850 border border-slate-700/80">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-bold text-cyan-300">
              Interval: {events[activeStep]?.timeMs}ms → {events[activeStep]?.endTimeMs}ms
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Running: <strong className="text-white">{events[activeStep]?.runningProcess}</strong> · Lock Owner: <strong className="text-amber-300">{events[activeStep]?.lockHeldBy}</strong>
            </span>
          </div>

          <p className="text-slate-200 text-xs font-sans leading-relaxed">
            {events[activeStep]?.description}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Game State: <strong className={events[activeStep]?.gameStatus === 'BLOCKED_ON_LOCK' ? 'text-rose-400' : 'text-emerald-400'}>{events[activeStep]?.gameStatus}</strong></span>
            <span>AV Priority: <strong className="text-cyan-300">{events[activeStep]?.avEffectivePriority === 3 ? 'Level 3 (Inherited High)' : 'Level 1 (Normal Low)'}</strong></span>
          </div>
        </div>
      </div>

      {/* Comprehensive Academic Concept Explanation */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 font-mono text-xs">
        <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          The Priority Inversion Problem & The Inheritance Protocol Solution:
        </h4>
        <div className="space-y-1 text-slate-300 font-sans text-xs leading-relaxed">
          {syncResult.explanation.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
