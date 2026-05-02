import { motion } from 'motion/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { MODULES, TaskCard } from '../data/cards';

interface CardDetailProps {
  card: TaskCard;
  onBack: () => void;
  onOutcome: (done: boolean) => void;
}

export default function CardDetail({ card, onBack, onOutcome }: CardDetailProps) {
  const mod = MODULES.find((m) => m.id === card.module)!;
  const color = mod.color;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      style={{
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(14px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white/90 text-sm z-10"
      >
        <ArrowLeft size={16} /> 返回地图
      </button>

      <div className="w-full max-w-xl my-10" style={{ perspective: '1600px' }}>
        {/* draw-card intro animation */}
        <motion.div
          initial={{ rotateY: -180, opacity: 0, scale: 0.9 }}
          animate={{ rotateY: 0, opacity: 1, scale: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: `linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)`,
            border: `1px solid ${color}50`,
            boxShadow: `0 0 70px ${color}25, inset 0 1px 0 ${color}40`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          {/* shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '150%' }}
            transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(105deg, transparent 45%, ${color}30 50%, transparent 55%)`,
            }}
          />

          <div className="p-8 md:p-10 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">{mod.icon}</span>
                <span
                  className="text-xs tracking-[0.3em]"
                  style={{ color }}
                >
                  {mod.name.toUpperCase()}
                </span>
              </div>
              <StarRow stars={card.stars} label={card.starsLabel} color={color} />
            </div>

            <div className="text-[10px] tracking-[0.4em] text-white/40 mb-1">
              抽到的任务卡
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-white leading-snug mb-8">
              {card.title}
            </h2>

            <Section label="触发句" color={color}>
              <div className="text-lg text-white/90 leading-relaxed font-light italic">
                「{card.trigger}」
              </div>
            </Section>

            <Section label="怎么做" color={color}>
              <div className="text-sm text-white/75 leading-relaxed">
                {card.howTo}
              </div>
            </Section>

            <Section label="再选择" color={color}>
              <div className="text-sm text-white/75 leading-relaxed">
                {card.reChoice}
              </div>
            </Section>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOutcome(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all hover:brightness-110"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}50`,
                  color,
                }}
              >
                <Check size={16} /> 我做到了 · 点亮
              </button>
              <button
                onClick={() => onOutcome(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all"
              >
                <X size={16} /> 这次没做到
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Section({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div
        className="text-[10px] tracking-[0.3em] mb-2"
        style={{ color }}
      >
        {label.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function StarRow({
  stars,
  label,
  color,
}: {
  stars: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i < stars ? color : `${color}20`,
            }}
          />
        ))}
      </div>
      <div className="text-[10px] text-white/40 mt-1 tracking-wider">
        {label}
      </div>
    </div>
  );
}
