import React from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Gamepad2, 
  Globe, 
  ArrowUp, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const MutexStateVisualizer: React.FC = () => {
  const { syncResult } = useFrameOSStore();
  const isInheritance = syncResult.priorityInheritanceEnabled;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Mutex Semaphore State & Wait Queue
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Mutex Primitive: <code>pthread_mutex_t</code>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* Resource Lock Card */}
        <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
              Shared Critical Resource
            </span>
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800 mx-auto flex items-center justify-center text-cyan-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <span className="font-mono font-bold text-xs text-white block">
              game_asset.pak
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Status: <strong className="text-amber-400">BUSY / LOCKED</strong>
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Exclusive Mutual Exclusion
          </div>
        </div>

        {/* Current Owner Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between text-center transition-all ${
          isInheritance 
            ? 'bg-cyan-950/20 border-cyan-700/60 shadow-glow-cyan' 
            : 'bg-rose-950/20 border-rose-800/60'
        }`}>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
              Current Lock Holder
            </span>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-600/50 mx-auto flex items-center justify-center text-rose-400 mb-2">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-mono font-bold text-xs text-white block">
              Antivirus Scanner (AV)
            </span>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">Priority:</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isInheritance ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' : 'bg-slate-800 text-slate-300'
              }`}>
                {isInheritance ? 'Level 3 (INHERITED)' : 'Level 1 (LOW)'}
              </span>
            </div>
          </div>

          {isInheritance && (
            <div className="mt-2 text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <span>Priority Elevated via Game</span>
            </div>
          )}
        </div>

        {/* Blocked Wait Queue Card */}
        <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 flex flex-col justify-between text-center">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
              Blocked Mutex Wait Queue
            </span>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-600/50 mx-auto flex items-center justify-center text-cyan-400 mb-2">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="font-mono font-bold text-xs text-white block">
              Online Game (G)
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-semibold block mt-1">
              State: WAITING (BLOCKED)
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            Priority: <strong className="text-cyan-300">Level 3 (HIGH)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
