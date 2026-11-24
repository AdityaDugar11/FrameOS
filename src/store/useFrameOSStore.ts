import { create } from 'zustand';
import { 
  ProcessId, 
  ProcessDefinition, 
  OptimizationSettings, 
  NavigationTab,
  ScheduleSimulationResult,
  MemoryConfig,
  IoSimulationConfig,
} from '../types/simulation';
import { 
  INITIAL_PROCESSES, 
  runCpuScheduler 
} from '../engine/schedulerEngine';
import { 
  simulateMemory, 
  MemorySimulationResult, 
  DEFAULT_MEMORY_CONFIG 
} from '../engine/memoryEngine';
import { 
  simulateIo, 
  IoSimulationResult, 
  DEFAULT_IO_CONFIG 
} from '../engine/ioEngine';
import { 
  simulatePriorityInversion, 
  SyncSimulationResult 
} from '../engine/syncEngine';

interface FrameOSState {
  // Navigation & UI
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  presentationMode: boolean;
  setPresentationMode: (active: boolean) => void;
  presentationStep: number;
  setPresentationStep: (step: number) => void;

  // Configuration
  processes: ProcessDefinition[];
  updateProcessBurst: (id: ProcessId, burst: number) => void;
  updateProcessMemory: (id: ProcessId, memoryGB: number) => void;
  memoryConfig: MemoryConfig;
  setMemoryConfig: (config: Partial<MemoryConfig>) => void;
  ioConfig: IoSimulationConfig;
  setIoConfig: (config: Partial<IoSimulationConfig>) => void;

  // Optimizations
  optimizations: OptimizationSettings;
  toggleOptimization: (key: keyof OptimizationSettings) => void;
  applyAllOptimizations: () => void;
  resetAllOptimizations: () => void;
  resetToAcademicDefaults: () => void;

  // CPU Scheduler Playback
  schedulerAlgorithm: 'BASELINE_RR' | 'PROPOSED_FWRR';
  setSchedulerAlgorithm: (algo: 'BASELINE_RR' | 'PROPOSED_FWRR') => void;
  isPlaying: boolean;
  simCurrentTime: number;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  stepForward: () => void;
  resetSimulationTime: () => void;
  setSimTime: (time: number) => void;

  // Computed Engine Results
  schedulerResult: ScheduleSimulationResult;
  memoryResult: MemorySimulationResult;
  ioResult: IoSimulationResult;
  syncResult: SyncSimulationResult;
}

const DEFAULT_OPTIMIZATIONS: OptimizationSettings = {
  fwrr: false,
  aging: false,
  priorityInheritance: false,
  workingSetTrimming: false,
  ssdPagefile: false,
  ioPrioritization: false,
  dma: false,
  interruptModeration: false,
};

export const useFrameOSStore = create<FrameOSState>((set, get) => {
  // Initial simulations
  const initialScheduler = runCpuScheduler('BASELINE_RR', INITIAL_PROCESSES, undefined, false);
  const initialMemory = simulateMemory(DEFAULT_MEMORY_CONFIG);
  const initialIo = simulateIo(DEFAULT_IO_CONFIG);
  const initialSync = simulatePriorityInversion(false);

  return {
    activeTab: 'overview',
    setActiveTab: (tab) => set({ activeTab: tab }),
    isSettingsOpen: false,
    setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    presentationMode: false,
    setPresentationMode: (active) => set({ presentationMode: active }),
    presentationStep: 0,
    setPresentationStep: (step) => set({ presentationStep: step }),

    processes: [...INITIAL_PROCESSES],
    memoryConfig: { ...DEFAULT_MEMORY_CONFIG },
    ioConfig: { ...DEFAULT_IO_CONFIG },

    optimizations: { ...DEFAULT_OPTIMIZATIONS },

    schedulerAlgorithm: 'BASELINE_RR',
    setSchedulerAlgorithm: (algo) => {
      const state = get();
      const newResult = runCpuScheduler(
        algo, 
        state.processes, 
        undefined, 
        state.optimizations.aging
      );
      set({ 
        schedulerAlgorithm: algo, 
        schedulerResult: newResult,
        simCurrentTime: 0,
        isPlaying: false 
      });
    },

    isPlaying: false,
    simCurrentTime: 0,
    playbackSpeed: 1,
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

    startSimulation: () => set({ isPlaying: true }),
    pauseSimulation: () => set({ isPlaying: false }),
    stepForward: () => {
      const { simCurrentTime, schedulerResult } = get();
      if (simCurrentTime >= schedulerResult.totalTime) {
        set({ isPlaying: false });
        return;
      }
      set({ simCurrentTime: Math.min(schedulerResult.totalTime, simCurrentTime + 1) });
    },
    resetSimulationTime: () => set({ simCurrentTime: 0, isPlaying: false }),
    setSimTime: (time) => set({ simCurrentTime: time }),

    schedulerResult: initialScheduler,
    memoryResult: initialMemory,
    ioResult: initialIo,
    syncResult: initialSync,

    updateProcessBurst: (id, burst) => {
      const state = get();
      const updatedProcesses = state.processes.map(p => 
        p.id === id ? { ...p, cpuBurst: Math.max(1, burst) } : p
      );
      const newScheduler = runCpuScheduler(
        state.schedulerAlgorithm,
        updatedProcesses,
        undefined,
        state.optimizations.aging
      );
      set({ processes: updatedProcesses, schedulerResult: newScheduler });
    },

    updateProcessMemory: (id, memoryGB) => {
      const state = get();
      const updatedProcesses = state.processes.map(p => 
        p.id === id ? { ...p, memoryGB: Math.max(0.1, memoryGB) } : p
      );
      const newMemory = simulateMemory(state.memoryConfig);
      set({ processes: updatedProcesses, memoryResult: newMemory });
    },

    setMemoryConfig: (configUpdate) => {
      const state = get();
      const newConfig = { ...state.memoryConfig, ...configUpdate };
      const newMemory = simulateMemory(newConfig);
      set({ memoryConfig: newConfig, memoryResult: newMemory });
    },

    setIoConfig: (configUpdate) => {
      const state = get();
      const newConfig = { ...state.ioConfig, ...configUpdate };
      const newIo = simulateIo(newConfig);
      set({ ioConfig: newConfig, ioResult: newIo });
    },

    toggleOptimization: (key) => {
      const state = get();
      const newOpts = {
        ...state.optimizations,
        [key]: !state.optimizations[key],
      };

      // Determine scheduler algorithm based on fwrr toggle
      const newAlgo = newOpts.fwrr ? 'PROPOSED_FWRR' : 'BASELINE_RR';

      // Update memory config based on memory toggles
      const newMemoryConfig: MemoryConfig = {
        ...state.memoryConfig,
        workingSetTrimming: newOpts.workingSetTrimming,
        pagefileType: newOpts.ssdPagefile ? 'SSD' : 'HDD',
        cacheHitRatio: newOpts.fwrr ? 0.95 : 0.85,
      };

      // Update I/O config based on I/O toggles
      const newIoConfig: IoSimulationConfig = {
        ...state.ioConfig,
        dmaEnabled: newOpts.dma,
        ioPrioritizationEnabled: newOpts.ioPrioritization,
        interruptModerationEnabled: newOpts.interruptModeration,
      };

      // Run new simulations
      const newScheduler = runCpuScheduler(
        newAlgo,
        state.processes,
        undefined,
        newOpts.aging
      );
      const newMemory = simulateMemory(newMemoryConfig);
      const newIo = simulateIo(newIoConfig);
      const newSync = simulatePriorityInversion(newOpts.priorityInheritance);

      set({
        optimizations: newOpts,
        schedulerAlgorithm: newAlgo,
        memoryConfig: newMemoryConfig,
        ioConfig: newIoConfig,
        schedulerResult: newScheduler,
        memoryResult: newMemory,
        ioResult: newIo,
        syncResult: newSync,
        simCurrentTime: 0,
      });
    },

    applyAllOptimizations: () => {
      const state = get();
      const allOpts: OptimizationSettings = {
        fwrr: true,
        aging: true,
        priorityInheritance: true,
        workingSetTrimming: true,
        ssdPagefile: true,
        ioPrioritization: true,
        dma: true,
        interruptModeration: true,
      };

      const newMemoryConfig: MemoryConfig = {
        ...state.memoryConfig,
        workingSetTrimming: true,
        pagefileType: 'SSD',
        cacheHitRatio: 0.95,
      };

      const newIoConfig: IoSimulationConfig = {
        ...state.ioConfig,
        dmaEnabled: true,
        ioPrioritizationEnabled: true,
        interruptModerationEnabled: true,
      };

      const newScheduler = runCpuScheduler('PROPOSED_FWRR', state.processes, undefined, true);
      const newMemory = simulateMemory(newMemoryConfig);
      const newIo = simulateIo(newIoConfig);
      const newSync = simulatePriorityInversion(true);

      set({
        optimizations: allOpts,
        schedulerAlgorithm: 'PROPOSED_FWRR',
        memoryConfig: newMemoryConfig,
        ioConfig: newIoConfig,
        schedulerResult: newScheduler,
        memoryResult: newMemory,
        ioResult: newIo,
        syncResult: newSync,
        simCurrentTime: 0,
      });
    },

    resetAllOptimizations: () => {
      const state = get();
      const newOpts = { ...DEFAULT_OPTIMIZATIONS };
      const newMemoryConfig: MemoryConfig = {
        ...DEFAULT_MEMORY_CONFIG,
      };
      const newIoConfig: IoSimulationConfig = {
        ...DEFAULT_IO_CONFIG,
      };

      const newScheduler = runCpuScheduler('BASELINE_RR', state.processes, undefined, false);
      const newMemory = simulateMemory(newMemoryConfig);
      const newIo = simulateIo(newIoConfig);
      const newSync = simulatePriorityInversion(false);

      set({
        optimizations: newOpts,
        schedulerAlgorithm: 'BASELINE_RR',
        memoryConfig: newMemoryConfig,
        ioConfig: newIoConfig,
        schedulerResult: newScheduler,
        memoryResult: newMemory,
        ioResult: newIo,
        syncResult: newSync,
        simCurrentTime: 0,
      });
    },

    resetToAcademicDefaults: () => {
      const defaultProcesses = [...INITIAL_PROCESSES];
      const defaultMemory = { ...DEFAULT_MEMORY_CONFIG };
      const defaultIo = { ...DEFAULT_IO_CONFIG };
      const defaultOpts = { ...DEFAULT_OPTIMIZATIONS };

      const schedulerResult = runCpuScheduler('BASELINE_RR', defaultProcesses, undefined, false);
      const memoryResult = simulateMemory(defaultMemory);
      const ioResult = simulateIo(defaultIo);
      const syncResult = simulatePriorityInversion(false);

      set({
        processes: defaultProcesses,
        memoryConfig: defaultMemory,
        ioConfig: defaultIo,
        optimizations: defaultOpts,
        schedulerAlgorithm: 'BASELINE_RR',
        schedulerResult,
        memoryResult,
        ioResult,
        syncResult,
        simCurrentTime: 0,
        isPlaying: false,
      });
    },
  };
});
