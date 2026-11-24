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
    <div className="glass-panel rounded-xl p-4 border border-slate-800/80">
      {/* Chart Controls & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Telemetry over time
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Deterministic simulation profile across consecutive game loops
          </p>
        </div>

        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveMetric('fps')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'fps'
                ? 'bg-dark-800 text-cyan-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FPS
          </button>
          <button
            onClick={() => setActiveMetric('cpu')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'cpu'
                ? 'bg-dark-800 text-amber-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CPU %
          </button>
          <button
            onClick={() => setActiveMetric('ram')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'ram'
                ? 'bg-dark-800 text-purple-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RAM (GB)
          </button>
          <button
            onClick={() => setActiveMetric('disk')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeMetric === 'disk'
                ? 'bg-dark-800 text-rose-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
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
              <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 75]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#38bdf8', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="fps" 
                stroke="#00d0e6" 
                strokeWidth={2}
                fill="#00d0e6"
                fillOpacity={0.08} 
                name="Rendered FPS"
              />
            </AreaChart>
          ) : activeMetric === 'cpu' ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#fbbf24', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#f59e0b" 
                strokeWidth={2}
                fill="#f59e0b"
                fillOpacity={0.08} 
                name="CPU utilization %"
              />
            </AreaChart>
          ) : activeMetric === 'ram' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[10, 20]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#c084fc', fontFamily: 'monospace' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="ram" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 2.5 }}
                name="Memory demand (GB)"
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" />
              <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 80]} stroke="#475569" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0b0f17', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#fb7185', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="diskQueue" 
                stroke="#f43f5e" 
                strokeWidth={2}
                fill="#f43f5e"
                fillOpacity={0.08} 
                name="Queued disk requests"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Metric Insight Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400">Status:</span>
          {isAllOptimized ? (
            <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 60 FPS target frame rate maintained
            </span>
          ) : (
            <span className="text-rose-400 font-mono font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Frame drops detected (average {activeMetric === 'fps' ? '28 FPS' : 'stutter'})
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Target frame budget: 16.67 ms
        </span>
      </div>
    </div>
  );
};
