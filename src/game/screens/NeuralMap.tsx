import { motion } from 'motion/react';
import { ArrowLeft, Lock } from 'lucide-react';
import { MODULES, ModuleId } from '../data/cards';
import {
  getModuleProgress,
  getRegionName,
  isNodeCompleted,
  isNodeUnlocked,
} from '../data/playerState';
import { usePlayer } from '../PlayerContext';
import TopBar from '../components/TopBar';

interface NeuralMapProps {
  moduleId: ModuleId;
  onBack: () => void;
  onPickNode: (star: number) => void;
  onOpenShare: () => void;
}

const VIEW_W = 1000;
const VIEW_H = 560;

const NODE_POSITIONS: { x: number; y: number }[] = [
  { x: 120, y: 460 },
  { x: 260, y: 200 },
  { x: 430, y: 380 },
  { x: 580, y: 130 },
  { x: 760, y: 330 },
  { x: 900, y: 470 },
];

function curveBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): string {
  const dx = b.x - a.x;
  const cx1 = a.x + dx * 0.4;
  const cy1 = a.y;
  const cx2 = a.x + dx * 0.6;
  const cy2 = b.y;
  return `M${a.x},${a.y} C${cx1},${cy1} ${cx2},${cy2} ${b.x},${b.y}`;
}

export default function NeuralMap({
  moduleId,
  onBack,
  onPickNode,
  onOpenShare,
}: NeuralMapProps) {
  const { state } = usePlayer();
  const mod = MODULES.find((m) => m.id === moduleId)!;
  const color = mod.color;
  const prog = getModuleProgress(state, moduleId);

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(10,10,10,0.96) 0%, rgba(5,5,5,0.99) 80%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TopBar regionName={`${getRegionName(moduleId)} · ${mod.name}`} onShare={onOpenShare} />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/90 text-sm mb-6"
        >
          <ArrowLeft size={16} /> 返回模块
        </button>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <div
              className="text-xs tracking-[0.4em] mb-1"
              style={{ color: color }}
            >
              {mod.subtitle.toUpperCase()}
            </div>
            <h2 className="text-3xl font-light text-white flex items-center gap-3">
              <span className="text-2xl">{mod.icon}</span>
              {mod.name}
            </h2>
            <p className="text-xs text-white/40 mt-1">
              从起点到终点,每一步都是控制力的升级 · 点亮 {prog.completed}/{prog.total}
            </p>
          </div>
        </motion.div>

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(10,10,10,0.8) 100%)',
            border: `1px solid ${color}25`,
            boxShadow: `inset 0 0 80px ${color}10`,
          }}
        >
          <SvgPattern color={color} />

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full block relative"
            style={{ height: 'min(60vh, 560px)' }}
          >
            <defs>
              <linearGradient id={`grad-${moduleId}`} x1="0" x2="1">
                <stop offset="0%" stopColor={`${color}30`} />
                <stop offset="100%" stopColor={`${color}05`} />
              </linearGradient>
              <radialGradient id={`glow-${moduleId}`}>
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="70%" stopColor={color} stopOpacity="0.1" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </radialGradient>
              <filter id={`blur-${moduleId}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* path segments */}
            {NODE_POSITIONS.slice(0, -1).map((n, i) => {
              const next = NODE_POSITIONS[i + 1];
              const d = curveBetween(n, next);
              const completed = isNodeCompleted(state, moduleId, i) && isNodeCompleted(state, moduleId, i + 1);
              const reached = isNodeCompleted(state, moduleId, i);
              return (
                <g key={`p-${i}`}>
                  {/* dim base */}
                  <path d={d} stroke="#ffffff10" strokeWidth="2" fill="none" />
                  {/* glow if completed */}
                  {completed && (
                    <path
                      d={d}
                      stroke={color}
                      strokeWidth="8"
                      fill="none"
                      opacity="0.35"
                      filter={`url(#blur-${moduleId})`}
                    />
                  )}
                  {/* animated flowing line */}
                  {reached && (
                    <motion.path
                      d={d}
                      stroke={color}
                      strokeWidth={completed ? 3 : 2}
                      fill="none"
                      strokeDasharray={completed ? undefined : '5 8'}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.15 }}
                      opacity={completed ? 0.9 : 0.5}
                    />
                  )}
                </g>
              );
            })}

            {/* nodes */}
            {NODE_POSITIONS.map((pos, i) => {
              const star = i;
              const unlocked = isNodeUnlocked(state, moduleId, star);
              const completed = isNodeCompleted(state, moduleId, star);
              const current = unlocked && !completed;
              return (
                <g key={`n-${i}`}>
                  {/* glow halo */}
                  {(current || completed) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={completed ? 60 : 50}
                      fill={`url(#glow-${moduleId})`}
                    >
                      {current && (
                        <animate
                          attributeName="r"
                          values="44;58;44"
                          dur="2.2s"
                          repeatCount="indefinite"
                        />
                      )}
                    </circle>
                  )}

                  {/* clickable node */}
                  <NodeCircle
                    pos={pos}
                    color={color}
                    star={star}
                    unlocked={unlocked}
                    completed={completed}
                    onClick={() => unlocked && onPickNode(star)}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/60 justify-center">
          <LegendDot color="#ffffff20" label="未解锁" />
          <LegendDot color={color} label="可挑战" pulse />
          <LegendDot
            color={color}
            label="已点亮"
            filled
          />
        </div>

        <p className="mt-6 text-center text-xs text-white/40 max-w-md mx-auto leading-relaxed">
          相同等级下,每次点击节点会从该等级的卡片池中随机抽取一张 ·
          完成后点亮坐标,解锁下一等级
        </p>
      </div>
    </motion.div>
  );
}

function NodeCircle({
  pos,
  color,
  star,
  unlocked,
  completed,
  onClick,
}: {
  pos: { x: number; y: number };
  color: string;
  star: number;
  unlocked: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  const r = 32;
  return (
    <g
      onClick={unlocked ? onClick : undefined}
      style={{ cursor: unlocked ? 'pointer' : 'not-allowed' }}
    >
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r + 4}
        fill="none"
        stroke={unlocked ? color : '#ffffff15'}
        strokeWidth="1"
        opacity="0.4"
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r}
        fill={completed ? color : unlocked ? `${color}25` : '#0a0a0a'}
        stroke={unlocked ? color : '#ffffff25'}
        strokeWidth="2"
      />
      <foreignObject x={pos.x - r} y={pos.y - r} width={r * 2} height={r * 2}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            pointerEvents: 'none',
            color: completed ? '#050505' : unlocked ? color : '#ffffff40',
            fontFamily: 'inherit',
          }}
        >
          {unlocked ? (
            <>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: star + 1 }).map((_, k) => (
                  <span key={k} style={{ fontSize: 10 }}>
                    ★
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 9, marginTop: 2, opacity: 0.85 }}>
                {star}星
              </div>
            </>
          ) : (
            <Lock size={16} />
          )}
        </div>
      </foreignObject>
    </g>
  );
}

function LegendDot({
  color,
  label,
  pulse,
  filled,
}: {
  color: string;
  label: string;
  pulse?: boolean;
  filled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-3 h-3 rounded-full"
        style={{
          background: filled ? color : `${color}30`,
          border: `1px solid ${color}`,
          boxShadow: filled ? `0 0 8px ${color}90` : 'none',
        }}
        animate={pulse ? { scale: [1, 1.25, 1] } : {}}
        transition={pulse ? { duration: 1.6, repeat: Infinity } : {}}
      />
      <span>{label}</span>
    </div>
  );
}

function SvgPattern({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      preserveAspectRatio="none"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
    >
      <defs>
        <pattern
          id="grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={`${color}15`}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width={VIEW_W} height={VIEW_H} fill="url(#grid)" />
      {/* dendrite-like decorations */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 73) % VIEW_W;
        const y = (i * 47) % VIEW_H;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1 + (i % 3)}
            fill={`${color}40`}
          />
        );
      })}
    </svg>
  );
}
