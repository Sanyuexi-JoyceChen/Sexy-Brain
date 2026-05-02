import { motion } from 'motion/react';
import { Share2, Sparkles } from 'lucide-react';
import { usePlayer } from '../PlayerContext';
import { getTitle, getTotalProgress } from '../data/playerState';

interface TopBarProps {
  regionName?: string;
  onShare?: () => void;
}

export default function TopBar({ regionName, onShare }: TopBarProps) {
  const { state } = usePlayer();
  const { completed, total, pct } = getTotalProgress(state);
  const title = getTitle(state);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <div
        className="pointer-events-auto px-6 pt-4 pb-4"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 65%, rgba(5,5,5,0) 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          {/* Text block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="text-xs tracking-[0.3em] text-[#C5A059]">
                已激活
              </span>
              <span className="text-xl md:text-2xl font-light text-white tabular-nums">
                {pct}%
              </span>
              <span className="text-xs text-white/70 truncate">
                {regionName || '前额叶'}
              </span>
              <span className="text-white/25">·</span>
              <span className="text-xs text-[#C5A059] tracking-wider truncate">
                {title}
              </span>
            </div>

            {/* Gold fluid bar */}
            <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  background:
                    'linear-gradient(90deg, #8f6b2a 0%, #C5A059 50%, #f0d580 100%)',
                  boxShadow: '0 0 12px #C5A05966',
                }}
              />
              {/* flowing shimmer */}
              <motion.div
                className="absolute inset-y-0 w-24 opacity-60"
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                }}
              />
            </div>

            <div className="flex gap-4 mt-1.5 text-[10px] text-white/40 tracking-wider">
              <span>点亮 {completed}/{total}</span>
              <span className="flex items-center gap-1">
                <Sparkles size={10} className="text-[#C5A059]" /> {state.xp} XP
              </span>
              <span>🍃 {state.mulberry} 桑叶</span>
            </div>
          </div>

          {onShare && (
            <button
              onClick={onShare}
              className="flex-shrink-0 p-2 rounded-full border border-white/10 text-white/60 hover:border-[#C5A059]/50 hover:text-[#C5A059] transition-colors"
              title="分享进度"
            >
              <Share2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
