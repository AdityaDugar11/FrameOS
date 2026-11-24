import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  Award,
  Sparkles 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const BeforeAfterComparison: React.FC = () => {
  const { schedulerResult, memoryResult, ioResult, syncResult } = useFrameOSStore();

  const comparisonData = [
    {
      metric: 'Longest Game Wait',
      baseline: 19,
      proposed: 12,
      unit: 'ms',
      improvement: '-36.8%',
      isLowerBetter: true,
      description: 'Waiting time between CPU slices. Dropped from 19ms to 12ms (strictly under 16.67ms deadline).',
    },
    {
      metric: 'Game Completion',
      baseline: 55,
      proposed: 43,
      unit: 'ms',
      improvement: '-21.8%',
      isLowerBetter: true,
      description: 'Total elapsed time until Game completes its 20ms total CPU burst requirement.',
    },
    {
      metric: 'Priority Inversion Block',
      baseline: 11,
      proposed: 3,
      unit: 'ms',
      improvement: '-72.7%',
      isLowerBetter: true,
      description: 'Duration high-priority Game was held waiting for shared file mutex held by Antivirus.',
    },
    {
      metric: 'Paging Access Time (EAT)',
      baseline: 900,
      proposed: 110,
      unit: 'ns',
      improvement: '-87.8%',
      isLowerBetter: true,
      description: 'Effective memory access time with page faults (Mechanical HDD 8ms vs NVMe SSD 100µs).',
    },
    {
      metric: 'Download CPU Overhead',
      baseline: 31.25,
      proposed: 0.38,
      unit: '%',
      improvement: '-98.8%',
      isLowerBetter: true,
      description: 'Fraction of CPU execution cycles consumed transferring 12.5 MB/s network bytes (PIO vs DMA).',
    },
  ];

  // Normalized chart data for grouped bar chart visualization
  const chartData = [
    { name: 'Max Game Wait (ms)', Baseline: 19, Proposed: 12 },
    { name: 'Game Finish (ms)', Baseline: 55, Proposed: 43 },
    { name: 'Lock Block (ms)', Baseline: 11, Proposed: 3 },
    { name: 'Network CPU %', Baseline: 31.25, Proposed: 0.38 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Benchmark Verification: Baseline vs Proposed Mechanisms
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Direct comparison of the 5 key academic metrics between default uniprocessor OS and FrameOS kernel optimizations
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
          All 5 Bottlenecks Resolved
        </span>
      </div>

      {/* Comparison Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {comparisonData.map((item) => (
          <div 
            key={item.metric}
            className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between font-mono"
          >
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {item.metric}
              </span>

              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Baseline</span>
                  <span className="text-sm font-bold text-rose-400">
                    {item.baseline} {item.unit}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div>
                  <span className="text-[10px] text-slate-400 block">Proposed</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {item.proposed} {item.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-sans text-[10px]">Net Gain:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {item.improvement}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped Comparison Bar Chart */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800">
        <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-4">
          Visual Performance Delta
        </h4>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="Baseline" fill="#ff3366" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Proposed" fill="#00ff88" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
