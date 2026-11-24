import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { GanttSlice } from '../../types/simulation';
import { FRAME_DEADLINE_MS } from '../../engine/schedulerEngine';

export const GanttChart: React.FC = () => {
  const { 
    schedulerResult, 
    simCurrentTime, 
    setSimTime, 
    processes,
  } = useFrameOSStore();

  const [hoveredSlice, setHoveredSlice] = useState<GanttSlice | null>(null);

  const slices = schedulerResult.slices;
  const totalDuration = schedulerResult.totalTime || 55;

  const processMap = new Map(processes.map(p => [p.id, p]));

  // Find Game slices to calculate inter-slice wait intervals
  const gameSlices = slices.filter(s => s.processId === 'G');
  const gameWaitGaps: { start: number; end: number; duration: number; isViolation: boolean }[] = [];

  for (let i = 0; i < gameSlices.length - 1; i++) {
    const endPrev = gameSlices[i].endTime;
    const startNext = gameSlices[i + 1].startTime;
    const gap = startNext - endPrev;
    gameWaitGaps.push({
      start: endPrev,
      end: startNext,
      duration: gap,
      isViolation: gap > FRAME_DEADLINE_MS,
    });
  }

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Execution Gantt chart
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Synthesized dynamically by the scheduling engine from process bursts and quantum slices
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-ink-primary">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500" />
            <span>Game (G)</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span>Browser (B)</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600" />
            <span>Antivirus (AV)</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-secondary">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
            <span>Download (D)</span>
          </div>
        </div>
      </div>

      {/* Gantt Timeline Bar */}
      <div className="relative pt-6 pb-4">
        {/* Scrubber / Current Simulation Time Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-ink-primary z-20 pointer-events-none transition-all duration-150"
          style={{ left: `${(simCurrentTime / totalDuration) * 100}%` }}
        >
          <div className="absolute -top-5 -translate-x-1/2 bg-paper-50 text-ink-primary border border-paper-300 shadow-xs font-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">
            {simCurrentTime}ms
          </div>
        </div>

        {/* Slices Track */}
        <div className="w-full h-12 bg-paper-200 rounded-lg p-1 flex border border-paper-300 overflow-hidden relative">
          {slices.map((slice) => {
            const proc = processMap.get(slice.processId);
            const widthPercent = (slice.duration / totalDuration) * 100;
            const isExecuted = slice.endTime <= simCurrentTime;
            const isCurrent = simCurrentTime >= slice.startTime && simCurrentTime < slice.endTime;

            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
                onClick={() => setSimTime(slice.startTime)}
                className={`h-full relative cursor-pointer transition-opacity flex flex-col justify-center items-center select-none border-r border-paper-50/40 ${
                  isCurrent
                    ? 'ring-2 ring-ink-primary z-10 brightness-105'
                    : isExecuted
                    ? 'opacity-90'
                    : 'opacity-40 hover:opacity-100'
                }`}
                style={{ 
                  width: `${widthPercent}%`,
                  backgroundColor: proc?.accentHex || '#3b82f6',
                }}
              >
                <span className="font-mono font-bold text-xs text-white leading-none shadow-xs">
                  {slice.processId}
                </span>
                <span className="text-[9px] font-mono text-white/90 font-medium leading-none mt-0.5">
                  {slice.duration}ms
                </span>
              </div>
            );
          })}
        </div>

        {/* Time Scale Axis */}
        <div className="relative w-full h-5 mt-2 flex justify-between text-[10px] font-mono text-ink-muted select-none">
          <span>0ms</span>
          <span>10ms</span>
          <span>20ms</span>
          <span>30ms</span>
          <span>40ms</span>
          <span>50ms</span>
          <span>{totalDuration}ms</span>
        </div>

        {/* Frame Deadline Gap Indicators */}
        <div className="mt-4 pt-3 border-t border-paper-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-secondary font-semibold flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-ink-muted" />
              Game inter-slice waiting windows (deadline: 16.67 ms)
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              Wait duration between game execution slices
            </span>
          </div>

          <div className="space-y-2">
            {gameWaitGaps.map((gap, idx) => (
              <div 
                key={idx}
                className={`p-2.5 rounded-md border flex items-center justify-between text-xs font-mono shadow-xs ${
                  gap.isViolation
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {gap.isViolation ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold">
                      Interval {idx + 1}: t = {gap.start}ms → {gap.end}ms ({gap.duration} ms wait)
                    </span>
                    <span className="text-[10px] text-ink-secondary block font-sans">
                      {gap.isViolation 
                        ? 'Exceeds 16.67ms frame budget. Render frame missed, causing game freeze or stutter.' 
                        : 'Complies with 16.67ms deadline. Game loop maintains consistent 60 FPS output.'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                  gap.isViolation 
                    ? 'bg-red-100 text-red-800 border-red-300' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {gap.isViolation ? 'Frame dropped' : '60 FPS kept'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hovered Slice Tooltip Card */}
      {hoveredSlice && (
        <div className="mt-2 p-2.5 rounded-md bg-paper-100 border border-paper-300 flex items-center justify-between text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded font-bold text-white flex items-center justify-center text-[10px] shadow-xs"
              style={{ backgroundColor: processMap.get(hoveredSlice.processId)?.accentHex }}
            >
              {hoveredSlice.processId}
            </span>
            <div>
              <span className="font-semibold text-ink-primary">
                {processMap.get(hoveredSlice.processId)?.name}
              </span>
              <span className="text-ink-secondary text-[10px] block">
                {hoveredSlice.startTime}ms → {hoveredSlice.endTime}ms ({hoveredSlice.duration}ms duration)
              </span>
            </div>
          </div>

          <div className="text-right text-[11px]">
            <span className="text-ink-primary font-semibold block">
              Remaining burst: {hoveredSlice.remainingBurst} ms
            </span>
            <span className="text-ink-muted text-[10px]">
              {hoveredSlice.preempted ? 'Preempted by quantum' : 'Completed execution'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
