import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  ArrowRight, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const DiskQueueSimulator: React.FC = () => {
  const { 
    ioResult, 
    optimizations, 
    toggleOptimization 
  } = useFrameOSStore();

  const isIoPrioritized = optimizations.ioPrioritization;
  const sources = ioResult.sources;
  const totalDemand = ioResult.totalDiskDemandReqPerSec;

  const queueItems = Array.from({ length: 14 }).map((_, i) => {
    if (isIoPrioritized) {
      return i < 4 ? { id: 'G', color: '#00d0e6', name: 'Game asset' } :
             i < 9 ? { id: 'AV', color: '#f43f5e', name: 'AV scan' } :
             { id: 'D', color: '#10b981', name: 'Download' };
    } else {
      return i % 3 === 0 ? { id: 'AV', color: '#f43f5e', name: 'AV scan' } :
             i % 3 === 1 ? { id: 'D', color: '#10b981', name: 'Download' } :
             i % 4 === 0 ? { id: 'B', color: '#f59e0b', name: 'Browser' } :
             { id: 'G', color: '#00d0e6', name: 'Game asset' };
    }
  });

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80 space-y-4">
      {/* Header and I/O Priority Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Disk I/O request queue & contention model
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Capacity: 100 req/s · Total incoming demand: {totalDemand} req/s (+20 req/s overload accumulation)
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('ioPrioritization')}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isIoPrioritized
              ? 'bg-emerald-500 text-black font-semibold'
              : 'bg-cyan-500 text-black font-semibold'
          }`}
        >
          {isIoPrioritized ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>I/O prioritization active</span>
            </>
          ) : (
            <span>Enable I/O prioritization</span>
          )}
        </button>
      </div>

      {/* Demand Breakdown Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono mb-1.5">
          <span className="text-slate-300">
            Request demand by process ({totalDemand} req/s total)
          </span>
          <span className="text-rose-400 font-medium">
            Disk overloaded: +20 req/s backlog growth
          </span>
        </div>

        <div className="w-full h-7 bg-dark-950 rounded-lg p-0.5 flex border border-slate-800 overflow-hidden">
          {sources.map((src) => {
            const widthPct = (src.rateReqPerSec / totalDemand) * 100;
            return (
              <div
                key={src.processId}
                className="h-full flex items-center justify-center font-mono font-bold text-[10px] text-black border-r border-dark-950/40"
                style={{ width: `${widthPct}%`, backgroundColor: src.color }}
                title={`${src.name}: ${src.rateReqPerSec} req/s`}
              >
                {src.processId} ({src.rateReqPerSec})
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>Antivirus: 50 req/s</span>
          <span>Download: 30 req/s</span>
          <span>Game: 25 req/s</span>
          <span>Browser: 15 req/s</span>
        </div>
      </div>

      {/* Visual Live Queue Conveyor */}
      <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
            Disk controller request queue (NCQ / elevator)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {isIoPrioritized ? 'Priority queue (game bypasses backlog)' : 'FIFO queue (game blocked behind AV and download)'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="p-2 rounded-lg bg-dark-900 border border-slate-700 text-center shrink-0">
            <span className="text-[9px] font-mono text-slate-400 block">Head</span>
            <span className="text-xs font-mono font-medium text-emerald-400">Disk actuator</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />

          {queueItems.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded border border-slate-800 bg-dark-900"
            >
              <span 
                className="w-3.5 h-3.5 rounded-full font-mono font-bold text-[9px] text-black flex items-center justify-center"
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

      {/* Latency Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Game asset seek latency</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold ${isIoPrioritized ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isIoPrioritized ? '12 ms' : `${ioResult.gameAverageWaitMs} ms`}
            </span>
            <span className="text-slate-400 text-xs">avg seek</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isIoPrioritized ? 'Fast texture streaming' : 'Texture pop-in and audio hitching'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Backlog growth</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-semibold text-amber-400">
              +{ioResult.backlogGrowthPerSec} req/sec
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Incoming 120 exceeds capacity 100
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Stutter risk</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-semibold ${
              isIoPrioritized ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isIoPrioritized ? 'Minimal' : 'Critical'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isIoPrioritized ? 'Real-time elevator tag' : 'Unbounded queue accumulation'}
          </span>
        </div>
      </div>
    </div>
  );
};
