//src/components/dashboard/Tubesheet/Tubesheet.tsx
/*
Main control component that:
- Acts as central orchestrator for the tube mapping interface
- Manages 4-quadrant layout and state
- Controls tool selection and zoom
- Handles component lazy loading and suspense
*/
import React, { Suspense, lazy, useState } from 'react';
import { useTubeManagement } from './hooks/useTubeManagement';
import Controls from './components/Controls';
import Quadrant from './components/Quadrant';
import StatusBar from './components/StatusBar';

const TubeGrid = lazy(() => 
  import('./components/TubeGrid').then(module => ({ default: module.default }))
);

const Toolbar = lazy(() => 
  import('./components/ToolBar').then(module => ({ default: module.default }))
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-8 h-8 border-2 border-[#FFC857] rounded-full animate-spin border-t-transparent" />
  </div>
);

const Tubesheet: React.FC = () => {
  const {
    tubeMap,
    activeTubeCount,
    selectedTubeCount,
    currentSection,
    handleTubeAction
  } = useTubeManagement();

  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [selectedTool, setSelectedTool] = useState('');

  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-[#181818] overflow-hidden">
      <div className="flex flex-col h-full">
        <Suspense fallback={<div className="h-12 bg-[#242424] animate-pulse" />}>
          <Toolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </Suspense>

        <div className="flex-1 p-4 overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full bg-[#1E1E1E] rounded-lg shadow-xl relative">
            {[1, 2, 3, 4].map((screenNumber) => (
              <Quadrant 
                key={screenNumber} 
                screenNumber={screenNumber} 
                onMaximize={() => {}}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <TubeGrid
                    tubes={tubeMap}
                    onPointClick={(point) => handleTubeAction(point, selectedTool)}
                    selectedTool={selectedTool}
                    scale={scale}
                  />
                </Suspense>
              </Quadrant>
            ))}

            <div className="fixed bottom-8 right-8 z-50">
              <Controls
                scale={scale}
                onZoomIn={() => handleZoom(0.1)}
                onZoomOut={() => handleZoom(-0.1)}
                showGrid={showGrid}
                showCrosshair={showCrosshair}
                onToggleGrid={() => setShowGrid(!showGrid)}
                onToggleCrosshair={() => setShowCrosshair(!showCrosshair)}
              />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#282828] z-40">
            <StatusBar
              activeTubeCount={activeTubeCount}
              selectedTubeCount={selectedTubeCount}
              currentSection={currentSection}
              scale={scale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tubesheet;