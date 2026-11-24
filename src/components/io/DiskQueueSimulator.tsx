import React, { useState, useEffect } from 'react';
import { 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const DiskQueueSimulator: React.FC = () => {
  const { 
    ioResult, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const [simulatedSeconds, setSimulatedSeconds] = useState<number>(5);
  const isIoPrioritized = optimizations.ioPrioritization;

  // Auto-increment simulated seconds if queue is growing
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedSeconds(prev => (prev >= 20 ? 5 : prev + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const sources = ioResult.sources;
  const capacity = ioResult.diskCapacityReqPerSec;
  const totalDemand = ioResult.totalDiskDemandReqPerSec;
  const isOverloaded = totalDemand > capacity;

  // Visual queue representation: 15 request icons
  const queueItems = Array.from({ length: 14 }).map((_, i) => {
    if (isIoPrioritized) {
      // Game requests stay at the front!
      return i < 4 ? { id: 'G', color: '#00f0ff', name: 'Game Asset' } :
             i < 9 ? { id: 'AV', color: '#ff3366', name: 'AV Scan' } :
             { id: 'D', color: '#10b981', name: 'Download' };
    } else {
      // FIFO order where AV and D dominate the head of the queue
      return i % 3 === 0 ? { id: 'AV', color: '#ff3366', name: 'AV Scan' } :
             i % 3 === 1 ? { id: 'D', color: '#10b981', name: 'Download' } :
             i % 4 === 0 ? { id: 'B', color: '#f59e0b', name: 'Browser' } :
             { id: 'G', color: '#00f0ff', name: 'Game Asset' };
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
      {/* Header and I/O Priority Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Disk I/O Request Queue & Contention Model
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Capacity: 100 req/s · Total Incoming Demand: {totalDemand} req/s (+20 req/s overload accumulation)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('ioPrioritization')}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 ${
            isIoPrioritized
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
          }`}
        >
          {isIoPrioritized ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>I/O Prioritization Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Enable I/O Prioritization</span>
            </>
          )}
        </button>
      </div>

      {/* Demand Breakdown Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-slate-300 font-semibold">
            I/O Request Demand by Process (Total: {totalDemand} req/s)
          </span>
          <span className="text-rose-400 font-bold">
            Disk Overloaded: +20 req/s deficit
          </span>
        </div>

        <div className="w-full h-8 bg-dark-950 rounded-xl p-1 flex border border-slate-800 overflow-hidden">
          {sources.map((src) => {
            const widthPct = (src.rateReqPerSec / totalDemand) * 100;
            return (
              <div
                key={src.processId}
                className="h-full flex items-center justify-center font-mono font-bold text-[11px] text-black border-r border-dark-950/40"
                style={{ width: `${widthPct}%`, backgroundColor: src.color }}
                title={`${src.name}: ${src.rateReqPerSec} req/s`}
              >
                {src.processId} ({src.rateReqPerSec})
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>Antivirus: 50 req/s (41.7%)</span>
          <span>Download: 30 req/s (25%)</span>
          <span>Game: 25 req/s (20.8%)</span>
          <span>Browser: 15 req/s (12.5%)</span>
        </div>
      </div>

      {/* Visual Live Queue Conveyor */}
      <div className="p-4 rounded-xl bg-dark-950 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Disk Controller Request Queue (Hardware Elevator / NCQ)
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            {isIoPrioritized ? 'Priority Queue (Game Bypasses Backlog)' : 'Strict FIFO (Game Blocked Behind AV & Download)'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          <div className="p-2 rounded-lg bg-dark-850 border border-slate-700 text-center shrink-0">
            <span className="text-[9px] font-mono text-slate-400 block">SERVICING</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Disk Head</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {queueItems.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-dark-900 transition-all"
            >
              <span 
                className="w-4 h-4 rounded-full font-mono font-bold text-[9px] text-black flex items-center justify-center"
                style={{ backgroundColor: item.color }}
              >
                {item.id}
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Latency & Asset Stutter Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Game Asset Load Latency</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-bold ${isIoPrioritized ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isIoPrioritized ? '12 ms' : `${ioResult.gameAverageWaitMs} ms`}
            </span>
            <span className="text-slate-400 text-xs">average seek</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isIoPrioritized ? 'Instant shader/texture streaming' : 'Texture pop-in and audio hitching!'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Backlog Queue Growth</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-amber-400">
              +{ioResult.backlogGrowthPerSec} req/sec
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Incoming 120 exceeds capacity 100
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Asset Streaming Stutter Risk</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-bold ${
              isIoPrioritized ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isIoPrioritized ? 'MINIMAL' : 'CRITICAL'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isIoPrioritized ? 'Real-time I/O elevator tag' : 'Unbounded queue accumulation'}
          </span>
        </div>
      </div>
    </div>
  );
};
