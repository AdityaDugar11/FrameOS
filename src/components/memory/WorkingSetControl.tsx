import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  HardDrive, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const WorkingSetControl: React.FC = () => {
  const { 
    optimizations, 
    toggleOptimization, 
    memoryResult 
  } = useFrameOSStore();

  const isTrimming = optimizations.workingSetTrimming;

  return (
    <div className={`glass-panel rounded-2xl p-5 border transition-all ${
      isTrimming 
        ? 'border-emerald-800/60 bg-emerald-950/20' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Working-Set Trimming & Memory Protection
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active kernel mechanism to evict idle background working sets (inactive browser tabs, AV buffers) to prevent game texture paging.
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('workingSetTrimming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
            isTrimming
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isTrimming ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Working-Set Trimming Active</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>Apply Working-Set Trimming</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Memory Demand
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-rose-400 font-bold text-base'}>
              17.0 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-base">
                  13.7 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isTrimming ? 'Demand < 16 GB RAM (No paging)' : 'Overcommit by 1 GB forces HDD swap'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Browser Footprint
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-amber-400 font-bold text-base'}>
              4.5 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-base">
                  2.5 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isTrimming ? 'Inactive tabs suspended' : 'Inactive tabs holding unneeded RAM'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-dark-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Game Page Evictions
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-slate-400 line-through' : 'text-rose-400 font-bold text-base'}>
              400 MB Evicted
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold text-base">
                  0 MB (100% Resident)
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {isTrimming ? 'Game textures locked in physical RAM' : 'Game textures swapped to HDD!'}
          </span>
        </div>
      </div>
    </div>
  );
};
