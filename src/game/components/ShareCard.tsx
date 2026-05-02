import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { MODULES } from '../data/cards';
import {
  getModuleProgress,
  getTitle,
  getTotalProgress,
  simulatedPercentile,
} from '../data/playerState';
import { usePlayer } from '../PlayerContext';

interface ShareCardProps {
  onClose: () => void;
}

export default function ShareCard({ onClose }: ShareCardProps) {
  const { state } = usePlayer();
  const { completed, total, pct } = getTotalProgress(state);
  const title = getTitle(state);
  const percentile = simulatedPercentile(pct);
  const [copied, setCopied] = useState(false);

  const shareText =
    `我的前额叶已点亮 ${completed}/${total},超越了 ${percentile}% 的大脑 · 称号【${title}】。` +
    `来 SexyBrain 挑战抑制 → 再选择,一起养成 21 世纪最性感的大脑 🧠✨`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select text via prompt
      window.prompt('复制这段文字:', shareText);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 18 }}
        className="relative max-w-md w-full rounded-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #161616 0%, #0a0a0a 100%)',
          border: '1px solid #C5A05950',
          boxShadow: '0 0 60px rgba(197,160,89,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-white/60 hover:text-white bg-white/5"
        >
          <X size={16} />
        </button>

        {/* golden top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background:
              'linear-gradient(90deg, transparent, #C5A059, transparent)',
          }}
        />

        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="text-xs tracking-[0.4em] text-[#C5A059] mb-2">
              MY PREFRONTAL MAP
            </div>
            <div className="text-3xl font-light text-white mb-1">
              {pct}<span className="text-xl text-white/60">%</span>
            </div>
            <div className="text-xs text-white/60">
              已点亮 {completed}/{total} · 超越 {percentile}% 的大脑
            </div>
          </div>

          {/* Radar-like module chart */}
          <RadarChart state={state} />

          {/* Title badge */}
          <div
            className="mt-6 py-3 px-4 rounded-xl text-center"
            style={{
              background: 'rgba(197,160,89,0.08)',
              border: '1px solid rgba(197,160,89,0.35)',
            }}
          >
            <div className="text-[10px] tracking-widest text-white/50 mb-1">
              当前称号
            </div>
            <div className="text-base text-[#C5A059]">{title}</div>
          </div>

          {/* Per-module bars */}
          <div className="mt-6 space-y-3">
            {MODULES.map((m) => {
              const p = getModuleProgress(state, m.id);
              return (
                <div key={m.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5" style={{ color: m.color }}>
                      <span>{m.icon}</span> {m.name}
                    </span>
                    <span className="text-white/50 tabular-nums">
                      {p.completed}/{p.total}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      style={{ background: m.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share text */}
          <div className="mt-6">
            <div className="text-[10px] tracking-widest text-white/50 mb-2">
              分享文案
            </div>
            <div
              className="p-3 rounded-lg text-xs text-white/75 leading-relaxed"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {shareText}
            </div>

            <button
              onClick={handleCopy}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: copied ? '#C5A05922' : 'rgba(197,160,89,0.12)',
                border: '1px solid rgba(197,160,89,0.5)',
                color: '#C5A059',
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> 已复制到剪贴板
                </>
              ) : (
                <>
                  <Copy size={14} /> 复制分享文字
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RadarChart({ state }: { state: ReturnType<typeof usePlayer>['state'] }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 24;
  const n = MODULES.length;

  const axisPoints = MODULES.map((_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
  });

  const dataPoints = MODULES.map((m, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const p = getModuleProgress(state, m.id).pct / 100;
    const r = R * p;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });

  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') +
    ' Z';

  return (
    <div className="flex justify-center">
      <svg width={size} height={size}>
        {/* rings */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <polygon
            key={i}
            points={MODULES.map((_, k) => {
              const a = (Math.PI * 2 * k) / n - Math.PI / 2;
              return `${cx + Math.cos(a) * R * r},${cy + Math.sin(a) * R * r}`;
            }).join(' ')}
            fill="none"
            stroke="#ffffff10"
            strokeWidth="0.5"
          />
        ))}
        {/* axes */}
        {axisPoints.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#ffffff10"
            strokeWidth="0.5"
          />
        ))}
        {/* fill */}
        <motion.path
          d={dataPath}
          fill="#C5A05933"
          stroke="#C5A059"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        {/* labels */}
        {MODULES.map((m, i) => {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          const lx = cx + Math.cos(a) * (R + 14);
          const ly = cy + Math.sin(a) * (R + 14);
          return (
            <text
              key={m.id}
              x={lx}
              y={ly}
              fontSize="9"
              fill={m.color}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ letterSpacing: 1 }}
            >
              {m.icon}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
