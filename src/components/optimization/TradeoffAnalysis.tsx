import React from 'react';
import { Scale } from 'lucide-react';

export const TradeoffAnalysis: React.FC = () => {
  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800/80 space-y-3">
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-200">
          Engineering trade-off: Interactive deadlines vs average throughput
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Trade-off Explanation Box */}
        <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800 text-xs space-y-1.5">
          <span className="font-mono font-semibold text-amber-300 block">
            Why average waiting time increases:
          </span>
          <p className="text-slate-300 font-sans leading-relaxed">
            In the proposed foreground-weighted round robin, the average waiting time across all 6 processes increases from <strong className="text-white font-mono">28.67 ms to 36.33 ms</strong>, and average turnaround increases from <strong className="text-white font-mono">37.83 ms to 45.50 ms</strong>.
          </p>
          <p className="text-slate-400 font-sans leading-relaxed">
            This is an intentional design choice in real-time Operating Systems. A gaming PC is an <em>interactive deadline-driven system</em> where human perception notices tail jitter (a single 19 ms wait causes a visible hitch), whereas background services (downloading a patch, updating antivirus signatures) do not suffer from a 10 ms delay.
          </p>
        </div>

        {/* Aging Mechanism Protection */}
        <div className="p-3.5 rounded-lg bg-dark-950 border border-slate-800 text-xs space-y-1.5">
          <span className="font-mono font-semibold text-emerald-300 block">
            How aging prevents background starvation:
          </span>
          <p className="text-slate-300 font-sans leading-relaxed">
            Without an <strong>aging mechanism</strong>, static foreground priority schemes risk indefinite starvation of background threads if the game continuously demands 100% of the CPU.
          </p>
          <p className="text-slate-400 font-sans leading-relaxed">
            With FrameOS aging enabled, every time a background process sits in the ready queue for more than 32 ms without a slice, its dynamic priority escalates to the head of the queue. This guarantees bounded tail latency for music, chat, and background tasks while maintaining the game's 16.67 ms frame deadline.
          </p>
        </div>
      </div>
    </div>
  );
};
