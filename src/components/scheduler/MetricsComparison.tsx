import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { FRAME_DEADLINE_MS } from '../../engine/schedulerEngine';

export const MetricsComparison: React.FC = () => {
  const { 
    schedulerResult, 
    processes, 
    schedulerAlgorithm 
  } = useFrameOSStore();

  const isFwrr = schedulerAlgorithm === 'PROPOSED_FWRR';
  const metrics = schedulerResult.processMetrics;
  const ref = schedulerResult.referenceComparison;

  return (
    <div className="space-y-4">
      {/* Top Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Game Completion
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-cyan-400">
              {schedulerResult.gameCompletionTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            Expected: {ref.gameCompletionExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Max Game Wait
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-bold font-mono ${
              schedulerResult.gameMaxInterSliceWait > FRAME_DEADLINE_MS
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}>
              {schedulerResult.gameMaxInterSliceWait}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            Expected: {ref.gameMaxWaitExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg Waiting Time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {schedulerResult.avgWaitingTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            Expected: {ref.avgWaitingExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg Turnaround Time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {schedulerResult.avgTurnaroundTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            Expected: {ref.avgTurnaroundExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg Response Time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {schedulerResult.avgResponseTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-1">
            First CPU slice start
          </span>
        </div>

        <div className={`glass-panel rounded-xl p-3 border ${
          schedulerResult.gameMissedDeadlines > 0
            ? 'border-rose-800/60 bg-rose-950/20 text-rose-300'
            : 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300'
        }`}>
          <span className="text-[10px] font-mono uppercase block text-slate-400">
            Missed Deadlines
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono">
              {schedulerResult.gameMissedDeadlines}
            </span>
            <span className="text-xs font-mono">frames</span>
          </div>
          <span className="text-[10px] font-mono block mt-1">
            {schedulerResult.gameMissedDeadlines > 0 ? 'Exceeds 16.67ms' : 'Zero Violations'}
          </span>
        </div>
      </div>

      {/* Discrepancy & Academic Reference Validation Card */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          {ref.discrepancies.length === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <span className="font-bold text-slate-200">
              Academic Report Validation:
            </span>{' '}
            {ref.discrepancies.length === 0 ? (
              <span className="text-emerald-400 font-semibold">
                100% Exact Match to Academic Case Study Figures (Zero Discrepancy)
              </span>
            ) : (
              <span className="text-amber-400 font-semibold">
                Discrepancy Detected ({ref.discrepancies.join('; ')})
              </span>
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-sans">
          Calculated by simulation engine independently from reference benchmarks.
        </div>
      </div>

      {/* Process Metrics Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Per-Process Scheduling Performance Ledger
            </h4>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Formulas: Turnaround = CT - AT · Waiting = TAT - Burst · Response = RT - AT
          </div>
        </div>

        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Process</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">CPU Burst</th>
              <th className="py-2.5 px-3 text-right">Completion (CT)</th>
              <th className="py-2.5 px-3 text-right">Turnaround (TAT)</th>
              <th className="py-2.5 px-3 text-right">Waiting (WT)</th>
              <th className="py-2.5 px-3 text-right">Response (RT)</th>
              <th className="py-2.5 px-3 text-right">Max Inter-Slice Wait</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {processes.map((proc) => {
              const m = metrics[proc.id];
              const isGame = proc.id === 'G';
              const hasViolation = m?.hasDeadlineMiss;

              return (
                <tr 
                  key={proc.id} 
                  className={`hover:bg-slate-800/30 transition-colors ${
                    isGame ? 'bg-cyan-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-5 h-5 rounded font-bold text-[11px] text-black flex items-center justify-center"
                        style={{ backgroundColor: proc.accentHex }}
                      >
                        {proc.id}
                      </span>
                      <span className="font-semibold text-white">
                        {proc.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {proc.category}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-200">
                    {proc.cpuBurst} ms
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-300">
                    {m?.completionTime} ms
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {m?.turnaroundTime} ms
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {m?.waitingTime} ms
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {m?.responseTime} ms
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-bold ${
                      isGame && hasViolation ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {m?.maxInterSliceWait ?? 0} ms
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {isGame ? (
                      hasViolation ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          Dropped Frame
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Deadline Met
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
