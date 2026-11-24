import React from 'react';
import { 
  X, 
  RotateCcw, 
  Info, 
  Cpu, 
  HardDrive, 
  SlidersHorizontal, 
  Check
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setSettingsOpen, 
    processes, 
    updateProcessBurst, 
    updateProcessMemory, 
    memoryConfig, 
    setMemoryConfig,
    resetToAcademicDefaults
  } = useFrameOSStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink-primary/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-paper-50 border border-paper-300 rounded-lg w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden text-ink-primary">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-paper-300 flex items-center justify-between bg-paper-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-copper-600" />
            <h2 className="text-sm font-semibold text-ink-primary tracking-tight">
              Simulation parameters & settings
            </h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-paper-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Academic Model Disclaimer Box */}
          <div className="p-3 rounded-md bg-paper-200 border border-paper-300 flex gap-2.5 text-xs text-ink-secondary">
            <Info className="w-4 h-4 text-copper-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink-primary">
                Academic case study model note
              </p>
              <p className="text-ink-secondary mt-0.5 leading-relaxed">
                Default values (55ms burst, 17 GB memory on 16 GB RAM, 8ms HDD page fault, 120 req/s disk load) are illustrative mathematical figures taken directly from the Operating Systems case study <em>"Gaming PC: Why Does the Game Freeze?"</em>.
              </p>
            </div>
          </div>

          {/* Process Parameter Configuration */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-secondary mb-2.5 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-ink-muted" />
              Process bursts & memory demands
            </h3>

            <div className="space-y-2">
              {processes.map((proc) => (
                <div 
                  key={proc.id} 
                  className="p-2.5 rounded-md bg-paper-100 border border-paper-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-5 h-5 rounded font-mono font-bold text-[10px] text-white flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: proc.accentHex }}
                    >
                      {proc.id}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-ink-primary">{proc.name}</p>
                      <p className="text-[10px] text-ink-muted font-mono">Priority: {proc.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* CPU Burst Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-ink-secondary font-mono">Burst:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={proc.cpuBurst}
                        onChange={(e) => updateProcessBurst(proc.id, Number(e.target.value))}
                        className="w-14 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs text-right focus:border-copper-600 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-ink-muted font-mono">ms</span>
                    </div>

                    {/* Memory Demand Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-ink-secondary font-mono">RAM:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="32"
                        value={proc.memoryGB}
                        onChange={(e) => updateProcessMemory(proc.id, Number(e.target.value))}
                        className="w-14 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs text-right focus:border-copper-600 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-ink-muted font-mono">GB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware & Latency Parameters */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-secondary mb-2.5 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-ink-muted" />
              Memory & storage latencies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-md bg-paper-100 border border-paper-300">
                <label className="text-xs text-ink-primary font-medium block">
                  Mechanical HDD page fault latency
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="20"
                    value={memoryConfig.hddFaultLatencyMs}
                    onChange={(e) => setMemoryConfig({ hddFaultLatencyMs: Number(e.target.value) })}
                    className="w-16 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs focus:border-copper-600 focus:outline-hidden"
                  />
                  <span className="text-xs text-ink-muted font-mono">ms (default: 8 ms)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-paper-100 border border-paper-300">
                <label className="text-xs text-ink-primary font-medium block">
                  NVMe SSD page fault latency
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    step="10"
                    min="10"
                    max="1000"
                    value={memoryConfig.ssdFaultLatencyUs}
                    onChange={(e) => setMemoryConfig({ ssdFaultLatencyUs: Number(e.target.value) })}
                    className="w-16 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs focus:border-copper-600 focus:outline-hidden"
                  />
                  <span className="text-xs text-ink-muted font-mono">µs (default: 100 µs)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-paper-100 border border-paper-300">
                <label className="text-xs text-ink-primary font-medium block">
                  L1/L2/L3 cache hit time
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={memoryConfig.cacheAccessNs}
                    onChange={(e) => setMemoryConfig({ cacheAccessNs: Number(e.target.value) })}
                    className="w-16 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs focus:border-copper-600 focus:outline-hidden"
                  />
                  <span className="text-xs text-ink-muted font-mono">ns (default: 2 ns)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-paper-100 border border-paper-300">
                <label className="text-xs text-ink-primary font-medium block">
                  Main RAM access time
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="number"
                    step="5"
                    min="20"
                    max="200"
                    value={memoryConfig.ramAccessNs}
                    onChange={(e) => setMemoryConfig({ ramAccessNs: Number(e.target.value) })}
                    className="w-16 px-2 py-0.5 rounded bg-paper-50 border border-paper-300 text-ink-primary font-mono text-xs focus:border-copper-600 focus:outline-hidden"
                  />
                  <span className="text-xs text-ink-muted font-mono">ns (default: 100 ns)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-paper-300 flex items-center justify-between bg-paper-100">
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono text-red-700 hover:text-red-800 hover:bg-red-50 border border-red-200 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>

          <button
            onClick={() => setSettingsOpen(false)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded text-xs font-mono font-semibold bg-ink-primary hover:bg-black text-paper-50 transition-colors shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
