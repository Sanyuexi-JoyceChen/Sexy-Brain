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
            'linear-gradient(180deg, rgb(var(--bg-base-rgb) / 0.92) 0%, rgb(var(--bg-base-rgb) / 0.75) 65%, rgb(var(--bg-base-rgb) / 0) 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-1.5">
              <span className="text-xs tracking-[0.3em] text-accent-gold">
                已激活
              </span>
              <span className="text-xl md:text-2xl font-light text-text-primary tabular-nums">
                {pct}%
              </span>
              <span className="text-xs text-[rgb(var(--text-primary-rgb)/0.7)] truncate">
                {regionName || '前额叶'}
              </span>
              <span className="text-[rgb(var(--text-primary-rgb)/0.25)]">·</span>
              <span className="text-xs text-accent-gold tracking-wider truncate">
                {title}
              </span>
            </div>

            {/* Gold fluid bar */}
            <div className="relative h-1.5 rounded-full bg-[rgb(var(--text-primary-rgb)/0.05)] overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  background:
                    'linear-gradient(90deg, #8f6b2a 0%, #C5A059 50%, #f0d580 100%)',
                  boxShadow: '0 0 12px rgb(var(--accent-gold-rgb) / 0.4)',
                }}
              />
              <motion.div
                className="absolute inset-y-0 w-24 opacity-60"
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgb(var(--text-primary-rgb) / 0.45) 50%, transparent 100%)',
                }}
              />
            </div>

            <div className="flex gap-4 mt-1.5 text-[10px] text-[rgb(var(--text-primary-rgb)/0.4)] tracking-wider">
              <span>点亮 {completed}/{total}</span>
              <span className="flex items-center gap-1">
                <Sparkles size={10} className="text-accent-gold" /> {state.xp} XP
              </span>
              <span>🍃 {state.mulberry} 桑叶</span>
            </div>
          </div>

          {onShare && (
            <button
              onClick={onShare}
              className="flex-shrink-0 p-2 rounded-full border border-[rgb(var(--border-subtle-rgb)/0.1)] text-[rgb(var(--text-primary-rgb)/0.6)] hover:border-[rgb(var(--accent-gold-rgb)/0.5)] hover:text-accent-gold transition-colors"
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
