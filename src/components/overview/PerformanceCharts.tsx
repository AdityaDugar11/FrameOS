import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Activity, Check, AlertTriangle } from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

type ChartMetric = 'fps' | 'cpu' | 'ram' | 'disk';

export const PerformanceCharts: React.FC = () => {
  const { optimizations } = useFrameOSStore();
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('fps');

  const isAllOptimized = Object.values(optimizations).every(Boolean);
  const isFwrr = optimizations.fwrr;
  const isTrimming = optimizations.workingSetTrimming;
  const isDma = optimizations.dma;
  const isIoPrio = optimizations.ioPrioritization;

  // Generate 24 deterministic time points
  const chartData = Array.from({ length: 24 }).map((_, i) => {
    const t = i * 2.5;

    let fpsVal = 60;
    if (!isAllOptimized) {
      const isStallPoint = i % 4 === 1 || i % 6 === 2;
      fpsVal = isStallPoint ? (isFwrr ? 48 : 24) : (isFwrr ? 58 : 42);
    }

    let cpuVal = isDma ? 18.4 : 41.2;
    if (!isAllOptimized) {
      cpuVal += (i % 3 === 0 ? 5.2 : -2.8);
    } else {
      cpuVal += (i % 2 === 0 ? 0.8 : -0.7);
    }

    const ramVal = isTrimming ? 13.7 : 17.0;
    let diskQueue = isIoPrio ? 3 : Math.min(65, Math.round(i * 2.8 + 4));

    return {
      time: `${t}s`,
      fps: fpsVal,
      cpu: Number(cpuVal.toFixed(1)),
      ram: ramVal,
      diskQueue,
    };
  });

  return (
    <div className="bg-paper-50 rounded-lg p-4 border border-paper-300 shadow-xs">
      {/* Chart Controls & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Telemetry over time
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Deterministic simulation profile across consecutive game loops
          </p>
        </div>

        <div className="flex items-center gap-1 bg-paper-200 p-1 rounded border border-paper-300">
          <button
            onClick={() => setActiveMetric('fps')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              activeMetric === 'fps'
                ? 'bg-paper-50 text-ink-primary font-semibold border border-paper-300 shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            FPS
          </button>
          <button
            onClick={() => setActiveMetric('cpu')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              activeMetric === 'cpu'
                ? 'bg-paper-50 text-ink-primary font-semibold border border-paper-300 shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            CPU %
          </button>
          <button
            onClick={() => setActiveMetric('ram')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              activeMetric === 'ram'
                ? 'bg-paper-50 text-ink-primary font-semibold border border-paper-300 shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            RAM (GB)
          </button>
          <button
            onClick={() => setActiveMetric('disk')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              activeMetric === 'disk'
                ? 'bg-paper-50 text-ink-primary font-semibold border border-paper-300 shadow-xs'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Disk queue
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'fps' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d7" />
              <XAxis dataKey="time" stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <YAxis domain={[0, 75]} stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#ded6c8', borderRadius: '6px', fontSize: '11px', color: '#1f1b16' }}
                itemStyle={{ color: '#15803d', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="fps" 
                stroke="#15803d" 
                strokeWidth={2}
                fill="#15803d" 
                fillOpacity={0.12} 
                name="Rendered FPS"
              />
            </AreaChart>
          ) : activeMetric === 'cpu' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d7" />
              <XAxis dataKey="time" stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <YAxis domain={[0, 100]} stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#ded6c8', borderRadius: '6px', fontSize: '11px', color: '#1f1b16' }}
                itemStyle={{ color: '#b45309', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#c2410c" 
                strokeWidth={2}
                fill="#c2410c" 
                fillOpacity={0.12} 
                name="CPU utilization %"
              />
            </AreaChart>
          ) : activeMetric === 'ram' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d7" />
              <XAxis dataKey="time" stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <YAxis domain={[10, 20]} stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#ded6c8', borderRadius: '6px', fontSize: '11px', color: '#1f1b16' }}
                itemStyle={{ color: '#7c3aed', fontFamily: 'monospace' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="ram" 
                stroke="#7c3aed" 
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 2.5 }}
                name="Memory demand (GB)"
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d7" />
              <XAxis dataKey="time" stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <YAxis domain={[0, 80]} stroke="#7b7266" tick={{ fontSize: 10, fill: '#5e554a' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fdfbf7', borderColor: '#ded6c8', borderRadius: '6px', fontSize: '11px', color: '#1f1b16' }}
                itemStyle={{ color: '#dc2626', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="diskQueue" 
                stroke="#dc2626" 
                strokeWidth={2}
                fill="#dc2626" 
                fillOpacity={0.12} 
                name="Queued disk requests"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Metric Insight Footer */}
      <div className="mt-2 pt-2 border-t border-paper-300 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-muted">Status:</span>
          {isAllOptimized ? (
            <span className="text-emerald-700 font-mono font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 60 FPS target frame rate maintained
            </span>
          ) : (
            <span className="text-red-700 font-mono font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Frame drops detected (average {activeMetric === 'fps' ? '28 FPS' : 'stutter'})
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-ink-muted">
          Target frame budget: 16.67 ms
        </span>
      </div>
    </div>
  );
};
