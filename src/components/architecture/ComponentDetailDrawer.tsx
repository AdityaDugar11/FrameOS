import React from 'react';
import { 
  X, 
  ShieldAlert,
  Zap
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
      <div className="w-full max-w-md bg-dark-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium block mb-0.5">
                {component.layer} component
              </span>
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: component.color }}
                />
                {component.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-3.5 text-xs font-sans">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Operating systems definition:
              </h4>
              <p className="text-slate-300 leading-relaxed bg-dark-950 p-2.5 rounded-lg border border-slate-800">
                {component.academicDefinition}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
                Impact on 60 FPS game loop:
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {component.impactOnGaming}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40 space-y-0.5">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-medium">
                <ShieldAlert className="w-3.5 h-3.5" />
                Baseline bottleneck risk:
              </h4>
              <p className="text-rose-200 leading-relaxed">
                {component.bottleneckRisk}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-0.5">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5" />
                FrameOS mitigation:
              </h4>
              <p className="text-emerald-200 leading-relaxed">
                {component.frameOsOptimization}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-200 font-mono text-xs font-medium transition-colors"
          >
            Close inspector
          </button>
        </div>
      </div>
    </div>
  );
};
