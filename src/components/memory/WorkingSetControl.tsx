import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const WorkingSetControl: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization, 
  } = useFrameOSStore();

  const isTrimming = optimizations.workingSetTrimming;

  return (
    <div className={`glass-panel rounded-xl p-5 border transition-colors ${
      isTrimming 
        ? 'border-emerald-800/40 bg-dark-900' 
        : 'border-slate-800/80 hover:border-slate-750'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
              Working-set trimming & memory protection
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kernel mechanism to evict idle background working sets (inactive browser tabs, AV scan buffers) to prevent game texture paging.
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('workingSetTrimming')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-medium transition-colors shrink-0 ${
            isTrimming
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold'
              : 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold'
          }`}
        >
          {isTrimming ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Working-set trimming active</span>
            </>
          ) : (
            <span>Apply working-set trimming</span>
          )}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5 pt-3.5 border-t border-slate-800/80 font-mono text-xs">
        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Memory demand
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-rose-400 font-semibold text-sm'}>
              17.0 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">
                  13.7 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isTrimming ? 'Demand < 16 GB RAM (zero paging)' : 'Overcommit by 1 GB forces HDD swap'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Browser footprint
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-amber-400 font-semibold text-sm'}>
              4.5 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">
                  2.5 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isTrimming ? 'Inactive tabs suspended' : 'Inactive tabs holding unneeded RAM'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Game page evictions
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-rose-400 font-semibold text-sm'}>
              400 MB evicted
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold text-sm">
                  0 MB (resident)
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {isTrimming ? 'Game textures locked in physical RAM' : 'Game textures swapped to HDD'}
          </span>
        </div>
      </div>
    </div>
  );
};
