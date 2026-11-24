export type ProcessId = 'G' | 'B' | 'AV' | 'D' | 'M' | 'C' | 'OS';

export type ProcessPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type ProcessState = 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export interface ProcessDefinition {
  id: ProcessId;
  name: string;
  shortName: string;
  category: 'Game' | 'Interactive' | 'System' | 'Background';
  cpuBurst: number; // in milliseconds
  memoryGB: number;
  priority: ProcessPriority;
  priorityLevel: number; // 3 = High, 2 = Medium, 1 = Low
  color: string;
  accentHex: string;
  description: string;
  iconName: string;
  ioRate: number; // requests per sec
}

export interface GanttSlice {
  id: string;
  processId: ProcessId;
  startTime: number;
  endTime: number;
  duration: number;
  remainingBurst: number;
  sliceIndex: number;
  isGame: boolean;
  preempted: boolean;
}

export interface ProcessScheduleMetrics {
  processId: ProcessId;
  arrivalTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
  interSliceWaits: number[];
  maxInterSliceWait: number;
  hasDeadlineMiss: boolean;
}

export interface ScheduleSimulationResult {
  algorithm: 'BASELINE_RR' | 'PROPOSED_FWRR';
  slices: GanttSlice[];
  totalTime: number;
  processMetrics: Record<ProcessId, ProcessScheduleMetrics>;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  gameCompletionTime: number;
  gameMaxInterSliceWait: number;
  gameMissedDeadlines: number;
  referenceComparison: {
    gameCompletionExpected: number;
    gameMaxWaitExpected: number;
    avgWaitingExpected: number;
    avgTurnaroundExpected: number;
    discrepancies: string[];
  };
}

export interface MemoryConfig {
  physicalRamGB: number;
  reservedOsGB: number;
  pagefileType: 'HDD' | 'SSD';
  hddFaultLatencyMs: number;
  ssdFaultLatencyUs: number;
  cacheHitRatio: number;
  cacheAccessNs: number;
  ramAccessNs: number;
  workingSetTrimming: boolean;
}

export interface IoSimulationConfig {
  diskCapacityReqPerSec: number;
  dmaEnabled: boolean;
  ioPrioritizationEnabled: boolean;
  interruptModerationEnabled: boolean;
  networkThroughputMbps: number;
}

export interface SyncSimulationConfig {
  priorityInheritanceEnabled: boolean;
}

export interface OptimizationSettings {
  fwrr: boolean;
  aging: boolean;
  priorityInheritance: boolean;
  workingSetTrimming: boolean;
  ssdPagefile: boolean;
  ioPrioritization: boolean;
  dma: boolean;
  interruptModeration: boolean;
}

export type NavigationTab = 
  | 'overview' 
  | 'scheduler' 
  | 'memory' 
  | 'io' 
  | 'sync' 
  | 'optimization' 
  | 'architecture';
