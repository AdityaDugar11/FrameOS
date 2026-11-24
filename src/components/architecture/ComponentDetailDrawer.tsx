import React from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  HardDrive, 
  Network, 
  Database, 
  Zap, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export interface ArchitectureComponent {
  id: string;
  name: string;
  layer: 'User Space' | 'Kernel CPU' | 'Memory Subsystem' | 'I/O & Hardware';
  role: string;
  academicDefinition: string;
  impactOnGaming: string;
  bottleneckRisk: string;
  frameOsOptimization: string;
  color: string;
}

interface ComponentDetailDrawerProps {
  component: ArchitectureComponent | null;
  onClose: () => void;
}

export const ComponentDetailDrawer: React.FC<ComponentDetailDrawerProps> = ({ component, onClose }) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-dark-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                {component.layer} Component
              </span>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: component.color }}
                />
                {component.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-4 text-xs font-sans">
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                Academic Operating Systems Role:
              </h4>
              <p className="text-slate-200 leading-relaxed bg-dark-950 p-3 rounded-xl border border-slate-800">
                {component.academicDefinition}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                Impact on 60 FPS Game Loop:
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {component.impactOnGaming}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-1">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Baseline Bottleneck Risk:
              </h4>
              <p className="text-rose-200 leading-relaxed">
                {component.bottleneckRisk}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-1">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                FrameOS Mitigation:
              </h4>
              <p className="text-emerald-200 leading-relaxed">
                {component.frameOsOptimization}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 font-mono text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
