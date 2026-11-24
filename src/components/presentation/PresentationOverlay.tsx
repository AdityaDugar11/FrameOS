import React from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  HardDrive, 
  Network, 
  Lock, 
  Award, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useFrameOSStore } from '../../store/useFrameOSStore';
import { NavigationTab } from '../../types/simulation';

interface PresentationStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  category: string;
  problem: string;
  technicalDetails: string[];
  formula?: string;
  solution: string;
  recommendedTab: NavigationTab;
  tabLabel: string;
}

export const PresentationOverlay: React.FC = () => {
  const { 
    presentationMode, 
    setPresentationMode, 
    presentationStep, 
    setPresentationStep,
    setActiveTab,
    applyAllOptimizations,
    resetAllOptimizations,
    optimizations
  } = useFrameOSStore();

  if (!presentationMode) return null;

  const steps: PresentationStep[] = [
    {
      stepNumber: 1,
      title: 'The Central Mystery: Why Does the Game Freeze at 40% CPU?',
      subtitle: 'Academic Case Study: "Gaming PC: Why Does the Game Freeze?"',
      category: 'System Overview & Problem Framing',
      problem: 'A user is playing an online 3D game targeting 60 FPS (16.67 ms per frame). System monitor tools show that CPU utilization never exceeds 41.2%, yet the game suffers violent microstutters and dropped frames.',
      technicalDetails: [
        'Uniprocessor architecture: One logical CPU core shared across 6 active processes.',
        'Total CPU burst requirement across all processes: 55 ms.',
        'Target frame rate: 60 FPS -> Target frame deadline = 1000 ms / 60 = 16.67 ms.',
        'Why low CPU? When processes encounter mechanical disk page faults or mutex blocking, the CPU core has no runnable instructions and enters IDLE state.',
      ],
      solution: 'A freeze is not an issue of insufficient raw compute power; a freeze is a missed deadline caused by Operating System scheduling, memory, and synchronization bottlenecks.',
      recommendedTab: 'overview',
      tabLabel: 'Open System Overview',
    },
    {
      stepNumber: 2,
      title: 'Bottleneck 1: CPU Scheduling Latency & The 16.67 ms Deadline',
      subtitle: 'Flat Round Robin (q = 4 ms) violates real-time frame constraints',
      category: 'CPU Scheduling Subsystem',
      problem: 'Round-Robin scheduling treats all processes equally with a flat 4ms quantum. When 5 background processes run consecutively, the Game waits 19 ms between its execution slices!',
      formula: '\\Delta t_{wait} = 23\\text{ ms} - 4\\text{ ms} = 19\\text{ ms} > 16.6667\\text{ ms (Frame Budget)}',
      technicalDetails: [
        'Game runs from t = 0 to 4 ms (needs 16 ms more burst).',
        'Ready queue cycles: Browser (4-8ms) -> Antivirus (8-12ms) -> Download (12-16ms) -> Music (16-20ms) -> Chat (20-23ms).',
        'Game only receives its second CPU slice at t = 23 ms! Total inter-slice wait = 19 ms.',
        'Because 19 ms > 16.67 ms, the GPU has no new geometry or render buffer, forcing a dropped frame.',
      ],
      solution: 'Foreground-Weighted Round Robin (FWRR): Give the Game an 8ms quantum and truncate background tasks to 2ms slices. Inter-slice wait drops to 12 ms, strictly meeting the 16.67 ms deadline.',
      recommendedTab: 'scheduler',
      tabLabel: 'Explore CPU Scheduler Lab',
    },
    {
      stepNumber: 3,
      title: 'Bottleneck 2: Memory Overcommit & The 8ms HDD Abyss',
      subtitle: '17 GB Demand on 16 GB Physical RAM triggers secondary storage swapping',
      category: 'Virtual Memory & Paging',
      problem: 'Physical RAM is 16 GB, but combined memory demand is 17 GB (1 GB overcommit). Background processes force the game into the pagefile on a mechanical HDD.',
      formula: 'EAT = (1 - p) \\cdot t_{RAM} + p \\cdot t_{fault} \\approx 100\\text{ ns} + (0.0001 \\cdot 8,000,000\\text{ ns}) = 900\\text{ ns}',
      technicalDetails: [
        'RAM access time is 100 ns. Mechanical HDD page fault latency is 8 ms (8,000,000 ns).',
        'HDD access is 80,000× slower than RAM! A single page fault consumes 8 ms (nearly half the 16.67 ms frame budget).',
        'Effective Access Time jumps from 100 ns to ~900 ns under HDD paging.',
        'Frequent context switches also reduce L1/L2 cache hit ratio from 95% to 85%, increasing access time from 6.9 ns to 16.7 ns.',
      ],
      solution: 'Apply Working-Set Trimming to drop background memory from 17 GB to 13.7 GB (eliminating paging), or migrate the pagefile to NVMe SSD (100 µs fault latency, EAT = 110 ns).',
      recommendedTab: 'memory',
      tabLabel: 'Explore Memory Manager',
    },
    {
      stepNumber: 4,
      title: 'Bottleneck 3: I/O Saturation & Programmed I/O Overhead',
      subtitle: '120 req/s disk contention & 31.25% CPU wasted copying network bytes',
      category: 'I/O Subsystem & DMA',
      problem: 'Storage disk capacity is 100 req/s, but total incoming demand is 120 req/s (+20 req/s queue accumulation). Additionally, network downloads lack DMA offloading.',
      formula: '100\\text{ Mbps} = 12.5\\text{ MB/s} \\implies \\text{PIO CPU Overhead} = 31.25\\% \\text{ vs } \\text{DMA} = 0.38\\%',
      technicalDetails: [
        'Antivirus (50 req/s) and Download Manager (30 req/s) saturate the disk queue ahead of Game asset streaming.',
        'Without DMA, the CPU must manually execute instructions to copy each 4-byte packet word from the NIC buffer to RAM.',
        'Over 3.125 million words/sec are copied via CPU registers, wasting 31.25% of all CPU capacity!',
        'Network packet flood (8,500 Hz) causes interrupt storms, constantly preempting game physics.',
      ],
      solution: 'Enable Direct Memory Access (DMA) to drop network CPU cost to 0.38%, tag Game assets with Real-Time I/O priority, and enable Interrupt Moderation.',
      recommendedTab: 'io',
      tabLabel: 'Explore I/O & DMA Lab',
    },
    {
      stepNumber: 5,
      title: 'Bottleneck 4: Priority Inversion Mutex Stutter',
      subtitle: 'Browser (Medium) preempts Antivirus (Low), indirectly starving Game (High)',
      category: 'Process Synchronization',
      problem: 'Antivirus acquires an exclusive lock on game_asset.pak. Game requests the lock and blocks. Web Browser preempts Antivirus, leaving Game stalled for 11 ms!',
      formula: '\\text{Lock Delay without PIP} = 11\\text{ ms} \\longrightarrow \\text{Lock Delay with PIP} = 3\\text{ ms}',
      technicalDetails: [
        't = 0: Antivirus (Low priority) enters critical section and acquires mutex lock on game_asset.pak.',
        't = 2 ms: Game (High priority) requests the lock -> Blocked (transitions to WAITING queue).',
        't = 3 ms: Browser (Medium priority) arrives. Scheduler: Medium > Low -> Browser preempts Antivirus!',
        'Antivirus is denied CPU cycles and cannot complete its critical section. Game sits completely starved.',
        'Total Game blocking time = 11 ms. In a 16.67 ms frame budget, losing 11 ms guarantees a dropped frame!',
      ],
      solution: 'Priority Inheritance Protocol (PIP): Antivirus temporarily inherits Game\'s High priority, preventing Browser preemption and releasing the lock in only 3 ms.',
      recommendedTab: 'sync',
      tabLabel: 'Explore Process Sync Lab',
    },
    {
      stepNumber: 6,
      title: 'The Solution: FrameOS Kernel Optimizations & 60 FPS Locked',
      subtitle: 'All 4 OS subsystems synchronized for real-time deadline guarantees',
      category: 'Optimization & Final Proof',
      problem: 'How do all 8 proposed mechanisms come together to eliminate frame drops without upgrading hardware?',
      technicalDetails: [
        'Longest game wait: Reduced from 19 ms to 12 ms (-36.8%, 60 FPS preserved).',
        'Game completion: Reduced from 55 ms to 43 ms (-21.8%).',
        'Priority inversion block: Reduced from 11 ms to 3 ms (-72.7%).',
        'Paging Effective Access Time: Reduced from 900 ns to 110 ns (-87.8%).',
        'Download CPU Overhead: Reduced from 31.25% to 0.38% (-98.8%).',
      ],
      solution: 'By aligning CPU scheduling, memory residency, I/O offloading, and priority inheritance, FrameOS transforms a stuttering 28 FPS gaming experience into a flawless, locked 60 FPS output.',
      recommendedTab: 'optimization',
      tabLabel: 'Open Optimization Center',
    },
  ];

  const current = steps[presentationStep];
  const isAllOptimized = Object.values(optimizations).every(Boolean);

  const handleNext = () => {
    if (presentationStep < steps.length - 1) {
      setPresentationStep(presentationStep + 1);
    }
  };

  const handlePrev = () => {
    if (presentationStep > 0) {
      setPresentationStep(presentationStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080d]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Nav Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 font-bold">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm font-mono uppercase tracking-wider text-white">
                FrameOS Presentation Walkthrough
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                College OS Case Study
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Guided walkthrough for professors, students, and systems engineers
            </p>
          </div>
        </div>

        <button
          onClick={() => setPresentationMode(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit Presentation</span>
        </button>
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto py-6 max-w-5xl mx-auto w-full">
        {/* Slide Counter & Category Pill */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Slide {current.stepNumber} of {steps.length} · {current.category}
          </span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setPresentationStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  presentationStep === i ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          {current.title}
        </h2>
        <p className="text-sm font-mono text-cyan-300/90 mt-1 mb-6">
          {current.subtitle}
        </p>

        {/* Slide Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Problem & Technical Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* The Problem Box */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/50">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                The Underlying Problem:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {current.problem}
              </p>
            </div>

            {/* Formula display if present */}
            {current.formula && (
              <div className="p-3 rounded-xl bg-dark-950 border border-cyan-800/60 font-mono text-xs text-cyan-300">
                <span className="text-[10px] text-slate-400 uppercase block mb-1">
                  Mathematical Model:
                </span>
                <code>{current.formula}</code>
              </div>
            )}

            {/* Key Technical Bullets */}
            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Technical OS Deep Dive:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {current.technicalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold font-mono mt-0.5">•</span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution & Interactive Jump (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-dark-950 border border-emerald-800/50 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                FrameOS Solution & Proof:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans mb-4">
                {current.solution}
              </p>

              {/* Slide 6 Special: One-Click Apply */}
              {current.stepNumber === 6 && (
                <div className="pt-2">
                  <button
                    onClick={applyAllOptimizations}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-mono font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply All Optimizations Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* Jump to Lab Button */}
            <div className="pt-4 border-t border-emerald-800/40">
              <button
                onClick={() => {
                  setActiveTab(current.recommendedTab);
                  setPresentationMode(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <span>{current.tabLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Walkthrough Controls */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 max-w-5xl mx-auto w-full">
        <button
          onClick={handlePrev}
          disabled={presentationStep === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
            presentationStep === 0
              ? 'text-slate-600 bg-dark-900 border border-slate-800 cursor-not-allowed'
              : 'text-slate-200 bg-dark-800 hover:bg-dark-700 border border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        <div className="text-xs font-mono text-slate-400">
          Slide {presentationStep + 1} of {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={presentationStep === steps.length - 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
            presentationStep === steps.length - 1
              ? 'text-slate-600 bg-dark-900 border border-slate-800 cursor-not-allowed'
              : 'text-black bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20'
          }`}
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
