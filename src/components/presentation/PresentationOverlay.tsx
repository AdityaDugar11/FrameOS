import React from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Activity
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
  } = useFrameOSStore();

  if (!presentationMode) return null;

  const steps: PresentationStep[] = [
    {
      stepNumber: 1,
      title: 'The central mystery: Why does the game freeze at 40% CPU?',
      subtitle: 'Academic case study: "Gaming PC: Why Does the Game Freeze?"',
      category: 'Problem framing',
      problem: 'A user is playing an online 3D game targeting 60 FPS (16.67 ms per frame). System monitor tools show that CPU utilization never exceeds 41.2%, yet the game suffers violent microstutters and dropped frames.',
      technicalDetails: [
        'Uniprocessor architecture: One logical CPU core shared across 6 active processes.',
        'Total CPU burst requirement across all processes: 55 ms.',
        'Target frame rate: 60 FPS -> Target frame deadline = 1000 ms / 60 = 16.67 ms.',
        'Why low CPU? When processes encounter mechanical disk page faults or mutex blocking, the CPU core has no runnable instructions and enters IDLE state.',
      ],
      solution: 'A freeze is not an issue of insufficient raw compute power; a freeze is a missed deadline caused by operating system scheduling, memory, and synchronization bottlenecks.',
      recommendedTab: 'overview',
      tabLabel: 'Open system overview',
    },
    {
      stepNumber: 2,
      title: 'Bottleneck 1: CPU scheduling latency & the 16.67 ms deadline',
      subtitle: 'Flat round robin (q = 4 ms) violates real-time frame constraints',
      category: 'CPU scheduling',
      problem: 'Round-robin scheduling treats all processes equally with a flat 4ms quantum. When 5 background processes run consecutively, the game waits 19 ms between its execution slices.',
      formula: 'Wait = 23 ms - 4 ms = 19 ms > 16.67 ms (Frame budget)',
      technicalDetails: [
        'Game runs from t = 0 to 4 ms (needs 16 ms more burst).',
        'Ready queue cycles: Browser (4-8ms) -> Antivirus (8-12ms) -> Download (12-16ms) -> Music (16-20ms) -> Chat (20-23ms).',
        'Game only receives its second CPU slice at t = 23 ms. Total inter-slice wait = 19 ms.',
        'Because 19 ms > 16.67 ms, the GPU has no new geometry or render buffer, forcing a dropped frame.',
      ],
      solution: 'Foreground-weighted round robin: Give the game an 8ms quantum and truncate background tasks to 2ms slices. Inter-slice wait drops to 12 ms, strictly meeting the 16.67 ms deadline.',
      recommendedTab: 'scheduler',
      tabLabel: 'Explore CPU scheduler lab',
    },
    {
      stepNumber: 3,
      title: 'Bottleneck 2: Memory overcommit & the 8ms HDD page fault penalty',
      subtitle: '17 GB demand on 16 GB physical RAM triggers secondary storage swapping',
      category: 'Virtual memory & paging',
      problem: 'Physical RAM is 16 GB, but combined memory demand is 17 GB (1 GB overcommit). Background processes force the game into the pagefile on a mechanical HDD.',
      formula: 'EAT = (1 - p) × t_RAM + p × t_fault ≈ 100 ns + (0.0001 × 8,000,000 ns) = 900 ns',
      technicalDetails: [
        'RAM access time is 100 ns. Mechanical HDD page fault latency is 8 ms (8,000,000 ns).',
        'HDD access is 80,000× slower than RAM. A single page fault consumes 8 ms (nearly half the 16.67 ms frame budget).',
        'Effective access time jumps from 100 ns to ~900 ns under HDD paging.',
        'Frequent context switches also reduce L1/L2 cache hit ratio from 95% to 85%, increasing access time from 6.9 ns to 16.7 ns.',
      ],
      solution: 'Apply working-set trimming to drop background memory from 17 GB to 13.7 GB (eliminating paging), or migrate the pagefile to NVMe SSD (100 µs fault latency, EAT = 110 ns).',
      recommendedTab: 'memory',
      tabLabel: 'Explore memory manager',
    },
    {
      stepNumber: 4,
      title: 'Bottleneck 3: I/O saturation & programmed I/O overhead',
      subtitle: '120 req/s disk contention & 31.25% CPU wasted copying network bytes',
      category: 'I/O & DMA',
      problem: 'Storage disk capacity is 100 req/s, but total incoming demand is 120 req/s (+20 req/s queue accumulation). Additionally, network downloads lack DMA offloading.',
      formula: '100 Mbps = 12.5 MB/s → PIO CPU overhead = 31.25% vs DMA = 0.38%',
      technicalDetails: [
        'Antivirus (50 req/s) and download manager (30 req/s) saturate the disk queue ahead of game asset streaming.',
        'Without DMA, the CPU must manually execute instructions to copy each 4-byte packet word from the NIC buffer to RAM.',
        'Over 3.125 million words/sec are copied via CPU registers, wasting 31.25% of all CPU capacity.',
        'Network packet flood (8,500 Hz) causes interrupt storms, constantly preempting game physics.',
      ],
      solution: 'Enable direct memory access (DMA) to drop network CPU cost to 0.38%, tag game assets with real-time I/O priority, and enable interrupt moderation.',
      recommendedTab: 'io',
      tabLabel: 'Explore I/O & DMA lab',
    },
    {
      stepNumber: 5,
      title: 'Bottleneck 4: Priority inversion mutex stutter',
      subtitle: 'Browser (Medium) preempts Antivirus (Low), indirectly starving Game (High)',
      category: 'Process synchronization',
      problem: 'Antivirus acquires an exclusive lock on game_asset.pak. Game requests the lock and blocks. Web Browser preempts Antivirus, leaving Game stalled for 11 ms.',
      formula: 'Lock delay without PIP = 11 ms → Lock delay with PIP = 3 ms',
      technicalDetails: [
        't = 0: Antivirus (Low priority) enters critical section and acquires mutex lock on game_asset.pak.',
        't = 2 ms: Game (High priority) requests the lock -> Blocked (transitions to WAITING queue).',
        't = 3 ms: Browser (Medium priority) arrives. Scheduler: Medium > Low -> Browser preempts Antivirus.',
        'Antivirus is denied CPU cycles and cannot complete its critical section. Game sits completely starved.',
        'Total Game blocking time = 11 ms. In a 16.67 ms frame budget, losing 11 ms guarantees a dropped frame.',
      ],
      solution: 'Priority inheritance protocol (PIP): Antivirus temporarily inherits Game\'s high priority, preventing browser preemption and releasing the lock in only 3 ms.',
      recommendedTab: 'sync',
      tabLabel: 'Explore process sync lab',
    },
    {
      stepNumber: 6,
      title: 'The solution: FrameOS kernel optimizations & 60 FPS verified',
      subtitle: 'All four OS subsystems synchronized for real-time deadline guarantees',
      category: 'Optimization & verification',
      problem: 'How do all 8 proposed mechanisms come together to eliminate frame drops without upgrading hardware?',
      technicalDetails: [
        'Longest game wait: Reduced from 19 ms to 12 ms (-36.8%, 60 FPS preserved).',
        'Game completion: Reduced from 55 ms to 43 ms (-21.8%).',
        'Priority inversion block: Reduced from 11 ms to 3 ms (-72.7%).',
        'Paging effective access time: Reduced from 900 ns to 110 ns (-87.8%).',
        'Download CPU overhead: Reduced from 31.25% to 0.38% (-98.8%).',
      ],
      solution: 'By aligning CPU scheduling, memory residency, I/O offloading, and priority inheritance, FrameOS transforms a stuttering 28 FPS gaming experience into a locked 60 FPS output.',
      recommendedTab: 'optimization',
      tabLabel: 'Open optimization center',
    },
  ];

  const current = steps[presentationStep];

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
    <div className="fixed inset-0 z-50 bg-[#080b11]/98 flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Nav Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-semibold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">
                FrameOS presentation walkthrough
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300 border border-slate-700">
                Operating systems case study
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive demonstration for professors, reviewers, and systems engineers
            </p>
          </div>
        </div>

        <button
          onClick={() => setPresentationMode(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit presentation</span>
        </button>
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto py-6 max-w-4xl mx-auto w-full">
        {/* Slide Counter & Category Pill */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-cyan-400">
            Slide {current.stepNumber} of {steps.length} · {current.category}
          </span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setPresentationStep(i)}
                className={`h-1 rounded-full transition-all ${
                  presentationStep === i ? 'w-6 bg-cyan-400' : 'w-2 bg-dark-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slide Title */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          {current.title}
        </h2>
        <p className="text-sm font-mono text-slate-400 mt-1 mb-5">
          {current.subtitle}
        </p>

        {/* Slide Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Problem & Technical Breakdown (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            {/* The Problem Box */}
            <div className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-800/40">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                The underlying problem:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {current.problem}
              </p>
            </div>

            {/* Formula display */}
            {current.formula && (
              <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800 font-mono text-xs text-cyan-300">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">
                  Mathematical model:
                </span>
                <code>{current.formula}</code>
              </div>
            )}

            {/* Key Technical Bullets */}
            <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-400 block mb-1">
                Operating system technical details:
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {current.technicalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 font-mono mt-0.5">•</span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution & Interactive Jump (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-dark-900 border border-slate-800 space-y-3">
            <div>
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                FrameOS solution:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                {current.solution}
              </p>

              {/* Slide 6 Special: One-Click Apply */}
              {current.stepNumber === 6 && (
                <div className="pt-1">
                  <button
                    onClick={applyAllOptimizations}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-semibold text-xs transition-colors"
                  >
                    Apply all optimizations now
                  </button>
                </div>
              )}
            </div>

            {/* Jump to Lab Button */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveTab(current.recommendedTab);
                  setPresentationMode(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-dark-850 hover:bg-dark-800 text-cyan-300 font-mono text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
              >
                <span>{current.tabLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Walkthrough Controls */}
      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 max-w-4xl mx-auto w-full">
        <button
          onClick={handlePrev}
          disabled={presentationStep === 0}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium transition-colors ${
            presentationStep === 0
              ? 'text-slate-600 bg-dark-950 border border-slate-900 cursor-not-allowed'
              : 'text-slate-200 bg-dark-850 hover:bg-dark-800 border border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-xs font-mono text-slate-400">
          Slide {presentationStep + 1} of {steps.length}
        </div>

        <button
          onClick={handleNext}
          disabled={presentationStep === steps.length - 1}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors ${
            presentationStep === steps.length - 1
              ? 'text-slate-600 bg-dark-950 border border-slate-900 cursor-not-allowed'
              : 'text-black bg-cyan-400 hover:bg-cyan-300'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
