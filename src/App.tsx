import React, { useEffect } from 'react';
import { useFrameOSStore } from './store/useFrameOSStore';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SettingsModal } from './components/layout/SettingsModal';

// Page 1: Overview
import { MetricCards } from './components/overview/MetricCards';
import { ProcessCards } from './components/overview/ProcessCards';
import { ReadyQueueLive } from './components/overview/ReadyQueueLive';
import { PerformanceCharts } from './components/overview/PerformanceCharts';
import { BottlenecksPanel } from './components/overview/BottlenecksPanel';

// Page 2: CPU Scheduler
import { SchedulerControls } from './components/scheduler/SchedulerControls';
import { GanttChart } from './components/scheduler/GanttChart';
import { FrameDeadlineTracker } from './components/scheduler/FrameDeadlineTracker';
import { MetricsComparison } from './components/scheduler/MetricsComparison';

// Page 3: Memory Manager
import { WorkingSetControl } from './components/memory/WorkingSetControl';
import { PagingVisualizer } from './components/memory/PagingVisualizer';
import { CacheSimulator } from './components/memory/CacheSimulator';
import { MemoryHierarchy } from './components/memory/MemoryHierarchy';

// Page 4: I/O & DMA
import { DiskQueueSimulator } from './components/io/DiskQueueSimulator';
import { DmaVsPioComparison } from './components/io/DmaVsPioComparison';
import { InterruptSourcesPanel } from './components/io/InterruptSourcesPanel';

// Page 5: Process Synchronization
import { PriorityInversionTimeline } from './components/sync/PriorityInversionTimeline';
import { MutexStateVisualizer } from './components/sync/MutexStateVisualizer';

// Page 6: Optimization Center
import { OptimizationMatrix } from './components/optimization/OptimizationMatrix';
import { BeforeAfterComparison } from './components/optimization/BeforeAfterComparison';
import { TradeoffAnalysis } from './components/optimization/TradeoffAnalysis';

// Page 7: System Architecture
import { ArchitectureDiagram } from './components/architecture/ArchitectureDiagram';

export default function App() {
  const { 
    activeTab, 
    isPlaying, 
    stepForward, 
    playbackSpeed 
  } = useFrameOSStore();

  // Simulation playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(50, Math.round(500 / playbackSpeed));
    const timer = setInterval(() => {
      stepForward();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, stepForward]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f7f4ee] text-[#1f1b16] font-sans antialiased">
      {/* Persistent Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Persistent Header */}
        <Header />

        {/* Dynamic Page Router */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#f7f4ee]">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <MetricCards />
              <ReadyQueueLive />
              <ProcessCards />
              <PerformanceCharts />
              <BottlenecksPanel />
            </div>
          )}

          {activeTab === 'scheduler' && (
            <div className="space-y-5">
              <SchedulerControls />
              <GanttChart />
              <FrameDeadlineTracker />
              <MetricsComparison />
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="space-y-5">
              <WorkingSetControl />
              <PagingVisualizer />
              <CacheSimulator />
              <MemoryHierarchy />
            </div>
          )}

          {activeTab === 'io' && (
            <div className="space-y-5">
              <DiskQueueSimulator />
              <DmaVsPioComparison />
              <InterruptSourcesPanel />
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-5">
              <PriorityInversionTimeline />
              <MutexStateVisualizer />
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-5">
              <OptimizationMatrix />
              <BeforeAfterComparison />
              <TradeoffAnalysis />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <ArchitectureDiagram />
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
}
