import { Search, ZoomIn, ZoomOut, Maximize, FileDown } from 'lucide-react';
import { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import RightControls from './components/RightControls';
import BrainCanvas from './components/BrainCanvas';

export type PlaneType = 'Sagittal' | 'Horizontal' | 'Coronal' | null;

export default function App() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(0.8);
  const [activePlane, setActivePlane] = useState<PlaneType>(null);
  const [clipPosition, setClipPosition] = useState<number>(50);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  const appRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      appRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={appRef} className="flex flex-col h-screen bg-[#050505] font-sans text-[#E0E0E0] overflow-hidden">
      <Navbar />
      
      <main className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 relative bg-[radial-gradient(circle_at_50%_50%,#151515_0%,#050505_100%)] flex items-center justify-center">
          <BrainCanvas 
            onRegionClick={setActiveRegion} 
            activeRegion={activeRegion}
            opacity={opacity}
            activePlane={activePlane}
            clipPosition={clipPosition}
            zoom={zoomLevel}
          />
          <RightControls 
            opacity={opacity}
            onOpacityChange={setOpacity}
            activePlane={activePlane}
            onPlaneChange={setActivePlane}
            clipPosition={clipPosition}
            onClipPositionChange={setClipPosition}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </main>
    </div>
  );
}
