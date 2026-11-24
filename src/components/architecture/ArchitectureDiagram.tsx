import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  HardDrive, 
  Network, 
  Database, 
  Zap, 
  Lock, 
  ArrowRight, 
  ArrowDown, 
  Sliders, 
  Info,
  Activity,
  MousePointer
} from 'lucide-react';
import { ArchitectureComponent, ComponentDetailDrawer } from './ComponentDetailDrawer';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<ArchitectureComponent | null>(null);

  const components: Record<string, ArchitectureComponent> = {
    apps: {
      id: 'apps',
      name: 'User Applications & Threads',
      layer: 'User Space',
      role: 'Software layer generating CPU bursts and memory demands',
      academicDefinition: 'Processes operating in unprivileged User Ring (Ring 3). Communicates with kernel via system calls (syscall / int 0x80).',
      impactOnGaming: 'Online Game loop executes physics, render command buffer construction, and network state reconciliation.',
      bottleneckRisk: 'Background processes (Browser, AV, Torrent) compete for CPU slices and inflate memory demand to 17 GB.',
      frameOsOptimization: 'Priority segregation: Game tagged as High Priority real-time interactive process.',
      color: '#00f0ff',
    },
    pcb: {
      id: 'pcb',
      name: 'Process Control Blocks (PCB)',
      layer: 'Kernel CPU',
      role: 'Stores thread execution context and registers',
      academicDefinition: 'Kernel data structure holding PID, program counter, register state, CPU quantum, open file handles, and memory map.',
      impactOnGaming: 'Every context switch between Game and background processes incurs PCB register state save/restore overhead.',
      bottleneckRisk: 'Frequent switching destroys cache locality and increases pipeline stalls.',
      frameOsOptimization: 'Context switch minimization through Foreground-Weighted Round Robin (longer 8ms slices for game).',
      color: '#38bdf8',
    },
    readyQueue: {
      id: 'readyQueue',
      name: 'Kernel Ready Queue',
      layer: 'Kernel CPU',
      role: 'Queue of processes waiting for logical CPU execution',
      academicDefinition: 'Kernel runqueue storing pointers to PCBs of processes in READY state, awaiting CPU scheduling dispatch.',
      impactOnGaming: 'Determines the inter-slice latency for the Game process.',
      bottleneckRisk: 'When 5 background processes sit in a flat FIFO queue, the Game waits 19 ms, violating the 16.67 ms deadline.',
      frameOsOptimization: 'Foreground-Weighted Round Robin with Aging ensures Game cycles within 12 ms without starving background tasks.',
      color: '#818cf8',
    },
    scheduler: {
      id: 'scheduler',
      name: 'CPU Scheduler (Dispatcher)',
      layer: 'Kernel CPU',
      role: 'Decides which ready process claims the logical CPU core',
      academicDefinition: 'Short-term preemptive scheduling algorithm (e.g. Round Robin, CFS) running on every timer interrupt or process block.',
      impactOnGaming: 'Controls quantum time slice duration and preemption mechanics.',
      bottleneckRisk: 'Flat 4ms Round Robin treats 60 FPS real-time rendering identical to background batch downloads.',
      frameOsOptimization: 'Dynamic quantum differentiation (Game = 8ms, Background = 2ms).',
      color: '#a855f7',
    },
    cpu: {
      id: 'cpu',
      name: 'Logical CPU Core (Uniprocessor)',
      layer: 'Kernel CPU',
      role: 'Executes instructions (ALU, FP, registers)',
      academicDefinition: 'Hardware execution unit with program counter, arithmetic logic units, and branch prediction pipelines.',
      impactOnGaming: 'Runs game physics, AI, and geometry draw call submission.',
      bottleneckRisk: 'Can sit 68% idle during mechanical HDD page faults while game freezes.',
      frameOsOptimization: 'Eliminates memory paging stalls to keep CPU executing productively.',
      color: '#00ff88',
    },
    mmu: {
      id: 'mmu',
      name: 'Memory Management Unit & Cache (L1/L2/L3)',
      layer: 'Memory Subsystem',
      role: 'Translates virtual addresses to physical pages and caches operands',
      academicDefinition: 'Hardware MMU using Translation Lookaside Buffer (TLB) and multilevel page tables with 2ns on-die SRAM caches.',
      impactOnGaming: 'Provides 2ns ultra-low latency operand access for game vertex and matrix math.',
      bottleneckRisk: 'Cache pollution from 6 rotating processes reduces hit ratio from 95% to 85% (latency jumps from 6.9ns to 16.7ns).',
      frameOsOptimization: 'Protected working-set caching and fewer context switches preserve L1/L2 cache lines.',
      color: '#f59e0b',
    },
    ram: {
      id: 'ram',
      name: 'Physical Main Memory (16 GB RAM)',
      layer: 'Memory Subsystem',
      role: 'Primary physical RAM storing resident pages',
      academicDefinition: 'Synchronous Dynamic RAM (DDR4/DDR5) accessed via high-speed memory bus at ~100ns latency.',
      impactOnGaming: 'Holds active game engine textures, sound banks, vertex buffers, and world geometry.',
      bottleneckRisk: '17 GB total demand exceeds 16 GB capacity, triggering page eviction to secondary storage.',
      frameOsOptimization: 'Working-Set Trimming drops background memory to 13.7 GB, keeping game 100% resident.',
      color: '#ec4899',
    },
    pagefile: {
      id: 'pagefile',
      name: 'Pagefile / Swap Storage (HDD vs SSD)',
      layer: 'Memory Subsystem',
      role: 'Secondary backing store for evicted virtual memory pages',
      academicDefinition: 'Reserved disk partition or file used by virtual memory manager when physical RAM is exhausted.',
      impactOnGaming: 'A single page fault on an HDD takes 8 ms (half the entire frame budget!).',
      bottleneckRisk: 'Mechanical HDD page fault latency (8,000,000 ns) causes severe frame stutter.',
      frameOsOptimization: 'Migration to NVMe SSD (100 µs) and working-set trimming to eliminate paging entirely.',
      color: '#ff3366',
    },
    diskQueue: {
      id: 'diskQueue',
      name: 'Disk Request Queue & Storage Controller',
      layer: 'I/O & Hardware',
      role: 'Manages block read/write I/O commands to storage',
      academicDefinition: 'I/O elevator queue (NCQ/NVMe submission ring) ordering block requests to secondary storage.',
      impactOnGaming: 'Streams dynamic game world level assets and textures.',
      bottleneckRisk: '120 req/s load on 100 req/s capacity causes disk queue accumulation (+20 req/s deficit).',
      frameOsOptimization: 'I/O Prioritization tags game requests with Real-Time priority, jumping background AV scans.',
      color: '#f97316',
    },
    dma: {
      id: 'dma',
      name: 'DMA Controller (Direct Memory Access)',
      layer: 'I/O & Hardware',
      role: 'Direct bus data transfer between devices and RAM',
      academicDefinition: 'Specialized coprocessor that reads/writes data blocks over the system bus without CPU intervention.',
      impactOnGaming: 'Frees the CPU to calculate game frames while network downloads continue.',
      bottleneckRisk: 'Without DMA (PIO), CPU wastes 31.25% of cycles executing byte-copy instructions for network traffic.',
      frameOsOptimization: 'DMA mode reduces network CPU overhead to 0.38%.',
      color: '#10b981',
    },
    apic: {
      id: 'apic',
      name: 'Hardware Interrupt Controller (APIC)',
      layer: 'I/O & Hardware',
      role: 'Coordinates hardware device signals to the CPU interrupt pin',
      academicDefinition: 'Advanced Programmable Interrupt Controller arbitrating IRQs and routing interrupt vectors to the IDT.',
      impactOnGaming: 'Processes mouse movements and network packet arrival notifications.',
      bottleneckRisk: 'Unmoderated packet storms (8,500 Hz) cause constant CPU preemption and pipeline flushes.',
      frameOsOptimization: 'Interrupt Moderation coalesces network packets into 800 Hz batches.',
      color: '#eab308',
    },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Title & Help */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Interactive Operating System & Hardware Architecture Map
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Click any architectural subsystem node below to inspect its kernel role, bottleneck risk, and FrameOS optimization
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 bg-dark-950 px-3 py-1 rounded-xl border border-slate-800">
          <MousePointer className="w-3.5 h-3.5" />
          Click any component to inspect
        </span>
      </div>

      {/* Structured Architecture Blueprint Grid */}
      <div className="space-y-4">
        {/* Layer 1: User Space */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              User Space (Ring 3)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              User applications & game threads
            </span>
          </div>

          <div 
            onClick={() => setSelectedComp(components.apps)}
            className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-950/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-white font-mono">
                  User Applications: Online Game (High), Browser (Med), Antivirus (Low), Download, Music, Chat
                </h4>
                <p className="text-[11px] text-slate-400">
                  Total CPU Burst: 55 ms · Total RAM Demand: 17 GB
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold shrink-0">
              Inspect Node →
            </span>
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-dark-900 border border-slate-700 text-slate-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Layer 2: Kernel Process Management */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
              Kernel CPU Execution & Scheduling Subsystem (Ring 0)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Context switching & quantum dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'pcb', comp: components.pcb },
              { id: 'readyQueue', comp: components.readyQueue },
              { id: 'scheduler', comp: components.scheduler },
              { id: 'cpu', comp: components.cpu },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded-xl border border-slate-800 bg-dark-900 hover:border-cyan-500/50 hover:bg-dark-850 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-bold font-mono text-white leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-cyan-400 mt-2 block">
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-dark-900 border border-slate-700 text-slate-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Layer 3: Memory & Virtual Paging Subsystem */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
              Virtual Memory & Paging Subsystem
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              MMU, L1/L2/L3 cache, 16 GB RAM & Pagefile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'mmu', comp: components.mmu },
              { id: 'ram', comp: components.ram },
              { id: 'pagefile', comp: components.pagefile },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded-xl border border-slate-800 bg-dark-900 hover:border-purple-500/50 hover:bg-dark-850 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-bold font-mono text-white leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-purple-400 mt-2 block">
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-dark-900 border border-slate-700 text-slate-400">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Layer 4: I/O Hardware & Interrupts */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              I/O Devices, Bus & Hardware Interrupt Controllers
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Storage queues, DMA offloading, and APIC interrupts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'diskQueue', comp: components.diskQueue },
              { id: 'dma', comp: components.dma },
              { id: 'apic', comp: components.apic },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded-xl border border-slate-800 bg-dark-900 hover:border-emerald-500/50 hover:bg-dark-850 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-bold font-mono text-white leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 mt-2 block">
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer for Selected Component */}
      <ComponentDetailDrawer
        component={selectedComp}
        onClose={() => setSelectedComp(null)}
      />
    </div>
  );
};
