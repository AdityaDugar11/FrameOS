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
    <div className={`rounded-lg p-5 border transition-colors shadow-xs ${
      isTrimming 
        ? 'border-emerald-300 bg-emerald-50/40' 
        : 'bg-paper-50 border-paper-300'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Working-set trimming & memory protection
            </h3>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Kernel mechanism to evict idle background working sets (inactive browser tabs, AV scan buffers) to prevent game texture paging.
          </p>
        </div>

        <button
          onClick={() => toggleOptimization('workingSetTrimming')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded font-mono text-xs font-semibold transition-colors shrink-0 shadow-xs ${
            isTrimming
              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
              : 'bg-copper-600 hover:bg-copper-700 text-white'
          }`}
        >
          {isTrimming ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Working-set trimming active</span>
            </>
          ) : (
            <span>Apply working-set trimming</span>
          )}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3.5 pt-3.5 border-t border-paper-300 font-mono text-xs">
        <div className="p-3 rounded-md bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">
            Memory demand
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-ink-muted line-through' : 'text-red-700 font-semibold text-sm'}>
              17.0 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-700 font-semibold text-sm">
                  13.7 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isTrimming ? 'Demand < 16 GB RAM (zero paging)' : 'Overcommit by 1 GB forces HDD swap'}
          </span>
        </div>

        <div className="p-3 rounded-md bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">
            Browser footprint
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-ink-muted line-through' : 'text-amber-800 font-semibold text-sm'}>
              4.5 GB
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-700 font-semibold text-sm">
                  2.5 GB
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isTrimming ? 'Inactive tabs suspended' : 'Inactive tabs holding unneeded RAM'}
          </span>
        </div>

        <div className="p-3 rounded-md bg-paper-100 border border-paper-300 shadow-xs">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-semibold">
            Game page evictions
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={isTrimming ? 'text-ink-muted line-through' : 'text-red-700 font-semibold text-sm'}>
              400 MB evicted
            </span>
            {isTrimming && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-700 font-semibold text-sm">
                  0 MB (resident)
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] text-ink-secondary block mt-0.5">
            {isTrimming ? 'Game textures locked in physical RAM' : 'Game textures swapped to HDD'}
          </span>
        </div>
      </div>
    </div>
  );
};
