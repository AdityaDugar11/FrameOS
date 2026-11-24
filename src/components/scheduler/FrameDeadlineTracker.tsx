import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Activity
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { FRAME_DEADLINE_MS } from '../../engine/schedulerEngine';

export const FrameDeadlineTracker: React.FC = () => {
  const { schedulerResult, schedulerAlgorithm } = useFrameOSStore();

  const isFwrr = schedulerAlgorithm === 'PROPOSED_FWRR';
  const gameWait = schedulerResult.gameMaxInterSliceWait;
  const isViolation = gameWait > FRAME_DEADLINE_MS;

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ink-muted" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
            60 FPS frame budget analysis (16.67 ms deadline)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">
          Δt (deadline) = 1000 ms / 60 frames = 16.6667 ms
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Frame Budget Progress Gauge */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-ink-secondary">Maximum inter-slice stall:</span>
              <span className={`font-semibold ${isViolation ? 'text-red-700' : 'text-emerald-700'}`}>
                {gameWait} ms
              </span>
            </div>

            {/* Visual Budget Bar */}
            <div className="w-full bg-paper-200 h-4 rounded p-0.5 border border-paper-300 relative overflow-hidden">
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-amber-600 z-10"
                style={{ left: `${(FRAME_DEADLINE_MS / 25) * 100}%` }}
              >
                <span className="absolute -top-4 -translate-x-1/2 text-[9px] font-mono text-amber-800 font-semibold">
                  16.7ms
                </span>
              </div>

              <div 
                className={`h-full rounded-xs transition-all ${
                  isViolation ? 'bg-red-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, (gameWait / 25) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-ink-muted mt-1">
              <span>0 ms</span>
              <span className="text-amber-800 font-semibold">Deadline: 16.67 ms</span>
              <span>25 ms</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-paper-300 text-xs">
            {isViolation ? (
              <div className="flex items-start gap-2 text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Deadline violated (19 ms wait)</p>
                  <p className="text-[11px] text-ink-secondary font-sans mt-0.5 leading-relaxed">
                    Because standard round robin serves all processes equally (q = 4ms), 5 background tasks (B, AV, D, M, C) run consecutively before returning to the game. The graphics pipeline stalls waiting for simulation physics, causing a visible hitch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Deadline met (12 ms wait)</p>
                  <p className="text-[11px] text-ink-secondary font-sans mt-0.5 leading-relaxed">
                    By granting the game an 8ms quantum and truncating background tasks to 2ms slices, the ready queue cycles in 12 ms, cleanly within the 16.67 ms frame budget.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mathematical Breakdown */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs flex flex-col justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-ink-secondary tracking-wider font-semibold block mb-2">
              Queue cycle sequence
            </span>

            {isFwrr ? (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-copper-700 font-semibold">1. Game slice:</span>
                  <span className="text-ink-primary font-medium">0ms → 8ms (runs 8ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-amber-800">2. Browser slice:</span>
                  <span className="text-ink-secondary">8ms → 12ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-red-700">3. Antivirus slice:</span>
                  <span className="text-ink-secondary">12ms → 14ms (runs 2ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-emerald-700">4. Download manager:</span>
                  <span className="text-ink-secondary">14ms → 16ms (runs 2ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-purple-700">5. Music & chat:</span>
                  <span className="text-ink-secondary">16ms → 20ms (runs 4ms total)</span>
                </div>
                <div className="flex justify-between py-1 pt-1.5 text-emerald-700 font-semibold">
                  <span>Game inter-slice gap:</span>
                  <span>20ms - 8ms = 12 ms (met)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-copper-700 font-semibold">1. Game slice:</span>
                  <span className="text-ink-primary font-medium">0ms → 4ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-amber-800">2. Browser slice:</span>
                  <span className="text-ink-secondary">4ms → 8ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-red-700">3. Antivirus slice:</span>
                  <span className="text-ink-secondary">8ms → 12ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-emerald-700">4. Download manager:</span>
                  <span className="text-ink-secondary">12ms → 16ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-paper-300">
                  <span className="text-purple-700">5. Music & chat:</span>
                  <span className="text-ink-secondary">16ms → 23ms (runs 7ms total)</span>
                </div>
                <div className="flex justify-between py-1 pt-1.5 text-red-700 font-semibold">
                  <span>Game inter-slice gap:</span>
                  <span>23ms - 4ms = 19 ms (missed)</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2.5 p-2 rounded bg-paper-50 border border-paper-300 text-[10px] text-ink-secondary shadow-xs">
            Note: Average turnaround increases under FWRR (37.83ms → 45.50ms) as a deliberate trade-off to satisfy interactive deadline constraints.
          </div>
        </div>
      </div>
    </div>
  );
};
