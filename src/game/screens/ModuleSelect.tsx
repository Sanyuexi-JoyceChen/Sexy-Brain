import { motion } from 'motion/react';
import { MODULES, ModuleId } from '../data/cards';
import { ArrowLeft } from 'lucide-react';
import TopBar from '../components/TopBar';
import { usePlayer } from '../PlayerContext';
import { getModuleProgress } from '../data/playerState';

interface ModuleSelectProps {
  onSelect: (id: ModuleId) => void;
  onBack: () => void;
}

export default function ModuleSelect({ onSelect, onBack }: ModuleSelectProps) {
  const { state } = usePlayer();
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{
        background:
          'radial-gradient(ellipse at center, rgb(var(--bg-elevated-rgb) / 0.9) 0%, rgb(var(--bg-base-rgb) / 0.98) 80%)',
        backdropFilter: 'blur(10px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TopBar regionName="全脑回路" />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-10 min-h-full flex flex-col">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[rgb(var(--text-primary-rgb)/0.5)] hover:text-[rgb(var(--text-primary-rgb)/0.9)] transition-colors text-sm mb-8 w-fit"
        >
          <ArrowLeft size={16} /> 返回
        </button>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-xs tracking-[0.4em] text-[rgb(var(--accent-gold-rgb)/0.7)] mb-2">SELECT A MODULE</div>
          <h2 className="text-3xl font-light text-text-primary mb-2">选择你要训练的能力</h2>
          <p className="text-sm text-[rgb(var(--text-primary-rgb)/0.4)] mb-10">每一个模块都是前额叶的一条核心线路。</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1">
          {MODULES.map((mod, i) => {
            const p = getModuleProgress(state, mod.id);
            return (
              <motion.button
                key={mod.id}
                onClick={() => onSelect(mod.id)}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative text-left p-6 rounded-lg bg-[rgb(var(--text-primary-rgb)/0.03)] border border-[rgb(var(--border-subtle-rgb)/0.1)] hover:border-[rgb(var(--border-subtle-rgb)/0.3)] overflow-hidden transition-colors"
                style={{
                  boxShadow: `inset 0 0 0 1px transparent`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${mod.color}22 0%, transparent 60%)`,
                  }}
                />
                <div className="flex items-start justify-between mb-6 relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: `${mod.color}15`,
                      border: `1px solid ${mod.color}40`,
                    }}
                  >
                    {mod.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] text-[rgb(var(--text-primary-rgb)/0.3)] tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div
                      className="text-[10px] tabular-nums tracking-wider"
                      style={{ color: mod.color }}
                    >
                      {p.completed}/{p.total}
                    </div>
                  </div>
                </div>
                <div className="text-xs tracking-widest mb-1" style={{ color: mod.color }}>
                  {mod.subtitle.toUpperCase()}
                </div>
                <div className="text-xl text-text-primary font-light mb-3">{mod.name}</div>
                <div className="text-xs text-[rgb(var(--text-primary-rgb)/0.4)] leading-relaxed mb-4">
                  {descForModule(mod.id)}
                </div>
                <div className="h-1 rounded-full bg-[rgb(var(--text-primary-rgb)/0.05)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.05 }}
                    style={{
                      background: mod.color,
                      boxShadow: `0 0 8px ${mod.color}70`,
                    }}
                  />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${mod.color}, transparent)`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function descForModule(id: ModuleId): string {
  switch (id) {
    case 'attention':
      return '停下自动继续,取消干扰的最高权限。';
    case 'emotion':
      return '不否认情绪,而是不让它抢麦克风。';
    case 'memory':
      return '前额叶不是仓库,它是加工台。';
    case 'inhibition':
      return '在"欲望"与"动作"之间插入一个审查窗口。';
    case 'boss':
      return '高负载下仍然能保持顺序和再选择。';
  }
}
