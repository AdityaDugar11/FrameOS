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
  Award,
} from 'lucide-react';

export const BeforeAfterComparison: React.FC = () => {
  const comparisonData = [
    {
      metric: 'Longest game wait',
      baseline: 19,
      proposed: 12,
      unit: 'ms',
      improvement: '-36.8%',
      isLowerBetter: true,
      description: 'Waiting time between CPU slices. Dropped from 19ms to 12ms (within 16.67ms deadline).',
    },
    {
      metric: 'Game completion',
      baseline: 55,
      proposed: 43,
      unit: 'ms',
      improvement: '-21.8%',
      isLowerBetter: true,
      description: 'Total elapsed time until game completes its 20ms total CPU burst requirement.',
    },
    {
      metric: 'Inversion block',
      baseline: 11,
      proposed: 3,
      unit: 'ms',
      improvement: '-72.7%',
      isLowerBetter: true,
      description: 'Duration high-priority game was held waiting for shared file mutex held by antivirus.',
    },
    {
      metric: 'Paging access (EAT)',
      baseline: 900,
      proposed: 110,
      unit: 'ns',
      improvement: '-87.8%',
      isLowerBetter: true,
      description: 'Effective memory access time with page faults (Mechanical HDD 8ms vs NVMe SSD 100µs).',
    },
    {
      metric: 'Download CPU cost',
      baseline: 31.25,
      proposed: 0.38,
      unit: '%',
      improvement: '-98.8%',
      isLowerBetter: true,
      description: 'Fraction of CPU execution cycles consumed transferring 12.5 MB/s network bytes (PIO vs DMA).',
    },
  ];

  const chartData = [
    { name: 'Max game wait (ms)', Baseline: 19, Proposed: 12 },
    { name: 'Game finish (ms)', Baseline: 55, Proposed: 43 },
    { name: 'Lock block (ms)', Baseline: 11, Proposed: 3 },
    { name: 'Network CPU %', Baseline: 31.25, Proposed: 0.38 },
  ];

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Benchmark verification: Baseline vs proposed mechanisms
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Direct comparison of the 5 key academic metrics between default uniprocessor OS and FrameOS kernel optimizations
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold shadow-xs">
          All 5 bottlenecks resolved
        </span>
      </div>

      {/* Comparison Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {comparisonData.map((item) => (
          <div 
            key={item.metric}
            className="p-3 rounded-md bg-paper-100 border border-paper-300 flex flex-col justify-between font-mono shadow-xs"
          >
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">
                {item.metric}
              </span>

              <div className="flex items-baseline justify-between mt-1.5">
                <div>
                  <span className="text-[10px] text-ink-muted block">Baseline</span>
                  <span className="text-xs font-semibold text-red-700">
                    {item.baseline} {item.unit}
                  </span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-ink-muted" />

                <div>
                  <span className="text-[10px] text-ink-muted block">Proposed</span>
                  <span className="text-sm font-semibold text-emerald-700">
                    {item.proposed} {item.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-1.5 border-t border-paper-300 flex items-center justify-between text-[10px]">
              <span className="text-ink-secondary font-sans">Net gain:</span>
              <span className="text-emerald-700 font-semibold font-mono">
                {item.improvement}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped Comparison Bar Chart */}
      <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
        <h4 className="text-xs font-mono font-semibold text-ink-primary uppercase tracking-wider mb-3">
          Visual performance delta
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d7" />
              <XAxis dataKey="name" stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <YAxis stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#ded6c8', borderRadius: '6px', fontSize: '11px', color: '#1f1b16' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="Baseline" fill="#b91c1c" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Proposed" fill="#15803d" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
