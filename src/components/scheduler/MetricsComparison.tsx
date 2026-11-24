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
        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-ink-muted block">
            Game completion
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-copper-700">
              {schedulerResult.gameCompletionTime}
            </span>
            <span className="text-xs font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            Expected: {ref.gameCompletionExpected} ms
          </span>
        </div>

        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-ink-muted block">
            Max game wait
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold font-mono ${
              schedulerResult.gameMaxInterSliceWait > FRAME_DEADLINE_MS
                ? 'text-red-700'
                : 'text-emerald-700'
            }`}>
              {schedulerResult.gameMaxInterSliceWait}
            </span>
            <span className="text-xs font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            Expected: {ref.gameMaxWaitExpected} ms
          </span>
        </div>

        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-ink-muted block">
            Avg waiting time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-ink-primary">
              {schedulerResult.avgWaitingTime}
            </span>
            <span className="text-xs font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            Expected: {ref.avgWaitingExpected} ms
          </span>
        </div>

        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-ink-muted block">
            Avg turnaround
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-ink-primary">
              {schedulerResult.avgTurnaroundTime}
            </span>
            <span className="text-xs font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            Expected: {ref.avgTurnaroundExpected} ms
          </span>
        </div>

        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-ink-muted block">
            Avg response time
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold font-mono text-ink-primary">
              {schedulerResult.avgResponseTime}
            </span>
            <span className="text-xs font-mono text-ink-muted">ms</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            First CPU slice start
          </span>
        </div>

        <div className="bg-paper-50 rounded-lg p-3 border border-paper-300 shadow-xs">
          <span className="text-[10px] font-mono uppercase block text-ink-muted">
            Missed deadlines
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold font-mono ${
              schedulerResult.gameMissedDeadlines > 0 ? 'text-red-700' : 'text-emerald-700'
            }`}>
              {schedulerResult.gameMissedDeadlines}
            </span>
            <span className="text-xs font-mono text-ink-muted">frames</span>
          </div>
          <span className="text-[10px] font-mono text-ink-secondary block mt-0.5">
            {schedulerResult.gameMissedDeadlines > 0 ? 'Exceeds 16.67ms' : 'Zero violations'}
          </span>
        </div>
      </div>

      {/* Discrepancy & Academic Reference Validation Card */}
      <div className="p-3 rounded-lg bg-paper-100 border border-paper-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          {ref.discrepancies.length === 0 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <div>
            <span className="font-semibold text-ink-primary">
              Case study benchmark validation:
            </span>{' '}
            {ref.discrepancies.length === 0 ? (
              <span className="text-emerald-800 font-semibold">
                100% exact match to academic paper values (zero discrepancy)
              </span>
            ) : (
              <span className="text-amber-800 font-semibold">
                Discrepancy: {ref.discrepancies.join('; ')}
              </span>
            )}
          </div>
        </div>

        <div className="text-[10px] text-ink-secondary font-sans">
          Calculated by simulation engine independently from reference benchmarks
        </div>
      </div>

      {/* Process Metrics Table */}
      <div className="bg-paper-50 rounded-lg p-4 border border-paper-300 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-muted" />
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Per-process scheduling performance ledger
            </h4>
          </div>
          <div className="text-[10px] font-mono text-ink-muted">
            Turnaround = CT - AT · Waiting = TAT - Burst · Response = RT - AT
          </div>
        </div>

        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-paper-300 text-[10px] text-ink-secondary uppercase tracking-wider">
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
          <tbody className="divide-y divide-paper-200">
            {processes.map((proc) => {
              const m = metrics[proc.id];
              const isGame = proc.id === 'G';
              const hasViolation = m?.hasDeadlineMiss;

              return (
                <tr 
                  key={proc.id} 
                  className={`hover:bg-paper-100 transition-colors ${
                    isGame ? 'bg-paper-100/60' : ''
                  }`}
                >
                  <td className="py-2.5 px-2.5">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded font-bold text-[10px] text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: proc.accentHex }}
                      >
                        {proc.id}
                      </span>
                      <span className="font-semibold text-ink-primary">
                        {proc.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2.5 text-ink-muted text-[11px]">
                    {proc.category}
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-ink-primary">
                    {proc.cpuBurst} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-semibold text-copper-700">
                    {m?.completionTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-ink-secondary">
                    {m?.turnaroundTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-ink-secondary">
                    {m?.waitingTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-ink-secondary">
                    {m?.responseTime} ms
                  </td>
                  <td className="py-2.5 px-2.5 text-right">
                    <span className={`font-semibold ${
                      isGame && hasViolation ? 'text-red-700' : 'text-ink-secondary'
                    }`}>
                      {m?.maxInterSliceWait ?? 0} ms
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-center">
                    {isGame ? (
                      hasViolation ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 font-semibold">
                          Missed frame
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                          Deadline met
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-muted border border-paper-300">
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
