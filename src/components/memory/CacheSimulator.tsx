import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const CacheSimulator: React.FC = () => {
  const { memoryConfig, setMemoryConfig } = useFrameOSStore();
  const [hitRatioPercent, setHitRatioPercent] = useState<number>(
    Math.round(memoryConfig.cacheHitRatio * 100)
  );

  const tCache = memoryConfig.cacheAccessNs; // 2 ns
  const tRam = memoryConfig.ramAccessNs;     // 100 ns

  // EAT = h * t_cache + (1 - h) * t_RAM
  const h = hitRatioPercent / 100;
  const eatCalculated = Number((h * tCache + (1 - h) * tRam).toFixed(1));

  const handleRatioChange = (val: number) => {
    setHitRatioPercent(val);
    setMemoryConfig({ cacheHitRatio: val / 100 });
  };

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              CPU cache hit-ratio simulator & EAT formula
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Formula: <span className="font-mono text-cyan-300">EAT = h × t_cache + (1 - h) × t_RAM</span>
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 bg-dark-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => handleRatioChange(95)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              hitRatioPercent === 95
                ? 'bg-dark-800 text-emerald-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline: 95% (6.9 ns)
          </button>
          <button
            onClick={() => handleRatioChange(85)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              hitRatioPercent === 85
                ? 'bg-dark-800 text-rose-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Polluted: 85% (16.7 ns)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Slider & Formula Breakdown */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-300">
                Cache hit ratio (h):
              </span>
              <span className={`text-sm font-semibold ${
                hitRatioPercent >= 95 ? 'text-emerald-400' : hitRatioPercent <= 85 ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {hitRatioPercent}%
              </span>
            </div>

            <input
              type="range"
              min="70"
              max="99"
              step="1"
              value={hitRatioPercent}
              onChange={(e) => handleRatioChange(Number(e.target.value))}
              className="w-full h-1.5 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>70% (thrashing)</span>
              <span>85% (polluted: 16.7 ns)</span>
              <span>95% (optimal: 6.9 ns)</span>
              <span>99%</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-dark-900 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] uppercase text-slate-400 font-medium mb-0.5">
              Step-by-step derivation:
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span>EAT =</span>
              <span>({h.toFixed(2)} × {tCache} ns)</span>
              <span>+</span>
              <span>({(1 - h).toFixed(2)} × {tRam} ns)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span>EAT =</span>
              <span>{(h * tCache).toFixed(2)} ns (cache)</span>
              <span>+</span>
              <span>{((1 - h) * tRam).toFixed(2)} ns (RAM miss)</span>
              <span>=</span>
              <span className="font-semibold text-white text-xs">{eatCalculated} ns</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-medium block">
              Effective access time (EAT)
            </span>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-semibold font-mono text-cyan-300">
                {eatCalculated}
              </span>
              <span className="text-xs font-mono text-slate-400">ns / access</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {hitRatioPercent === 95 ? (
                <span className="text-emerald-400">
                  Target 95% hit ratio: Memory latency is 6.9 ns. CPU instruction pipelines operate without memory stalls.
                </span>
              ) : hitRatioPercent === 85 ? (
                <span className="text-rose-400">
                  85% hit ratio: Memory latency increases to 16.7 ns (+142% slowdown). Every memory operand fetch takes 2.4× longer.
                </span>
              ) : (
                <span>
                  Current latency is {eatCalculated} ns. Frequent context switching evicts cache lines and drives memory stalls.
                </span>
              )}
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Case study benchmarks: 95% = 6.9 ns · 85% = 16.7 ns
          </div>
        </div>
      </div>
    </div>
  );
};
