import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, X, Lock } from 'lucide-react';
import { MODULES, TaskCard } from '../data/cards';
import { RewardResult } from '../data/playerState';
import { usePlayer } from '../PlayerContext';

interface RewardProps {
  card: TaskCard;
  done: boolean;
  reward: RewardResult;
  onContinue: () => void;
}

function useAnimatedNumber(target: number, duration = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

export default function Reward({ card, done, reward, onContinue }: RewardProps) {
  const { state } = usePlayer();
  const mod = MODULES.find((m) => m.id === card.module)!;
  const color = mod.color;

  const xpNow = useAnimatedNumber(state.xp);
  const mulNow = useAnimatedNumber(state.mulberry);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(14px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* sparkling particles */}
      {done &&
        Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
            initial={{
              x: '50vw',
              y: '50vh',
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: `${50 + (Math.cos((i * Math.PI * 2) / 16) * 35)}vw`,
              y: `${50 + (Math.sin((i * Math.PI * 2) / 16) * 35)}vh`,
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: 1.8,
              delay: 0.3 + i * 0.04,
              ease: 'easeOut',
            }}
          />
        ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 16 }}
        className="relative max-w-md w-full rounded-2xl overflow-hidden text-center"
        style={{
          background: done
            ? `linear-gradient(180deg, ${color}22 0%, rgba(10,10,10,0.98) 70%)`
            : `linear-gradient(180deg, rgba(60,60,60,0.3) 0%, rgba(10,10,10,0.98) 70%)`,
          border: `1px solid ${done ? color + '60' : '#ffffff20'}`,
          boxShadow: done
            ? `0 0 80px ${color}40, inset 0 1px 0 ${color}40`
            : '0 0 40px rgba(255,255,255,0.08)',
        }}
      >
        {/* top light bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${done ? color : '#ffffff60'}, transparent)`,
          }}
        />

        <div className="p-8 md:p-10">
          {/* icon halo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            style={{
              background: done ? `${color}30` : 'rgba(255,255,255,0.08)',
              border: `2px solid ${done ? color : '#ffffff40'}`,
            }}
          >
            {done ? <Check size={36} color={color} /> : <X size={36} color="#ffffff80" />}
            {done && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ border: `2px solid ${color}` }}
              />
            )}
          </motion.div>

          <div
            className="text-[10px] tracking-[0.4em] mb-2"
            style={{ color: done ? color : '#ffffff70' }}
          >
            {done ? (reward.firstTime ? '首次完成' : '再次完成') : '未达成'}
          </div>
          <h2 className="text-xl md:text-2xl font-light text-white mb-1 leading-snug">
            {card.title}
          </h2>
          <div className="text-xs text-white/40 mb-6">
            {mod.icon} {mod.name} · {card.starsLabel}
          </div>

          {/* XP GAIN */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-6 py-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center justify-center gap-6">
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-white/50 mb-1">
                  <Sparkles size={10} style={{ color }} /> 经验
                </div>
                <div
                  className="text-2xl font-light"
                  style={{ color: done ? color : '#ffffff60' }}
                >
                  +{reward.xpGained}
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-[10px] tracking-widest text-white/50 mb-1">
                  🍃 桑叶
                </div>
                <div
                  className="text-2xl font-light"
                  style={{ color: done ? color : '#ffffff60' }}
                >
                  +{reward.mulberryGained}
                </div>
              </div>
            </div>
          </motion.div>

          {/* NOTIFICATION for node unlock / title change */}
          {reward.nodeJustCompleted && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-4 py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2"
              style={{
                background: `${color}18`,
                border: `1px solid ${color}60`,
                color,
              }}
            >
              <Sparkles size={14} /> 点亮坐标 {card.stars}星
              {reward.nodeUnlocked && (
                <>
                  <Lock size={14} style={{ transform: 'rotate(-20deg)' }} />
                  解锁 {card.stars + 1}星
                </>
              )}
            </motion.div>
          )}

          {reward.newTitle && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-4 py-2 px-3 rounded-lg text-xs text-center"
              style={{
                background: 'rgba(197,160,89,0.1)',
                border: '1px solid rgba(197,160,89,0.5)',
                color: '#C5A059',
              }}
            >
              🎖 获得新称号:{reward.newTitle}
            </motion.div>
          )}

          {/* Current totals */}
          <div className="flex justify-center gap-6 mb-6 text-xs text-white/50">
            <span>总 XP <span className="text-white font-medium tabular-nums">{xpNow}</span></span>
            <span>总桑叶 <span className="text-white font-medium tabular-nums">{mulNow}</span></span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/70 leading-relaxed mb-6"
          >
            {done ? card.successNote : card.failureNote}
          </motion.p>

          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onContinue}
            className="px-8 py-3 text-sm tracking-widest text-white/85 border border-white/20 hover:border-white/50 hover:text-white rounded-lg transition-all"
          >
            继续
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
