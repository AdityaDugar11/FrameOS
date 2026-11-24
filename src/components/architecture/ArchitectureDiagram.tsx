import React, { useState } from 'react';
import { 
  Layers, 
  ArrowDown, 
  MousePointer
} from 'lucide-react';
import { ArchitectureComponent, ComponentDetailDrawer } from './ComponentDetailDrawer';

export const ArchitectureDiagram: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<ArchitectureComponent | null>(null);

  const components: Record<string, ArchitectureComponent> = {
    apps: {
      id: 'apps',
      name: 'User applications & threads',
      layer: 'User Space',
      role: 'Software layer generating CPU bursts and memory demands',
      academicDefinition: 'Processes operating in unprivileged User Ring (Ring 3). Communicates with kernel via system calls (syscall / int 0x80).',
      impactOnGaming: 'Online game loop executes physics, render command buffer construction, and network state reconciliation.',
      bottleneckRisk: 'Background processes (browser, AV, download) compete for CPU slices and inflate memory demand to 17 GB.',
      frameOsOptimization: 'Priority segregation: Game tagged as high priority real-time interactive process.',
      color: '#0284c7',
    },
    pcb: {
      id: 'pcb',
      name: 'Process control blocks (PCB)',
      layer: 'Kernel CPU',
      role: 'Stores thread execution context and registers',
      academicDefinition: 'Kernel data structure holding PID, program counter, register state, CPU quantum, open file handles, and memory map.',
      impactOnGaming: 'Every context switch between game and background processes incurs PCB register state save/restore overhead.',
      bottleneckRisk: 'Frequent switching destroys cache locality and increases pipeline stalls.',
      frameOsOptimization: 'Context switch minimization through foreground-weighted round robin (longer 8ms slices for game).',
      color: '#0369a1',
    },
    readyQueue: {
      id: 'readyQueue',
      name: 'Kernel ready queue',
      layer: 'Kernel CPU',
      role: 'Queue of processes waiting for logical CPU execution',
      academicDefinition: 'Kernel runqueue storing pointers to PCBs of processes in READY state, awaiting CPU scheduling dispatch.',
      impactOnGaming: 'Determines the inter-slice latency for the game process.',
      bottleneckRisk: 'When 5 background processes sit in a flat FIFO queue, the game waits 19 ms, violating the 16.67 ms deadline.',
      frameOsOptimization: 'Foreground-weighted round robin with aging ensures game cycles within 12 ms without starving background tasks.',
      color: '#4338ca',
    },
    scheduler: {
      id: 'scheduler',
      name: 'CPU scheduler (dispatcher)',
      layer: 'Kernel CPU',
      role: 'Decides which ready process claims the logical CPU core',
      academicDefinition: 'Short-term preemptive scheduling algorithm running on every timer interrupt or process block.',
      impactOnGaming: 'Controls quantum time slice duration and preemption mechanics.',
      bottleneckRisk: 'Flat 4ms round robin treats 60 FPS real-time rendering identical to background batch downloads.',
      frameOsOptimization: 'Dynamic quantum differentiation (Game = 8ms, Background = 2ms).',
      color: '#7e22ce',
    },
    cpu: {
      id: 'cpu',
      name: 'Logical CPU core (uniprocessor)',
      layer: 'Kernel CPU',
      role: 'Executes instructions (ALU, registers, cache pipelines)',
      academicDefinition: 'Hardware execution unit with program counter, arithmetic logic units, and branch prediction pipelines.',
      impactOnGaming: 'Runs game physics, AI, and geometry draw call submission.',
      bottleneckRisk: 'Sits 68% idle during mechanical HDD page faults while game freezes.',
      frameOsOptimization: 'Eliminates memory paging stalls to keep CPU executing productively.',
      color: '#15803d',
    },
    mmu: {
      id: 'mmu',
      name: 'Memory management unit & cache (L1/L2/L3)',
      layer: 'Memory Subsystem',
      role: 'Translates virtual addresses to physical pages and caches operands',
      academicDefinition: 'Hardware MMU using Translation Lookaside Buffer (TLB) and multilevel page tables with 2ns on-die SRAM caches.',
      impactOnGaming: 'Provides 2ns ultra-low latency operand access for game vertex and matrix math.',
      bottleneckRisk: 'Cache pollution from 6 rotating processes reduces hit ratio from 95% to 85% (latency jumps from 6.9ns to 16.7ns).',
      frameOsOptimization: 'Protected working-set caching and fewer context switches preserve L1/L2 cache lines.',
      color: '#d97706',
    },
    ram: {
      id: 'ram',
      name: 'Physical main memory (16 GB RAM)',
      layer: 'Memory Subsystem',
      role: 'Primary physical RAM storing resident pages',
      academicDefinition: 'Synchronous Dynamic RAM (DDR4/DDR5) accessed via high-speed memory bus at ~100ns latency.',
      impactOnGaming: 'Holds active game engine textures, sound banks, vertex buffers, and world geometry.',
      bottleneckRisk: '17 GB total demand exceeds 16 GB capacity, triggering page eviction to secondary storage.',
      frameOsOptimization: 'Working-set trimming drops background memory to 13.7 GB, keeping game 100% resident.',
      color: '#be185d',
    },
    pagefile: {
      id: 'pagefile',
      name: 'Pagefile / swap storage (HDD vs SSD)',
      layer: 'Memory Subsystem',
      role: 'Secondary backing store for evicted virtual memory pages',
      academicDefinition: 'Reserved disk partition or file used by virtual memory manager when physical RAM is exhausted.',
      impactOnGaming: 'A single page fault on an HDD takes 8 ms (half the entire frame budget).',
      bottleneckRisk: 'Mechanical HDD page fault latency (8,000,000 ns) causes severe frame stutter.',
      frameOsOptimization: 'Migration to NVMe SSD (100 µs) and working-set trimming to eliminate paging entirely.',
      color: '#b91c1c',
    },
    diskQueue: {
      id: 'diskQueue',
      name: 'Disk request queue & storage controller',
      layer: 'I/O & Hardware',
      role: 'Manages block read/write I/O commands to storage',
      academicDefinition: 'I/O elevator queue ordering block requests to secondary storage.',
      impactOnGaming: 'Streams dynamic game world level assets and textures.',
      bottleneckRisk: '120 req/s load on 100 req/s capacity causes disk queue accumulation (+20 req/s deficit).',
      frameOsOptimization: 'I/O prioritization tags game requests with real-time priority, jumping background AV scans.',
      color: '#c2410c',
    },
    dma: {
      id: 'dma',
      name: 'DMA controller (direct memory access)',
      layer: 'I/O & Hardware',
      role: 'Direct bus data transfer between devices and RAM',
      academicDefinition: 'Specialized coprocessor that reads/writes data blocks over the system bus without CPU intervention.',
      impactOnGaming: 'Frees the CPU to calculate game frames while network downloads continue.',
      bottleneckRisk: 'Without DMA (PIO), CPU wastes 31.25% of cycles executing byte-copy instructions for network traffic.',
      frameOsOptimization: 'DMA mode reduces network CPU overhead to 0.38%.',
      color: '#15803d',
    },
    apic: {
      id: 'apic',
      name: 'Hardware interrupt controller (APIC)',
      layer: 'I/O & Hardware',
      role: 'Coordinates hardware device signals to the CPU interrupt pin',
      academicDefinition: 'Advanced Programmable Interrupt Controller arbitrating IRQs and routing interrupt vectors to the IDT.',
      impactOnGaming: 'Processes mouse movements and network packet arrival notifications.',
      bottleneckRisk: 'Unmoderated packet storms (8,500 Hz) cause constant CPU preemption and pipeline flushes.',
      frameOsOptimization: 'Interrupt moderation coalesces network packets into 800 Hz batches.',
      color: '#b45309',
    },
  };

  return (
    <div className="bg-paper-50 rounded-lg p-5 border border-paper-300 shadow-xs space-y-4">
      {/* Title & Help */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-ink-muted" />
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-primary">
              Interactive system architecture map
            </h3>
          </div>
          <p className="text-[11px] text-ink-secondary">
            Click any architectural subsystem node below to inspect its kernel role, bottleneck risk, and FrameOS optimization
          </p>
        </div>

        <span className="text-xs font-mono text-ink-secondary flex items-center gap-1.5 bg-paper-200 px-2.5 py-1 rounded border border-paper-300">
          <MousePointer className="w-3.5 h-3.5 text-ink-muted" />
          Click any component to inspect
        </span>
      </div>

      {/* Structured Architecture Blueprint Grid */}
      <div className="space-y-3">
        {/* Layer 1: User Space */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-copper-700 font-semibold">
              User space (Ring 3)
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              Applications & game threads
            </span>
          </div>

          <div 
            onClick={() => setSelectedComp(components.apps)}
            className="p-3 rounded border border-paper-300 bg-paper-50 hover:border-paper-400 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-copper-600" />
              <div>
                <h4 className="text-xs font-semibold text-ink-primary font-mono">
                  User applications: Game (High), Browser (Med), Antivirus (Low), Download, Music, Chat
                </h4>
                <p className="text-[11px] text-ink-secondary">
                  Total CPU burst: 55 ms · Total RAM demand: 17 GB
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-200 text-ink-primary border border-paper-300 shrink-0 font-medium">
              Inspect node →
            </span>
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-paper-200 border border-paper-300 text-ink-muted shadow-xs">
            <ArrowDown className="w-3 h-3" />
          </div>
        </div>

        {/* Layer 2: Kernel Process Management */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-primary font-semibold">
              Kernel execution & scheduling subsystem (Ring 0)
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              Context switching & quantum dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { id: 'pcb', comp: components.pcb },
              { id: 'readyQueue', comp: components.readyQueue },
              { id: 'scheduler', comp: components.scheduler },
              { id: 'cpu', comp: components.cpu },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded border border-paper-300 bg-paper-50 hover:border-paper-400 transition-colors cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-semibold font-mono text-ink-primary leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-ink-muted mt-2 block font-medium">
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-paper-200 border border-paper-300 text-ink-muted shadow-xs">
            <ArrowDown className="w-3 h-3" />
          </div>
        </div>

        {/* Layer 3: Memory Subsystem */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-primary font-semibold">
              Virtual memory & paging subsystem
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              MMU, L1/L2/L3 cache, 16 GB RAM & pagefile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'mmu', comp: components.mmu },
              { id: 'ram', comp: components.ram },
              { id: 'pagefile', comp: components.pagefile },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded border border-paper-300 bg-paper-50 hover:border-paper-400 transition-colors cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-semibold font-mono text-ink-primary leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-ink-muted mt-2 block font-medium">
                  Inspect →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Downward Transition Arrow */}
        <div className="flex justify-center -my-2 z-10 relative">
          <div className="p-1 rounded-full bg-paper-200 border border-paper-300 text-ink-muted shadow-xs">
            <ArrowDown className="w-3 h-3" />
          </div>
        </div>

        {/* Layer 4: I/O Hardware */}
        <div className="p-3.5 rounded-lg bg-paper-100 border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-primary font-semibold">
              I/O devices, bus & hardware interrupts
            </span>
            <span className="text-[10px] font-mono text-ink-muted">
              Storage queues, DMA offloading, and APIC interrupts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'diskQueue', comp: components.diskQueue },
              { id: 'dma', comp: components.dma },
              { id: 'apic', comp: components.apic },
            ].map(({ id, comp }) => (
              <div
                key={id}
                onClick={() => setSelectedComp(comp)}
                className="p-3 rounded border border-paper-300 bg-paper-50 hover:border-paper-400 transition-colors cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: comp.color }} 
                    />
                    <h5 className="text-xs font-semibold font-mono text-ink-primary leading-tight">
                      {comp.name}
                    </h5>
                  </div>
                  <p className="text-[11px] text-ink-secondary leading-snug">
                    {comp.role}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-ink-muted mt-2 block font-medium">
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
