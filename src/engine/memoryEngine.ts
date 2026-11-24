import { MemoryConfig } from '../types/simulation';

export interface ProcessMemoryUsage {
  id: string;
  name: string;
  demandedGB: number;
  allocatedGB: number;
  swappedGB: number;
  isGame: boolean;
  color: string;
}

export interface MemorySimulationResult {
  totalPhysicalRamGB: number;
  totalMemoryDemandGB: number;
  totalAllocatedGB: number;
  totalSwappedGB: number;
  isOvercommitted: boolean;
  overcommitAmountGB: number;
  processes: ProcessMemoryUsage[];
  cacheEATNs: number;
  pagingEATNs: number;
  pageFaultRate: number;
  pageFaultLatencyNs: number;
  cpuStallProbabilityPercent: number;
}

export const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  physicalRamGB: 16.0,
  reservedOsGB: 3.0,
  pagefileType: 'HDD',
  hddFaultLatencyMs: 8.0, // 8 ms = 8,000,000 ns
  ssdFaultLatencyUs: 100.0, // 100 us = 100,000 ns
  cacheHitRatio: 0.95, // 95% baseline
  cacheAccessNs: 2.0,
  ramAccessNs: 100.0,
  workingSetTrimming: false,
};

export function simulateMemory(
  config: MemoryConfig = DEFAULT_MEMORY_CONFIG
): MemorySimulationResult {
  const {
    physicalRamGB,
    reservedOsGB,
    pagefileType,
    hddFaultLatencyMs,
    ssdFaultLatencyUs,
    cacheHitRatio,
    cacheAccessNs,
    ramAccessNs,
    workingSetTrimming,
  } = config;

  // Working-set trimming reduces background memory footprint
  const browserDemand = workingSetTrimming ? 2.5 : 4.5;
  const avDemand = workingSetTrimming ? 0.8 : 1.5;
  const chatDemand = workingSetTrimming ? 0.5 : 1.1;
  const gameDemand = 6.0;
  const downloadDemand = 0.5;
  const musicDemand = 0.4;

  const rawDemands = [
    { id: 'OS', name: 'OS Core & Drivers', demandedGB: reservedOsGB, isGame: false, color: '#64748b' },
    { id: 'G', name: 'Online Game', demandedGB: gameDemand, isGame: true, color: '#00f0ff' },
    { id: 'B', name: 'Web Browser', demandedGB: browserDemand, isGame: false, color: '#f59e0b' },
    { id: 'AV', name: 'Antivirus', demandedGB: avDemand, isGame: false, color: '#ff3366' },
    { id: 'C', name: 'Chat Application', demandedGB: chatDemand, isGame: false, color: '#38bdf8' },
    { id: 'D', name: 'Download Manager', demandedGB: downloadDemand, isGame: false, color: '#10b981' },
    { id: 'M', name: 'Music Player', demandedGB: musicDemand, isGame: false, color: '#a855f7' },
  ];

  const totalDemand = Number(
    rawDemands.reduce((acc, p) => acc + p.demandedGB, 0).toFixed(1)
  );
  const isOvercommitted = totalDemand > physicalRamGB;
  const overcommitAmount = isOvercommitted ? Number((totalDemand - physicalRamGB).toFixed(1)) : 0;

  // Allocate RAM: OS is non-pageable. If trimming enabled, Game working set is protected.
  let availableRam = physicalRamGB;
  const processAllocations: ProcessMemoryUsage[] = [];

  // 1. Allocate OS
  availableRam -= reservedOsGB;
  processAllocations.push({
    id: 'OS',
    name: 'OS Core & Drivers',
    demandedGB: reservedOsGB,
    allocatedGB: reservedOsGB,
    swappedGB: 0,
    isGame: false,
    color: '#64748b',
  });

  // 2. Allocate Game (high priority)
  const gameAllocated = Math.min(gameDemand, availableRam);
  const gameSwapped = isOvercommitted && !workingSetTrimming ? 0.4 : 0; // In baseline overcommit, game pages get evicted
  const actualGameInRam = gameDemand - gameSwapped;
  availableRam -= actualGameInRam;

  processAllocations.push({
    id: 'G',
    name: 'Online Game',
    demandedGB: gameDemand,
    allocatedGB: actualGameInRam,
    swappedGB: gameSwapped,
    isGame: true,
    color: '#00f0ff',
  });

  // 3. Allocate remaining background processes
  const backgroundProcesses = rawDemands.filter(p => p.id !== 'OS' && p.id !== 'G');
  backgroundProcesses.forEach(bp => {
    let allocated = 0;
    let swapped = 0;

    if (availableRam >= bp.demandedGB) {
      allocated = bp.demandedGB;
      availableRam -= bp.demandedGB;
    } else {
      allocated = Math.max(0, availableRam);
      swapped = bp.demandedGB - allocated;
      availableRam = 0;
    }

    processAllocations.push({
      id: bp.id,
      name: bp.name,
      demandedGB: bp.demandedGB,
      allocatedGB: Number(allocated.toFixed(2)),
      swappedGB: Number(swapped.toFixed(2)),
      isGame: false,
      color: bp.color,
    });
  });

  const totalAllocated = Number(
    processAllocations.reduce((acc, p) => acc + p.allocatedGB, 0).toFixed(1)
  );
  const totalSwapped = Number(
    processAllocations.reduce((acc, p) => acc + p.swappedGB, 0).toFixed(1)
  );

  // Cache Effective Access Time:
  // EAT_cache = h * t_cache + (1 - h) * (t_RAM)
  // For 95%: 0.95 * 2 + 0.05 * 100 = 1.9 + 5.0 = 6.9 ns
  // For 85%: 0.85 * 2 + 0.15 * 100 = 1.7 + 15.0 = 16.7 ns
  const cacheEATNs = Number(
    (cacheHitRatio * cacheAccessNs + (1 - cacheHitRatio) * ramAccessNs).toFixed(1)
  );

  // Page fault rate:
  // If memory is not overcommitted, page fault rate is virtually 0 (1 in 100,000,000)
  // If overcommitted, page fault rate p = 0.0001 (0.01%)
  const pageFaultRate = isOvercommitted ? 0.0001 : 0.00000001;
  const pageFaultLatencyNs = pagefileType === 'HDD' 
    ? hddFaultLatencyMs * 1_000_000 // 8 ms = 8,000,000 ns
    : ssdFaultLatencyUs * 1_000;    // 100 us = 100,000 ns

  // Paging EAT: EAT = (1 - p) * t_RAM + p * t_fault
  // HDD: (1 - 0.0001) * 100 + 0.0001 * 8,000,000 = 99.99 + 800 = ~900 ns
  // SSD: (1 - 0.0001) * 100 + 0.0001 * 100,000 = 99.99 + 10 = ~110 ns
  const pagingEATNs = isOvercommitted
    ? Math.round((1 - pageFaultRate) * ramAccessNs + pageFaultRate * pageFaultLatencyNs)
    : ramAccessNs;

  // When paging on HDD with 8ms latency, the CPU stalls frequently waiting for I/O completion
  const cpuStallProbabilityPercent = isOvercommitted
    ? (pagefileType === 'HDD' ? 68.5 : 8.2)
    : 1.2;

  return {
    totalPhysicalRamGB: physicalRamGB,
    totalMemoryDemandGB: totalDemand,
    totalAllocatedGB: totalAllocated,
    totalSwappedGB: totalSwapped,
    isOvercommitted,
    overcommitAmountGB: overcommitAmount,
    processes: processAllocations,
    cacheEATNs,
    pagingEATNs,
    pageFaultRate,
    pageFaultLatencyNs,
    cpuStallProbabilityPercent,
  };
}
