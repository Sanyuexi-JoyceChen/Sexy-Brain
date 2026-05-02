import { ZoomIn, ZoomOut, Maximize, FileDown } from 'lucide-react';
import type { PlaneType } from '../App';

interface RightControlsProps {
  opacity: number;
  onOpacityChange: (val: number) => void;
  activePlane: PlaneType;
  onPlaneChange: (plane: PlaneType) => void;
  clipPosition: number;
  onClipPositionChange: (val: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
}

export default function RightControls({
  opacity,
  onOpacityChange,
  activePlane,
  onPlaneChange,
  clipPosition,
  onClipPositionChange,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen
}: RightControlsProps) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6 z-10 text-gray-400">
      
      {/* Zoom Controls */}
      <div className="bg-[#141414]/80 backdrop-blur-md text-[#AAA] rounded-full shadow-sm flex flex-col overflow-hidden border border-white/10">
        <button onClick={onZoomIn} className="p-3 hover:bg-white/10 hover:text-white transition-colors border-b border-white/10 flex items-center justify-center">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={onZoomOut} className="p-3 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Fullscreen */}
      <button onClick={onToggleFullscreen} className="bg-[#141414]/80 backdrop-blur-md text-[#AAA] rounded-full p-3 shadow-sm hover:bg-white/10 hover:text-white transition-colors border border-white/10 flex items-center justify-center">
        <Maximize className="w-5 h-5" />
      </button>

      {/* Opacity Slider */}
      <div className="flex items-center space-x-3 bg-[#141414]/80 backdrop-blur-md rounded-full pr-4 pl-2 py-2 shadow-sm border border-white/10">
        <div className="w-6 h-6 rounded-full border border-gray-600 bg-gray-800 flex items-center justify-center">
           <div className="w-full h-1/2 bg-gray-500 rounded-b-full"></div>
        </div>
        <input 
          type="range" 
          className="w-24 accent-[#C5A059]" 
          min="0" 
          max="1" 
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Another Slider */}
      <div className="flex items-center space-x-3 bg-[#141414]/80 backdrop-blur-md rounded-full pr-4 pl-2 py-2 shadow-sm border border-white/10">
        <div className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full border border-black"></div>
        </div>
        <input 
          type="range" 
          className="w-24 accent-[#C5A059]" 
          min="0" 
          max="100" 
          step="1"
          value={clipPosition}
          onChange={(e) => onClipPositionChange(parseFloat(e.target.value))}
          disabled={!activePlane}
          style={{ opacity: activePlane ? 1 : 0.5 }}
        />
      </div>

      {/* View Toggle Buttons */}
      <div className="flex bg-[#141414]/80 backdrop-blur-md rounded-full p-1 shadow-sm text-xs font-bold tracking-widest uppercase border border-white/10">
        <button 
          className={`px-5 py-2 rounded-full transition-colors ${activePlane === 'Sagittal' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
          onClick={() => onPlaneChange(activePlane === 'Sagittal' ? null : 'Sagittal')}
        >
          矢状面
        </button>
        <button 
          className={`px-5 py-2 rounded-full transition-colors ${activePlane === 'Horizontal' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
          onClick={() => onPlaneChange(activePlane === 'Horizontal' ? null : 'Horizontal')}
        >
          水平面
        </button>
        <button 
          className={`px-5 py-2 rounded-full transition-colors ${activePlane === 'Coronal' ? 'bg-white/10 text-white shadow-sm' : 'hover:bg-white/5 hover:text-white'}`}
          onClick={() => onPlaneChange(activePlane === 'Coronal' ? null : 'Coronal')}
        >
          冠状面
        </button>
      </div>
    </div>
  );
}
