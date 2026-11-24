export interface SyncTimelineEvent {
  timeMs: number;
  endTimeMs: number;
  runningProcess: 'G' | 'B' | 'AV' | 'NONE';
  gameStatus: 'RUNNING' | 'BLOCKED_ON_LOCK' | 'READY';
  browserStatus: 'WAITING_TO_ARRIVE' | 'RUNNING' | 'READY' | 'TERMINATED';
  avStatus: 'RUNNING_CRITICAL' | 'PREEMPTED' | 'NORMAL';
  lockHeldBy: 'AV' | 'G' | 'NONE';
  avEffectivePriority: number; // 1 = Low, 3 = Inherited High
  description: string;
  isStutterPoint: boolean;
}

export interface SyncSimulationResult {
  priorityInheritanceEnabled: boolean;
  gameBlockDurationMs: number;
  expectedWithoutInheritanceMs: number;
  expectedWithInheritanceMs: number;
  timeline: SyncTimelineEvent[];
  lockReleaseTimeMs: number;
  gameResumeTimeMs: number;
  stutterPrevented: boolean;
  explanation: string[];
}

export function simulatePriorityInversion(
  priorityInheritanceEnabled: boolean
): SyncSimulationResult {
  const timeline: SyncTimelineEvent[] = [];

  if (!priorityInheritanceEnabled) {
    // WITHOUT Priority Inheritance:
    // t=0-2: AV runs, acquires lock at t=1 (av holds lock, normal priority 1)
    timeline.push({
      timeMs: 0,
      endTimeMs: 2,
      runningProcess: 'AV',
      gameStatus: 'READY',
      browserStatus: 'WAITING_TO_ARRIVE',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 1,
      description: 'Antivirus begins file scan and acquires exclusive Mutex on game_asset.pak.',
      isStutterPoint: false,
    });

    // t=2-3: Game wakes up, needs game_asset.pak, requests lock -> BLOCKED! AV runs 1ms
    timeline.push({
      timeMs: 2,
      endTimeMs: 3,
      runningProcess: 'AV',
      gameStatus: 'BLOCKED_ON_LOCK',
      browserStatus: 'WAITING_TO_ARRIVE',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 1,
      description: 'Game (High Priority) requests lock on game_asset.pak. Lock held by AV -> Game BLOCKED!',
      isStutterPoint: true,
    });

    // t=3: Browser (Medium priority) arrives with CPU burst
    // Scheduler: Browser (Pri 2) > Antivirus (Pri 1). Browser preempts AV!
    // Game sits blocked from t=2 until t=13!
    timeline.push({
      timeMs: 3,
      endTimeMs: 11,
      runningProcess: 'B',
      gameStatus: 'BLOCKED_ON_LOCK',
      browserStatus: 'RUNNING',
      avStatus: 'PREEMPTED',
      lockHeldBy: 'AV',
      avEffectivePriority: 1,
      description: 'Browser (Medium) preempts Antivirus (Low). AV cannot finish critical section! Game is starved!',
      isStutterPoint: true,
    });

    // t=11-13: Browser finishes burst. AV resumes critical section for remaining 2ms
    timeline.push({
      timeMs: 11,
      endTimeMs: 13,
      runningProcess: 'AV',
      gameStatus: 'BLOCKED_ON_LOCK',
      browserStatus: 'TERMINATED',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 1,
      description: 'Browser yields CPU. Antivirus resumes execution and completes its 3ms critical section.',
      isStutterPoint: false,
    });

    // t=13+: AV releases lock, Game unblocks and runs!
    timeline.push({
      timeMs: 13,
      endTimeMs: 17,
      runningProcess: 'G',
      gameStatus: 'RUNNING',
      browserStatus: 'TERMINATED',
      avStatus: 'NORMAL',
      lockHeldBy: 'G',
      avEffectivePriority: 1,
      description: 'Antivirus releases Mutex. Game finally unblocks and acquires lock after 11ms stall!',
      isStutterPoint: false,
    });

    return {
      priorityInheritanceEnabled: false,
      gameBlockDurationMs: 11,
      expectedWithoutInheritanceMs: 11,
      expectedWithInheritanceMs: 3,
      timeline,
      lockReleaseTimeMs: 13,
      gameResumeTimeMs: 13,
      stutterPrevented: false,
      explanation: [
        'Antivirus (Low Priority) holds the mutex lock on game_asset.pak.',
        'Game (High Priority) attempts to acquire the lock and is forced into the WAITING state.',
        'Web Browser (Medium Priority) arrives. Because Medium > Low, the CPU scheduler preempts Antivirus.',
        'Antivirus is denied CPU cycles and cannot complete its critical section to release the lock.',
        'High-priority Game is indirectly blocked by Medium-priority Browser for 11 ms, exceeding safety margins.',
      ],
    };
  } else {
    // WITH Priority Inheritance:
    // t=0-2: AV runs and acquires lock
    timeline.push({
      timeMs: 0,
      endTimeMs: 2,
      runningProcess: 'AV',
      gameStatus: 'READY',
      browserStatus: 'WAITING_TO_ARRIVE',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 1,
      description: 'Antivirus begins file scan and acquires exclusive Mutex on game_asset.pak.',
      isStutterPoint: false,
    });

    // t=2: Game requests lock -> BLOCKED.
    // PRIORITY INHERITANCE TRIGGERED: AV inherits Priority 3 (High)
    timeline.push({
      timeMs: 2,
      endTimeMs: 3,
      runningProcess: 'AV',
      gameStatus: 'BLOCKED_ON_LOCK',
      browserStatus: 'WAITING_TO_ARRIVE',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 3,
      description: 'Game requests lock. Priority Inheritance activates: Antivirus promoted to High Priority (Level 3)!',
      isStutterPoint: false,
    });

    // t=3: Browser arrives with Medium priority (Level 2).
    // Scheduler checks: Antivirus (Inherited Level 3) > Browser (Level 2).
    // Preemption DENIED! AV continues running critical section until t=5.
    timeline.push({
      timeMs: 3,
      endTimeMs: 5,
      runningProcess: 'AV',
      gameStatus: 'BLOCKED_ON_LOCK',
      browserStatus: 'READY',
      avStatus: 'RUNNING_CRITICAL',
      lockHeldBy: 'AV',
      avEffectivePriority: 3,
      description: 'Browser arrives (Medium), but Antivirus holds inherited High Priority. Preemption prevented!',
      isStutterPoint: false,
    });

    // t=5: AV releases lock! Priority reverts from 3 back to 1.
    // Game is unblocked at t=5 and immediately preempts and runs!
    timeline.push({
      timeMs: 5,
      endTimeMs: 9,
      runningProcess: 'G',
      gameStatus: 'RUNNING',
      browserStatus: 'READY',
      avStatus: 'NORMAL',
      lockHeldBy: 'G',
      avEffectivePriority: 1,
      description: 'Antivirus finishes critical section in 3ms, drops priority to Low. Game unblocks and executes!',
      isStutterPoint: false,
    });

    // t=9-17: Browser runs after Game completes its time slice
    timeline.push({
      timeMs: 9,
      endTimeMs: 17,
      runningProcess: 'B',
      gameStatus: 'READY',
      browserStatus: 'RUNNING',
      avStatus: 'NORMAL',
      lockHeldBy: 'NONE',
      avEffectivePriority: 1,
      description: 'Browser runs its CPU burst normally without delaying the game.',
      isStutterPoint: false,
    });

    return {
      priorityInheritanceEnabled: true,
      gameBlockDurationMs: 3,
      expectedWithoutInheritanceMs: 11,
      expectedWithInheritanceMs: 3,
      timeline,
      lockReleaseTimeMs: 5,
      gameResumeTimeMs: 5,
      stutterPrevented: true,
      explanation: [
        'Game blocks on the mutex held by Antivirus at t = 2 ms.',
        'The Priority Inheritance Protocol elevates Antivirus to High Priority (Level 3).',
        'When Web Browser (Medium Priority, Level 2) arrives at t = 3 ms, it CANNOT preempt Antivirus.',
        'Antivirus quickly completes its critical section in 3 ms and releases the lock at t = 5 ms.',
        'Antivirus priority is restored to Low. Game claims the lock and resumes execution immediately.',
        'Blocking duration dropped from 11 ms to 3 ms (73% reduction), safely under the 16.67 ms deadline.',
      ],
    };
  }
}
