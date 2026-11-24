import React, { useState } from 'react';
import { 
  Zap, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const CacheSimulator: React.FC = () => {
  const { memoryConfig, setMemoryConfig } = useFrameOSStore();
  const [hitRatioPercent, setHitRatioPercent] = useState<number>(
    Math.round(memoryConfig.cacheHitRatio * 100)
  );

  const tCache = memoryConfig.cacheAccessNs; // 2 ns
  const tRam = memoryConfig.ramAccessNs;     // 100 ns

  // Calculate EAT dynamically: EAT = h * t_cache + (1 - h) * t_RAM
  const h = hitRatioPercent / 100;
  const eatCalculated = Number((h * tCache + (1 - h) * tRam).toFixed(1));

  const handleRatioChange = (val: number) => {
    setHitRatioPercent(val);
    setMemoryConfig({ cacheHitRatio: val / 100 });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              CPU Cache Hit-Ratio Simulator & EAT Formula
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Effective Memory Access Time formula: <span className="font-mono text-cyan-300">EAT = h × t_cache + (1 - h) × t_RAM</span>
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleRatioChange(95)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              hitRatioPercent === 95
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline Clean: 95% (6.9 ns)
          </button>
          <button
            onClick={() => handleRatioChange(85)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              hitRatioPercent === 85
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cache Polluted: 85% (16.7 ns)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Slider & Formula Breakdown (Left 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-300 font-semibold">
                Cache Hit Ratio (h):
              </span>
              <span className={`text-base font-bold ${
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
              className="w-full h-2 bg-dark-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>70% (Thrashing)</span>
              <span>85% (Polluted: 16.7 ns)</span>
              <span>95% (Optimal: 6.9 ns)</span>
              <span>99%</span>
            </div>
          </div>

          {/* Mathematical Step-by-Step Expression */}
          <div className="p-3 rounded-xl bg-dark-850/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">
              Dynamic Step-by-Step Calculation:
            </div>
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span>EAT =</span>
              <span>({h.toFixed(2)} × {tCache} ns)</span>
              <span>+</span>
              <span>({(1 - h).toFixed(2)} × {tRam} ns)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span>EAT =</span>
              <span>{(h * tCache).toFixed(2)} ns (Cache portion)</span>
              <span>+</span>
              <span>{((1 - h) * tRam).toFixed(2)} ns (RAM miss portion)</span>
              <span>=</span>
              <span className="font-bold text-white text-xs">{eatCalculated} ns</span>
            </div>
          </div>
        </div>

        {/* Effective Access Time Result Card (Right 5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-gradient-to-br from-cyan-950/20 to-dark-950 border border-cyan-800/50 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-semibold block">
              Effective Access Time (EAT)
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-300">
                {eatCalculated}
              </span>
              <span className="text-xs font-mono text-slate-400">ns / memory access</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {hitRatioPercent === 95 ? (
                <span className="text-emerald-400">
                  Target 95% Hit Ratio achieved: Memory latency is only 6.9 ns. CPU instruction pipelines run smoothly without memory stalls.
                </span>
              ) : hitRatioPercent === 85 ? (
                <span className="text-rose-400">
                  85% Hit Ratio: Memory latency degraded to 16.7 ns (+142% slowdown). Every memory operand fetch takes 2.4× longer!
                </span>
              ) : (
                <span>
                  Current latency is {eatCalculated} ns. The higher the context switch frequency between processes, the more cache lines are evicted.
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Reference values from study: 95% = 6.9 ns · 85% = 16.7 ns
          </div>
        </div>
      </div>
    </div>
  );
};
