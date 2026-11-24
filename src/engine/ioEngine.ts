import { IoSimulationConfig } from '../types/simulation';

export interface DiskRequestSource {
  processId: 'AV' | 'D' | 'G' | 'B';
  name: string;
  rateReqPerSec: number;
  priority: 'HIGH' | 'LOW';
  color: string;
}

export interface InterruptSource {
  id: string;
  name: string;
  type: 'Hardware' | 'Timer' | 'Device';
  frequencyHz: number;
  cpuOverheadPercent: number;
  description: string;
  mitigation: string;
}

export interface IoSimulationResult {
  diskCapacityReqPerSec: number;
  totalDiskDemandReqPerSec: number;
  isOverloaded: boolean;
  backlogGrowthPerSec: number;
  sources: DiskRequestSource[];
  simulatedQueueLength: number;
  gameAverageWaitMs: number;
  gameAssetStutterRisk: 'CRITICAL' | 'MODERATE' | 'LOW';
  
  // DMA vs PIO
  networkSpeedMbps: number;
  throughputMBps: number;
  dmaEnabled: boolean;
  cpuOverheadPercent: number;
  cpuCycleCostCyclesPerByte: number;
  cpuCopyingWordsPerSec: number;

  // Interrupts
  interrupts: InterruptSource[];
  totalInterruptsPerSec: number;
  interruptContextSwitchPenaltyMs: number;
}

export const DEFAULT_IO_CONFIG: IoSimulationConfig = {
  diskCapacityReqPerSec: 100,
  dmaEnabled: false,
  ioPrioritizationEnabled: false,
  interruptModerationEnabled: false,
  networkThroughputMbps: 100,
};

export function simulateIo(
  config: IoSimulationConfig = DEFAULT_IO_CONFIG,
  simulatedSeconds: number = 5
): IoSimulationResult {
  const {
    diskCapacityReqPerSec,
    dmaEnabled,
    ioPrioritizationEnabled,
    interruptModerationEnabled,
    networkThroughputMbps,
  } = config;

  // Sources of disk demand
  const rawSources: DiskRequestSource[] = [
    {
      processId: 'AV',
      name: 'Antivirus File Scanner',
      rateReqPerSec: 50,
      priority: ioPrioritizationEnabled ? 'LOW' : 'LOW',
      color: '#ff3366',
    },
    {
      processId: 'D',
      name: 'Download Manager Writer',
      rateReqPerSec: 30,
      priority: ioPrioritizationEnabled ? 'LOW' : 'LOW',
      color: '#10b981',
    },
    {
      processId: 'G',
      name: 'Online Game (Asset Streaming)',
      rateReqPerSec: 25,
      priority: ioPrioritizationEnabled ? 'HIGH' : 'LOW',
      color: '#00f0ff',
    },
    {
      processId: 'B',
      name: 'Web Browser Cache',
      rateReqPerSec: 15,
      priority: ioPrioritizationEnabled ? 'LOW' : 'LOW',
      color: '#f59e0b',
    },
  ];

  const totalDemand = rawSources.reduce((acc, s) => acc + s.rateReqPerSec, 0); // 120 req/s
  const isOverloaded = totalDemand > diskCapacityReqPerSec;
  const excessPerSec = isOverloaded ? totalDemand - diskCapacityReqPerSec : 0; // +20 req/s

  // Cumulative queue length over time
  const simulatedQueueLength = Math.min(250, Math.round(excessPerSec * simulatedSeconds + (isOverloaded ? 15 : 4)));

  // Game wait time
  let gameAverageWaitMs = 0;
  let gameAssetStutterRisk: 'CRITICAL' | 'MODERATE' | 'LOW' = 'LOW';

  if (!ioPrioritizationEnabled) {
    // FIFO disk queue where game requests wait behind AV (50 req/s) & Download (30 req/s)
    gameAverageWaitMs = Math.round(simulatedQueueLength * 8.5 + 45); // 8.5ms average seek & latency
    gameAssetStutterRisk = gameAverageWaitMs > 100 ? 'CRITICAL' : 'MODERATE';
  } else {
    // Prioritized queue (Elevator algorithm with High Priority queue jump)
    gameAverageWaitMs = 12; // Serviced within single rotational cycle
    gameAssetStutterRisk = 'LOW';
  }

  // DMA vs PIO calculations
  // 100 Mbps = 12.5 MB/s
  const throughputMBps = Number((networkThroughputMbps / 8).toFixed(2)); // 12.5 MB/s
  
  // As cited in case study:
  // Without DMA (Programmed I/O): CPU cost = 31.25%
  // With DMA: CPU cost = 0.38%
  const cpuOverheadPercent = dmaEnabled ? 0.38 : 31.25;
  const cpuCycleCostCyclesPerByte = dmaEnabled ? 0.05 : 4.0;
  const cpuCopyingWordsPerSec = dmaEnabled ? 0 : Math.round(throughputMBps * 1024 * 1024 / 4);

  // Interrupt Sources
  const baseInterrupts: InterruptSource[] = [
    {
      id: 'timer',
      name: 'Programmable Interval Timer (PIT / HPET)',
      type: 'Timer',
      frequencyHz: 1000,
      cpuOverheadPercent: 1.1,
      description: 'Generates timer ticks for OS scheduler quantum tracking.',
      mitigation: 'Tickless OS kernel / Dynamic ticks (dynticks)',
    },
    {
      id: 'input',
      name: 'High-Polling Gaming Mouse & Keyboard',
      type: 'Hardware',
      frequencyHz: 1000,
      cpuOverheadPercent: 2.4,
      description: 'Sends USB interrupt transfers per packet to maintain low input lag.',
      mitigation: 'Direct input polling buffers & core isolation',
    },
    {
      id: 'nic',
      name: 'Network Interface Card (NIC)',
      type: 'Device',
      frequencyHz: interruptModerationEnabled ? 800 : 8500,
      cpuOverheadPercent: interruptModerationEnabled ? 0.9 : 8.5,
      description: 'Signals arrival of incoming Ethernet / Wi-Fi packets.',
      mitigation: 'Interrupt Moderation (Coalescing timer & packet batching)',
    },
    {
      id: 'storage',
      name: 'NVMe / SATA Storage Controller',
      type: 'Device',
      frequencyHz: 4200,
      cpuOverheadPercent: 3.2,
      description: 'Signals completion of block read/write commands.',
      mitigation: 'Command queuing (NCQ/NVMe submission & completion rings)',
    },
    {
      id: 'gpu',
      name: 'GPU V-Sync & Audio DMA Underrun Watcher',
      type: 'Hardware',
      frequencyHz: 60,
      cpuOverheadPercent: 0.4,
      description: 'Signals vertical blanking interval (16.67ms) to swap front/back buffers.',
      mitigation: 'Direct G-Sync / FreeSync adaptive sync',
    },
  ];

  const totalInterruptsPerSec = baseInterrupts.reduce((sum, i) => sum + i.frequencyHz, 0);
  const interruptContextSwitchPenaltyMs = Number((totalInterruptsPerSec * 0.0008).toFixed(2));

  return {
    diskCapacityReqPerSec,
    totalDiskDemandReqPerSec: totalDemand,
    isOverloaded,
    backlogGrowthPerSec: excessPerSec,
    sources: rawSources,
    simulatedQueueLength,
    gameAverageWaitMs,
    gameAssetStutterRisk,
    networkSpeedMbps: networkThroughputMbps,
    throughputMBps,
    dmaEnabled,
    cpuOverheadPercent,
    cpuCycleCostCyclesPerByte,
    cpuCopyingWordsPerSec,
    interrupts: baseInterrupts,
    totalInterruptsPerSec,
    interruptContextSwitchPenaltyMs,
  };
}
