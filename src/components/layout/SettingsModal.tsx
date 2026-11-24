import React from 'react';
import { 
  X, 
  RotateCcw, 
  Info, 
  Cpu, 
  HardDrive, 
  Sliders, 
  Database,
  Check
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { ProcessId } from '../../types/simulation';

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
      <div className="bg-dark-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono">
              Simulation Parameters & Settings
            </h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Academic Model Disclaimer Box */}
          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex gap-3 text-xs text-cyan-300">
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-cyan-200">
                Academic Case Study Model Note
              </p>
              <p className="text-cyan-400/80 mt-1 leading-relaxed">
                The default values (55ms total burst, 17 GB memory demand on 16 GB RAM, 8ms HDD page fault, 120 req/s disk load) are illustrative mathematical figures directly taken from the Operating Systems case study <em>"Gaming PC: Why Does the Game Freeze?"</em>. They are designed for educational modeling, not literal PC hardware readings.
              </p>
            </div>
          </div>

          {/* Process Parameter Configuration */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Process Bursts & Memory Demands
            </h3>

            <div className="space-y-3">
              {processes.map((proc) => (
                <div 
                  key={proc.id} 
                  className="p-3 rounded-xl bg-dark-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-black"
                      style={{ backgroundColor: proc.accentHex }}
                    >
                      {proc.id}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{proc.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Priority: {proc.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* CPU Burst Input */}
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-slate-400 font-mono">Burst:</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={proc.cpuBurst}
                        onChange={(e) => updateProcessBurst(proc.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-dark-950 border border-slate-700 text-cyan-300 font-mono text-xs text-right"
                      />
                      <span className="text-[10px] text-slate-400 font-mono">ms</span>
                    </div>

                    {/* Memory Demand Input */}
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-slate-400 font-mono">RAM:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="32"
                        value={proc.memoryGB}
                        onChange={(e) => updateProcessMemory(proc.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded bg-dark-950 border border-slate-700 text-purple-300 font-mono text-xs text-right"
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
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              Memory & Storage Latencies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
                  Mechanical HDD Page Fault Latency
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="20"
                    value={memoryConfig.hddFaultLatencyMs}
                    onChange={(e) => setMemoryConfig({ hddFaultLatencyMs: Number(e.target.value) })}
                    className="w-20 px-2.5 py-1 rounded bg-dark-950 border border-slate-700 text-amber-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ms (default: 8 ms)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
                  NVMe SSD Page Fault Latency
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    step="10"
                    min="10"
                    max="1000"
                    value={memoryConfig.ssdFaultLatencyUs}
                    onChange={(e) => setMemoryConfig({ ssdFaultLatencyUs: Number(e.target.value) })}
                    className="w-20 px-2.5 py-1 rounded bg-dark-950 border border-slate-700 text-emerald-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">µs (default: 100 µs)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
                  L1/L2/L3 Cache Hit Time
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={memoryConfig.cacheAccessNs}
                    onChange={(e) => setMemoryConfig({ cacheAccessNs: Number(e.target.value) })}
                    className="w-20 px-2.5 py-1 rounded bg-dark-950 border border-slate-700 text-cyan-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ns (default: 2 ns)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-850 border border-slate-800">
                <label className="text-xs text-slate-300 font-medium block">
                  Main RAM Access Time
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    step="5"
                    min="20"
                    max="200"
                    value={memoryConfig.ramAccessNs}
                    onChange={(e) => setMemoryConfig({ ramAccessNs: Number(e.target.value) })}
                    className="w-20 px-2.5 py-1 rounded bg-dark-950 border border-slate-700 text-purple-300 font-mono text-xs"
                  />
                  <span className="text-xs text-slate-400 font-mono">ns (default: 100 ns)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-dark-950/50">
          <button
            onClick={resetToAcademicDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-800/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Academic Defaults</span>
          </button>

          <button
            onClick={() => setSettingsOpen(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
