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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-slate-700/80 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-tight">
              Simulation parameters & settings
            </h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Academic Model Disclaimer Box */}
          <div className="p-3 rounded-lg bg-dark-950 border border-slate-800 flex gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-slate-200">
                Academic case study model note
              </p>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Default values (55ms burst, 17 GB memory on 16 GB RAM, 8ms HDD page fault, 120 req/s disk load) are illustrative mathematical figures taken directly from the Operating Systems case study <em>"Gaming PC: Why Does the Game Freeze?"</em>.
              </p>
            </div>
          </div>

          {/* Process Parameter Configuration */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              Process bursts & memory demands
            </h3>

            <div className="space-y-2">
              {processes.map((proc) => (
                <div 
                  key={proc.id} 
                  className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-5 h-5 rounded font-mono font-bold text-[10px] text-black flex items-center justify-center"
                      style={{ backgroundColor: proc.accentHex }}
                    >
                      {proc.id}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-200">{proc.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Priority: {proc.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* CPU Burst Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-slate-400 font-mono">Burst:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={proc.cpuBurst}
                        onChange={(e) => updateProcessBurst(proc.id, Number(e.target.value))}
                        className="w-14 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-cyan-300 font-mono text-xs text-right"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">ms</span>
                    </div>

                    {/* Memory Demand Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-slate-400 font-mono">RAM:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="32"
                        value={proc.memoryGB}
                        onChange={(e) => updateProcessMemory(proc.id, Number(e.target.value))}
                        className="w-14 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-purple-300 font-mono text-xs text-right"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">GB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hardware & Latency Parameters */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              Memory & storage latencies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
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
                    className="w-16 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-amber-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ms (default: 8 ms)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
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
                    className="w-16 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-emerald-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">µs (default: 100 µs)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
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
                    className="w-16 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ns (default: 2 ns)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
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
                    className="w-16 px-2 py-0.5 rounded bg-dark-900 border border-slate-700 text-purple-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ns (default: 100 ns)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between bg-dark-950">
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to defaults</span>
          </button>

          <button
            onClick={() => setSettingsOpen(false)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
