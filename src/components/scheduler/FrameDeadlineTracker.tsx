import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  HelpCircle,
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
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            60 FPS Frame Budget Analysis (16.67 ms Deadline)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Δt (deadline) = 1000 ms / 60 frames = 16.6667 ms
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frame Budget Progress Gauge */}
        <div className="p-4 rounded-xl bg-dark-950 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">Maximum Inter-Slice Stall:</span>
              <span className={`font-bold text-sm ${isViolation ? 'text-rose-400' : 'text-emerald-400'}`}>
                {gameWait} ms
              </span>
            </div>

            {/* Visual Budget Bar */}
            <div className="w-full bg-dark-850 h-5 rounded-lg p-0.5 border border-slate-700/80 relative overflow-hidden">
              {/* 16.67ms Deadline Line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10"
                style={{ left: `${(FRAME_DEADLINE_MS / 25) * 100}%` }}
              >
                <span className="absolute -top-4 -translate-x-1/2 text-[9px] font-mono text-yellow-400 font-bold">
                  16.7ms
                </span>
              </div>

              {/* Measured Bar */}
              <div 
                className={`h-full rounded transition-all duration-500 ${
                  isViolation ? 'bg-rose-500 shadow-glow-red' : 'bg-emerald-400 shadow-glow-green'
                }`}
                style={{ width: `${Math.min(100, (gameWait / 25) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>0 ms</span>
              <span className="text-yellow-400/90 font-bold">Deadline: 16.67 ms</span>
              <span>25 ms</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs">
            {isViolation ? (
              <div className="flex items-start gap-2 text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Deadline Violated: 19 ms Wait</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Because round robin treats all processes equally (q = 4ms), 5 background tasks (B, AV, D, M, C) run consecutively. The GPU Starves for 19 ms waiting for game physics calculation, causing a noticeable frame stutter.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Deadline Met: 12 ms Wait</p>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    By granting the Game an 8ms quantum and truncating background processes to 2ms slices, the ready queue recycles in only 12 ms. The frame is dispatched on time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mathematical Breakdown of Inter-slice Cycle */}
        <div className="p-4 rounded-xl bg-dark-950 border border-slate-800/80 flex flex-col justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] uppercase text-slate-400 tracking-wider font-semibold block mb-2">
              Queue Cycle Step-by-Step
            </span>

            {isFwrr ? (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyan-300 font-bold">1. Game Slice:</span>
                  <span className="text-slate-200">0ms → 8ms (runs 8ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-amber-300">2. Browser Slice:</span>
                  <span className="text-slate-400">8ms → 12ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-rose-300">3. Antivirus Slice:</span>
                  <span className="text-slate-400">12ms → 14ms (runs 2ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-emerald-300">4. Download Mgr Slice:</span>
                  <span className="text-slate-400">14ms → 16ms (runs 2ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-purple-300">5. Music & Chat Slices:</span>
                  <span className="text-slate-400">16ms → 20ms (runs 4ms total)</span>
                </div>
                <div className="flex justify-between py-1 pt-1.5 font-bold text-emerald-400">
                  <span>Game Inter-slice Gap:</span>
                  <span>20ms - 8ms = 12 ms</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-cyan-300 font-bold">1. Game Slice:</span>
                  <span className="text-slate-200">0ms → 4ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-amber-300">2. Browser Slice:</span>
                  <span className="text-slate-400">4ms → 8ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-rose-300">3. Antivirus Slice:</span>
                  <span className="text-slate-400">8ms → 12ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-emerald-300">4. Download Mgr Slice:</span>
                  <span className="text-slate-400">12ms → 16ms (runs 4ms)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-purple-300">5. Music & Chat Slices:</span>
                  <span className="text-slate-400">16ms → 23ms (runs 7ms total)</span>
                </div>
                <div className="flex justify-between py-1 pt-1.5 font-bold text-rose-400">
                  <span>Game Inter-slice Gap:</span>
                  <span>23ms - 4ms = 19 ms (STALL!)</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 p-2 rounded bg-dark-850 text-[10px] text-slate-400">
            Note: Average turnaround increases under FWRR (37.83ms → 45.50ms) as a deliberate trade-off to protect real-time deadline guarantees.
          </div>
        </div>
      </div>
    </div>
  );
};
