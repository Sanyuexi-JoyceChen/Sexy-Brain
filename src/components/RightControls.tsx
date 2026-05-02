import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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

const capsule =
  'bg-[rgb(var(--bg-elevated-rgb)/0.8)] backdrop-blur-md border border-[rgb(var(--border-subtle-rgb)/0.12)] shadow-sm';
const iconBtn =
  'p-3 text-[rgb(var(--text-primary-rgb)/0.65)] hover:bg-[rgb(var(--text-primary-rgb)/0.08)] hover:text-text-primary transition-colors flex items-center justify-center';

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
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-end space-y-6 z-10">

      {/* Zoom Controls */}
      <div className={`${capsule} rounded-full flex flex-col overflow-hidden`}>
        <button onClick={onZoomIn} className={`${iconBtn} border-b border-[rgb(var(--border-subtle-rgb)/0.12)]`}>
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={onZoomOut} className={iconBtn}>
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Fullscreen */}
      <button onClick={onToggleFullscreen} className={`${capsule} ${iconBtn} rounded-full`}>
        <Maximize className="w-5 h-5" />
      </button>

      {/* Opacity Slider */}
      <div className={`${capsule} flex items-center space-x-3 rounded-full pr-4 pl-2 py-2`}>
        <div className="w-6 h-6 rounded-full border border-[rgb(var(--border-subtle-rgb)/0.3)] bg-[rgb(var(--text-primary-rgb)/0.08)] flex items-center justify-center">
           <div className="w-full h-1/2 bg-[rgb(var(--text-primary-rgb)/0.3)] rounded-b-full"></div>
        </div>
        <input
          type="range"
          className="w-24 accent-accent-gold"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Clip Position Slider */}
      <div className={`${capsule} flex items-center space-x-3 rounded-full pr-4 pl-2 py-2`}>
        <div className="w-6 h-6 rounded-full border border-[rgb(var(--border-subtle-rgb)/0.3)] flex items-center justify-center">
            <div className="w-3 h-3 bg-[rgb(var(--text-primary-rgb)/0.3)] rounded-full border border-[rgb(var(--shadow-strong-rgb)/0.5)]"></div>
        </div>
        <input
          type="range"
          className="w-24 accent-accent-gold"
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
      <div className={`${capsule} flex rounded-full p-1 text-xs font-bold tracking-widest uppercase`}>
        {(['Sagittal', 'Horizontal', 'Coronal'] as const).map((plane) => {
          const label = { Sagittal: '矢状面', Horizontal: '水平面', Coronal: '冠状面' }[plane];
          const isActive = activePlane === plane;
          return (
            <button
              key={plane}
              className={`px-5 py-2 rounded-full transition-colors ${
                isActive
                  ? 'bg-[rgb(var(--text-primary-rgb)/0.1)] text-text-primary shadow-sm'
                  : 'text-[rgb(var(--text-primary-rgb)/0.55)] hover:bg-[rgb(var(--text-primary-rgb)/0.05)] hover:text-text-primary'
              }`}
              onClick={() => onPlaneChange(isActive ? null : plane)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
