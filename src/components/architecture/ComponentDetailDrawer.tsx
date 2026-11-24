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
    <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-paper-50 border-l border-paper-300 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto text-ink-primary">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-paper-300">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold block mb-0.5">
                {component.layer} component
              </span>
              <h3 className="text-sm font-semibold text-ink-primary font-mono flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                  style={{ backgroundColor: component.color }}
                />
                {component.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-paper-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-3.5 text-xs font-sans">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-semibold mb-1">
                Operating systems definition:
              </h4>
              <p className="text-ink-secondary leading-relaxed bg-paper-100 p-2.5 rounded border border-paper-300 shadow-xs">
                {component.academicDefinition}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-copper-700 font-semibold mb-1">
                Impact on 60 FPS game loop:
              </h4>
              <p className="text-ink-secondary leading-relaxed">
                {component.impactOnGaming}
              </p>
            </div>

            <div className="p-3 rounded bg-red-50 border border-red-200 space-y-0.5 shadow-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-red-800 flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                Baseline bottleneck risk:
              </h4>
              <p className="text-red-900 leading-relaxed font-sans">
                {component.bottleneckRisk}
              </p>
            </div>

            <div className="p-3 rounded bg-emerald-50 border border-emerald-200 space-y-0.5 shadow-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 font-semibold">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                FrameOS mitigation:
              </h4>
              <p className="text-emerald-900 leading-relaxed font-sans">
                {component.frameOsOptimization}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-paper-300 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded bg-ink-primary hover:bg-black text-paper-50 font-mono text-xs font-semibold transition-colors shadow-xs"
          >
            Close inspector
          </button>
        </div>
      </div>
    </div>
  );
};
