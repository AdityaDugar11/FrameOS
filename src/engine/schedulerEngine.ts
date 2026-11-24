import { 
  ProcessId, 
  ProcessDefinition, 
  GanttSlice, 
  ProcessScheduleMetrics, 
  ScheduleSimulationResult 
} from '../types/simulation';

export const INITIAL_PROCESSES: ProcessDefinition[] = [
  {
    id: 'G',
    name: 'Online Game (Renderer & Physics)',
    shortName: 'Online Game',
    category: 'Game',
    cpuBurst: 20,
    memoryGB: 6.0,
    priority: 'HIGH',
    priorityLevel: 3,
    color: 'from-cyan-500 to-blue-600',
    accentHex: '#00f0ff',
    description: 'High-performance 3D game loop requiring consistent 16.67 ms frame execution.',
    iconName: 'Gamepad2',
    ioRate: 25,
  },
  {
    id: 'B',
    name: 'Web Browser (Active Tabs & JS)',
    shortName: 'Web Browser',
    category: 'Interactive',
    cpuBurst: 12,
    memoryGB: 4.5,
    priority: 'MEDIUM',
    priorityLevel: 2,
    color: 'from-amber-400 to-orange-500',
    accentHex: '#f59e0b',
    description: 'Multi-process browser consuming significant memory and intermittent bursts.',
    iconName: 'Globe',
    ioRate: 15,
  },
  {
    id: 'AV',
    name: 'Antivirus Scanner (Background Scan)',
    shortName: 'Antivirus',
    category: 'Background',
    cpuBurst: 10,
    memoryGB: 1.5,
    priority: 'LOW',
    priorityLevel: 1,
    color: 'from-rose-500 to-red-600',
    accentHex: '#ff3366',
    description: 'File heuristics scanner performing heavy disk reads and file lock contention.',
    iconName: 'ShieldAlert',
    ioRate: 50,
  },
  {
    id: 'D',
    name: 'Download Manager (P2P / Web)',
    shortName: 'Download Mgr',
    category: 'Background',
    cpuBurst: 6,
    memoryGB: 0.5,
    priority: 'LOW',
    priorityLevel: 1,
    color: 'from-emerald-400 to-teal-500',
    accentHex: '#10b981',
    description: 'High network throughput download generating frequent packet interrupts.',
    iconName: 'DownloadCloud',
    ioRate: 30,
  },
  {
    id: 'M',
    name: 'Music Player (Background Audio)',
    shortName: 'Music Player',
    category: 'Interactive',
    cpuBurst: 4,
    memoryGB: 0.4,
    priority: 'LOW',
    priorityLevel: 1,
    color: 'from-purple-400 to-indigo-500',
    accentHex: '#a855f7',
    description: 'Audio streaming pipeline with small deterministic buffer refills.',
    iconName: 'Music',
    ioRate: 0,
  },
  {
    id: 'C',
    name: 'Chat Application (Voice & Messaging)',
    shortName: 'Chat App',
    category: 'Interactive',
    cpuBurst: 3,
    memoryGB: 1.1,
    priority: 'LOW',
    priorityLevel: 1,
    color: 'from-blue-400 to-sky-500',
    accentHex: '#38bdf8',
    description: 'VoIP client with occasional packet processing and notification triggers.',
    iconName: 'MessageSquare',
    ioRate: 0,
  },
];

export const FRAME_DEADLINE_MS = 16.6667; // 1000ms / 60fps

export function runCpuScheduler(
  algorithm: 'BASELINE_RR' | 'PROPOSED_FWRR',
  customProcesses?: ProcessDefinition[],
  customQuanta?: Record<ProcessId, number>,
  enableAging: boolean = false
): ScheduleSimulationResult {
  const processes = customProcesses || INITIAL_PROCESSES;
  
  // Track remaining bursts and arrival times (all arrive at t = 0)
  const remainingBurst: Record<ProcessId, number> = {} as Record<ProcessId, number>;
  const firstStartTime: Partial<Record<ProcessId, number>> = {};
  const completionTime: Partial<Record<ProcessId, number>> = {};
  const lastSliceEndTime: Partial<Record<ProcessId, number>> = {};
  const interSliceWaits: Record<ProcessId, number[]> = {
    G: [], B: [], AV: [], D: [], M: [], C: [], OS: []
  };

  processes.forEach(p => {
    remainingBurst[p.id] = p.cpuBurst;
  });

  // Ready queue in initial order: G -> B -> AV -> D -> M -> C
  const readyQueue: ProcessId[] = ['G', 'B', 'AV', 'D', 'M', 'C'].filter(id => 
    processes.some(p => p.id === id && p.cpuBurst > 0)
  ) as ProcessId[];

  // Define quanta
  const getQuantum = (pid: ProcessId): number => {
    if (customQuanta && customQuanta[pid] !== undefined) {
      return customQuanta[pid];
    }
    if (algorithm === 'BASELINE_RR') {
      return 4; // Flat 4ms Round Robin
    } else {
      // Foreground-Weighted Round Robin
      switch (pid) {
        case 'G': return 8;
        case 'B': return 4;
        case 'AV': return 2;
        case 'D': return 2;
        case 'M': return 2;
        case 'C': return 2;
        default: return 4;
      }
    }
  };

  const slices: GanttSlice[] = [];
  let currentTime = 0;
  let sliceIndex = 0;

  // Track aging wait times for processes
  const waitSinceLastRun: Record<ProcessId, number> = {
    G: 0, B: 0, AV: 0, D: 0, M: 0, C: 0, OS: 0
  };

  while (readyQueue.length > 0) {
    // If aging is enabled in FWRR, prioritize any background task waiting over 30ms
    if (enableAging && algorithm === 'PROPOSED_FWRR') {
      const starvingIndex = readyQueue.findIndex(pid => pid !== 'G' && waitSinceLastRun[pid] >= 32);
      if (starvingIndex > 0) {
        // Move aged process to front of queue to avoid starvation
        const aged = readyQueue.splice(starvingIndex, 1)[0];
        readyQueue.unshift(aged);
      }
    }

    const currentPid = readyQueue.shift()!;
    const rem = remainingBurst[currentPid];

    if (rem <= 0) continue;

    // Track response time
    if (firstStartTime[currentPid] === undefined) {
      firstStartTime[currentPid] = currentTime;
    }

    // Track inter-slice waiting time
    if (lastSliceEndTime[currentPid] !== undefined) {
      const waitTime = currentTime - lastSliceEndTime[currentPid]!;
      interSliceWaits[currentPid].push(waitTime);
    }

    const quantum = getQuantum(currentPid);
    const executionDuration = Math.min(rem, quantum);
    const startTime = currentTime;
    const endTime = startTime + executionDuration;
    const burstAfter = rem - executionDuration;

    remainingBurst[currentPid] = burstAfter;
    lastSliceEndTime[currentPid] = endTime;
    currentTime = endTime;

    // Update aging counters
    readyQueue.forEach(pid => {
      waitSinceLastRun[pid] += executionDuration;
    });
    waitSinceLastRun[currentPid] = 0;

    slices.push({
      id: `slice-${sliceIndex}`,
      processId: currentPid,
      startTime,
      endTime,
      duration: executionDuration,
      remainingBurst: burstAfter,
      sliceIndex,
      isGame: currentPid === 'G',
      preempted: burstAfter > 0
    });

    sliceIndex++;

    if (burstAfter > 0) {
      readyQueue.push(currentPid);
    } else {
      completionTime[currentPid] = endTime;
    }
  }

  // Calculate metrics per process
  const processMetrics: Record<ProcessId, ProcessScheduleMetrics> = {} as Record<ProcessId, ProcessScheduleMetrics>;
  let sumWaiting = 0;
  let sumTurnaround = 0;
  let sumResponse = 0;
  const count = processes.length;

  processes.forEach(p => {
    const comp = completionTime[p.id] ?? 0;
    const tat = comp - 0; // Arrival time is 0
    const wt = tat - p.cpuBurst;
    const rt = firstStartTime[p.id] ?? 0;
    const waits = interSliceWaits[p.id] || [];
    const maxWait = waits.length > 0 ? Math.max(...waits) : 0;
    const hasDeadlineMiss = waits.some(w => w > FRAME_DEADLINE_MS);

    processMetrics[p.id] = {
      processId: p.id,
      arrivalTime: 0,
      completionTime: comp,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
      interSliceWaits: waits,
      maxInterSliceWait: maxWait,
      hasDeadlineMiss
    };

    sumWaiting += wt;
    sumTurnaround += tat;
    sumResponse += rt;
  });

  const avgWaiting = Number((sumWaiting / count).toFixed(2));
  const avgTurnaround = Number((sumTurnaround / count).toFixed(2));
  const avgResponse = Number((sumResponse / count).toFixed(2));

  const gameMetrics = processMetrics['G'];
  const gameCompletion = gameMetrics ? gameMetrics.completionTime : 0;
  const gameMaxWait = gameMetrics ? gameMetrics.maxInterSliceWait : 0;
  const gameMissedDeadlines = gameMetrics ? gameMetrics.interSliceWaits.filter(w => w > FRAME_DEADLINE_MS).length : 0;

  // Expected reference figures from the academic study
  const referenceComparison = algorithm === 'BASELINE_RR' ? {
    gameCompletionExpected: 55,
    gameMaxWaitExpected: 19,
    avgWaitingExpected: 28.67,
    avgTurnaroundExpected: 37.83,
    discrepancies: [] as string[]
  } : {
    gameCompletionExpected: 43,
    gameMaxWaitExpected: 12,
    avgWaitingExpected: 36.33,
    avgTurnaroundExpected: 45.50,
    discrepancies: [] as string[]
  };

  // Compare and note any discrepancies
  if (Math.abs(gameCompletion - referenceComparison.gameCompletionExpected) > 0.1) {
    referenceComparison.discrepancies.push(
      `Game completion computed: ${gameCompletion}ms vs Reference: ${referenceComparison.gameCompletionExpected}ms`
    );
  }
  if (Math.abs(gameMaxWait - referenceComparison.gameMaxWaitExpected) > 0.1) {
    referenceComparison.discrepancies.push(
      `Game max wait computed: ${gameMaxWait}ms vs Reference: ${referenceComparison.gameMaxWaitExpected}ms`
    );
  }
  if (Math.abs(avgWaiting - referenceComparison.avgWaitingExpected) > 0.1) {
    referenceComparison.discrepancies.push(
      `Average waiting time computed: ${avgWaiting}ms vs Reference: ${referenceComparison.avgWaitingExpected}ms`
    );
  }
  if (Math.abs(avgTurnaround - referenceComparison.avgTurnaroundExpected) > 0.1) {
    referenceComparison.discrepancies.push(
      `Average turnaround computed: ${avgTurnaround}ms vs Reference: ${referenceComparison.avgTurnaroundExpected}ms`
    );
  }

  return {
    algorithm,
    slices,
    totalTime: currentTime,
    processMetrics,
    avgWaitingTime: avgWaiting,
    avgTurnaroundTime: avgTurnaround,
    avgResponseTime: avgResponse,
    gameCompletionTime: gameCompletion,
    gameMaxInterSliceWait: gameMaxWait,
    gameMissedDeadlines,
    referenceComparison
  };
}
