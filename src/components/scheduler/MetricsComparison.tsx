import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { FRAME_DEADLINE_MS } from '../../engine/schedulerEngine';

export const MetricsComparison: React.FC = () => {
  const { 
    schedulerResult, 
    processes, 
  } = useFrameOSStore();

  const metrics = schedulerResult.processMetrics;
  const ref = schedulerResult.referenceComparison;

  return (
    <div className="space-y-4">
      {/* Top Summary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Game completion
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-cyan-400">
              {schedulerResult.gameCompletionTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Expected: {ref.gameCompletionExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Max game wait
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold font-mono ${
              schedulerResult.gameMaxInterSliceWait > FRAME_DEADLINE_MS
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}>
              {schedulerResult.gameMaxInterSliceWait}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Expected: {ref.gameMaxWaitExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg waiting time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-white">
              {schedulerResult.avgWaitingTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Expected: {ref.avgWaitingExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg turnaround
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-white">
              {schedulerResult.avgTurnaroundTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            Expected: {ref.avgTurnaroundExpected} ms
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">
            Avg response time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-white">
              {schedulerResult.avgResponseTime}
            </span>
            <span className="text-xs font-mono text-slate-400">ms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            First CPU slice start
          </span>
        </div>

        <div className="glass-panel rounded-xl p-3 border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase block text-slate-400">
            Missed deadlines
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold font-mono ${
              schedulerResult.gameMissedDeadlines > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {schedulerResult.gameMissedDeadlines}
            </span>
            <span className="text-xs font-mono text-slate-400">frames</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
            {schedulerResult.gameMissedDeadlines > 0 ? 'Exceeds 16.67ms' : 'Zero violations'}
          </span>
        </div>
      </div>

      {/* Discrepancy & Academic Reference Validation Card */}
      <div className="p-3 rounded-lg bg-dark-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          {ref.discrepancies.length === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <span className="font-semibold text-slate-200">
              Case study benchmark validation:
            </span>{' '}
            {ref.discrepancies.length === 0 ? (
              <span className="text-emerald-400">
                100% exact match to academic paper values (zero discrepancy)
              </span>
            ) : (
              <span className="text-amber-400">
                Discrepancy: {ref.discrepancies.join('; ')}
              </span>
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-sans">
          Calculated by simulation engine independently from reference benchmarks
        </div>
      </div>

      {/* Process Metrics Table */}
      <div className="glass-panel rounded-xl p-4 border border-slate-800/80 overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h4 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Per-process scheduling performance ledger
            </h4>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Turnaround = CT - AT · Waiting = TAT - Burst · Response = RT - AT
          </div>
        </div>

        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-wider">
              <th className="py-2 px-2.5">Process</th>
              <th className="py-2 px-2.5">Category</th>
              <th className="py-2 px-2.5 text-right">Burst</th>
              <th className="py-2 px-2.5 text-right">Completion</th>
              <th className="py-2 px-2.5 text-right">Turnaround</th>
              <th className="py-2 px-2.5 text-right">Waiting</th>
              <th className="py-2 px-2.5 text-right">Response</th>
              <th className="py-2 px-2.5 text-right">Max wait</th>
              <th className="py-2 px-2.5 text-center">Status</th>
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
                  className={`hover:bg-dark-850 transition-colors ${
                    isGame ? 'bg-cyan-950/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded font-bold text-[10px] text-black flex items-center justify-center"
                        style={{ backgroundColor: proc.accentHex }}
                      >
                        {proc.id}
                      </span>
                      <span className="font-medium text-white">
                        {proc.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2.5 text-slate-400 text-[11px]">
                    {proc.category}
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-slate-200">
                    {proc.cpuBurst} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-medium text-cyan-300">
                    {m?.completionTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-slate-300">
                    {m?.turnaroundTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-slate-300">
                    {m?.waitingTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-slate-300">
                    {m?.responseTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <span className={`font-medium ${
                      isGame && hasViolation ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {m?.maxInterSliceWait ?? 0} ms
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    {isGame ? (
                      hasViolation ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          Missed frame
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Deadline met
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-dark-850 text-slate-400 border border-slate-800">
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
