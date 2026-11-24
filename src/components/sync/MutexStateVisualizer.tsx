import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  Gamepad2, 
  ArrowUp, 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const MutexStateVisualizer: React.FC = () => {
  const { syncResult } = useFrameOSStore();
  const isInheritance = syncResult.priorityInheritanceEnabled;

  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
            Mutex semaphore state & wait queue
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Mutex primitive: <code>pthread_mutex_t</code>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {/* Resource Lock Card */}
        <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block mb-2">
              Shared critical resource
            </span>
            <div className="w-10 h-10 rounded-lg bg-dark-900 border border-slate-700 mx-auto flex items-center justify-center text-slate-300 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="font-mono font-medium text-xs text-white block">
              game_asset.pak
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Status: <strong className="text-amber-400">Locked</strong>
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Mutual exclusion
          </div>
        </div>

        {/* Current Owner Card */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between text-center transition-colors ${
          isInheritance 
            ? 'bg-cyan-950/20 border-cyan-700/50' 
            : 'bg-rose-950/15 border-rose-800/40'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block mb-2">
              Current lock holder
            </span>
            <div className="w-10 h-10 rounded-lg bg-dark-900 border border-slate-700 mx-auto flex items-center justify-center text-rose-400 mb-2">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-mono font-medium text-xs text-white block">
              Antivirus scanner (AV)
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">Priority:</span>
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                isInheritance ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-dark-850 text-slate-300 border border-slate-800'
              }`}>
                {isInheritance ? 'Level 3 (inherited)' : 'Level 1 (low)'}
              </span>
            </div>
          </div>

          {isInheritance && (
            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <span>Priority elevated via game</span>
            </div>
          )}
        </div>

        {/* Blocked Wait Queue Card */}
        <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-medium block mb-2">
              Blocked mutex wait queue
            </span>
            <div className="w-10 h-10 rounded-lg bg-dark-900 border border-slate-700 mx-auto flex items-center justify-center text-cyan-400 mb-2">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-mono font-medium text-xs text-white block">
              Online game (G)
            </span>
            <span className="text-[10px] font-mono text-rose-400 block mt-1">
              State: Waiting (blocked)
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Priority: <strong className="text-cyan-300">Level 3 (high)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
