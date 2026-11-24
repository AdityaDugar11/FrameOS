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
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-ink-muted" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
            Mutex semaphore state & wait queue
          </h3>
        </div>
        <span className="text-[10px] font-mono text-ink-muted">
          Mutex primitive: <code>pthread_mutex_t</code>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
        {/* Resource Lock Card */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 flex flex-col justify-between text-center shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold block mb-2">
              Shared critical resource
            </span>
            <div className="w-10 h-10 rounded-md bg-paper-50 border border-paper-300 mx-auto flex items-center justify-center text-ink-primary mb-2 shadow-xs">
              <Lock className="w-5 h-5 text-ink-muted" />
            </div>
            <span className="font-mono font-semibold text-xs text-ink-primary block">
              game_asset.pak
            </span>
            <span className="text-[10px] text-ink-secondary font-mono">
              Status: <strong className="text-amber-800 font-semibold">Locked</strong>
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-paper-300 text-[10px] font-mono text-ink-muted">
            Mutual exclusion
          </div>
        </div>

        {/* Current Owner Card */}
        <div className={`p-3.5 rounded-lg border flex flex-col justify-between text-center transition-all shadow-xs ${
          isInheritance 
            ? 'bg-emerald-50/50 border-emerald-200' 
            : 'bg-red-50/50 border-red-200'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold block mb-2">
              Current lock holder
            </span>
            <div className="w-10 h-10 rounded-md bg-paper-50 border border-paper-300 mx-auto flex items-center justify-center text-red-700 mb-2 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-mono font-semibold text-xs text-ink-primary block">
              Antivirus scanner (AV)
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-mono text-ink-secondary">Priority:</span>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                isInheritance ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'
              }`}>
                {isInheritance ? 'Level 3 (inherited)' : 'Level 1 (low)'}
              </span>
            </div>
          </div>

          {isInheritance && (
            <div className="mt-2 text-[10px] font-mono text-emerald-700 flex items-center justify-center gap-1 font-semibold">
              <ArrowUp className="w-3 h-3" />
              <span>Priority elevated via game</span>
            </div>
          )}
        </div>

        {/* Blocked Wait Queue Card */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 flex flex-col justify-between text-center shadow-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-ink-muted font-semibold block mb-2">
              Blocked mutex wait queue
            </span>
            <div className="w-10 h-10 rounded-md bg-paper-50 border border-paper-300 mx-auto flex items-center justify-center text-copper-700 mb-2 shadow-xs">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-mono font-semibold text-xs text-ink-primary block">
              Online game (G)
            </span>
            <span className="text-[10px] font-mono text-red-700 font-semibold block mt-1">
              State: Waiting (blocked)
            </span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-paper-300 text-[10px] font-mono text-ink-muted">
            Priority: <strong className="text-copper-700 font-semibold">Level 3 (high)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
