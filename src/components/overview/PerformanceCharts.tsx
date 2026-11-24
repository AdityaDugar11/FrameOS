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
import { Activity, Cpu, HardDrive, Database, TrendingDown, Check } from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

type ChartMetric = 'fps' | 'cpu' | 'ram' | 'disk';

export const PerformanceCharts: React.FC = () => {
  const { optimizations, schedulerResult } = useFrameOSStore();
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('fps');

  const isAllOptimized = Object.values(optimizations).every(Boolean);
  const isFwrr = optimizations.fwrr;
  const isTrimming = optimizations.workingSetTrimming;
  const isDma = optimizations.dma;
  const isIoPrio = optimizations.ioPrioritization;

  // Generate 20 deterministic time points (0 to 60 seconds / frames)
  const chartData = Array.from({ length: 24 }).map((_, i) => {
    const t = i * 2.5; // seconds
    
    // FPS Curve
    let fpsVal = 60;
    if (!isAllOptimized) {
      // In baseline, periodic stalls occur every 4-8 seconds
      const isStallPoint = i % 4 === 1 || i % 6 === 2;
      fpsVal = isStallPoint ? (isFwrr ? 48 : 24) : (isFwrr ? 58 : 42);
    }

    // CPU Utilization Curve
    let cpuVal = isDma ? 18.4 : 41.2;
    if (!isAllOptimized) {
      cpuVal += (i % 3 === 0 ? 6.5 : -3.2); // fluctuation around 40%
    } else {
      cpuVal += (i % 2 === 0 ? 1.2 : -1.0);
    }

    // RAM Utilization Curve (GB)
    const ramVal = isTrimming ? 13.7 : 17.0;

    // Disk Queue Length Curve (number of queued requests)
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
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      {/* Chart Controls & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Telemetry Over Time
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Deterministic simulation profile across consecutive game loops
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMetric('fps')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeMetric === 'fps'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FPS
          </button>
          <button
            onClick={() => setActiveMetric('cpu')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeMetric === 'cpu'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CPU %
          </button>
          <button
            onClick={() => setActiveMetric('ram')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeMetric === 'ram'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RAM (GB)
          </button>
          <button
            onClick={() => setActiveMetric('disk')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeMetric === 'disk'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Disk Queue
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'fps' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fpsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 75]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#00f0ff', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="fps" 
                stroke="#00f0ff" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#fpsGradient)" 
                name="Rendered FPS"
              />
            </AreaChart>
          ) : activeMetric === 'cpu' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#f59e0b', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#f59e0b" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#cpuGradient)" 
                name="CPU Utilization %"
              />
            </AreaChart>
          ) : activeMetric === 'ram' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[10, 20]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#a855f7', fontFamily: 'monospace' }}
              />
              <Line 
                type="stepAfter" 
                dataKey="ram" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 3 }}
                name="Memory Demand (GB)"
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis domain={[0, 80]} stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0e17', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                itemStyle={{ color: '#ff3366', fontFamily: 'monospace' }}
              />
              <Area 
                type="monotone" 
                dataKey="diskQueue" 
                stroke="#ff3366" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#diskGradient)" 
                name="Queued Disk Requests"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Metric Insight Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400">STATUS:</span>
          {isAllOptimized ? (
            <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 60 FPS Target Frame Rate Achieved
            </span>
          ) : (
            <span className="text-rose-400 font-mono font-semibold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Frame Drops Detected (Average {activeMetric === 'fps' ? '28 FPS' : 'Stutter'})
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
