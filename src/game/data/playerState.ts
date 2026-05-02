import { CARDS, MODULES, ModuleId, TaskCard } from './cards';

export interface PlayerState {
  xp: number;
  mulberry: number;
  completedCards: Record<string, number>;
  completedNodes: Record<ModuleId, number[]>;
  currentNode: Record<ModuleId, number>;
  unlocks: string[];
}

export interface RewardResult {
  xpGained: number;
  mulberryGained: number;
  firstTime: boolean;
  nodeJustCompleted: boolean;
  nodeUnlocked: boolean;
  newTitle: string | null;
}

const STORAGE_KEY = 'sexybrain_player_v1';

export const MAX_STAR = 5;
export const NODES_PER_MODULE = MAX_STAR + 1;
export const TOTAL_NODES = MODULES.length * NODES_PER_MODULE;

export function createInitialState(): PlayerState {
  const completedNodes = {} as Record<ModuleId, number[]>;
  const currentNode = {} as Record<ModuleId, number>;
  for (const m of MODULES) {
    completedNodes[m.id] = [];
    currentNode[m.id] = 0;
  }
  return {
    xp: 0,
    mulberry: 0,
    completedCards: {},
    completedNodes,
    currentNode,
    unlocks: [],
  };
}

export function loadPlayer(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    const base = createInitialState();
    return { ...base, ...parsed };
  } catch {
    return createInitialState();
  }
}

export function savePlayer(state: PlayerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function cardsForNode(module: ModuleId, star: number): TaskCard[] {
  const base = CARDS.filter((c) => c.module === module && c.stars === star);
  if (base.length > 0) return base;
  return CARDS.filter((c) => c.module === module);
}

export function drawCardForNode(
  module: ModuleId,
  star: number,
  state: PlayerState,
): TaskCard {
  const pool = cardsForNode(module, star);
  const fresh = pool.filter((c) => !state.completedCards[c.id]);
  const target = fresh.length > 0 ? fresh : pool;
  return target[Math.floor(Math.random() * target.length)];
}

export function isNodeUnlocked(
  state: PlayerState,
  module: ModuleId,
  star: number,
): boolean {
  if (star === 0) return true;
  return state.completedNodes[module].includes(star - 1);
}

export function isNodeCompleted(
  state: PlayerState,
  module: ModuleId,
  star: number,
): boolean {
  return state.completedNodes[module].includes(star);
}

export function completeCard(
  prev: PlayerState,
  card: TaskCard,
  done: boolean,
): { next: PlayerState; reward: RewardResult } {
  const next: PlayerState = {
    ...prev,
    completedCards: { ...prev.completedCards },
    completedNodes: { ...prev.completedNodes },
    currentNode: { ...prev.currentNode },
  };

  const firstTime = !next.completedCards[card.id];
  const baseXp = 10 * (card.stars + 1);
  const xpGained = done
    ? baseXp + (firstTime ? 30 : 0)
    : Math.floor(baseXp * 0.3);
  const mulberryGained = Math.floor(xpGained / 10);

  next.completedCards[card.id] = (next.completedCards[card.id] || 0) + 1;
  next.xp = prev.xp + xpGained;
  next.mulberry = prev.mulberry + mulberryGained;

  const prevTitle = getTitle(prev);

  let nodeJustCompleted = false;
  let nodeUnlocked = false;
  if (done) {
    const doneNodes = next.completedNodes[card.module];
    if (!doneNodes.includes(card.stars)) {
      next.completedNodes[card.module] = [...doneNodes, card.stars].sort(
        (a, b) => a - b,
      );
      nodeJustCompleted = true;
      if (card.stars + 1 <= MAX_STAR) {
        next.currentNode[card.module] = Math.max(
          next.currentNode[card.module],
          card.stars + 1,
        );
        nodeUnlocked = true;
      }
    }
  }

  const newTitle = getTitle(next);
  const titleChanged = prevTitle !== newTitle ? newTitle : null;

  return {
    next,
    reward: {
      xpGained,
      mulberryGained,
      firstTime,
      nodeJustCompleted,
      nodeUnlocked,
      newTitle: titleChanged,
    },
  };
}

export function getTotalProgress(state: PlayerState): {
  completed: number;
  total: number;
  pct: number;
} {
  let completed = 0;
  for (const m of MODULES) completed += state.completedNodes[m.id].length;
  const total = TOTAL_NODES;
  return { completed, total, pct: Math.round((completed / total) * 100) };
}

export function getModuleProgress(
  state: PlayerState,
  module: ModuleId,
): { completed: number; total: number; pct: number } {
  const completed = state.completedNodes[module].length;
  const total = NODES_PER_MODULE;
  return { completed, total, pct: Math.round((completed / total) * 100) };
}

export const TITLES: { min: number; name: string }[] = [
  { min: 0, name: '前额叶新手' },
  { min: 10, name: '神经漫游者' },
  { min: 25, name: '脑回路探索者' },
  { min: 45, name: '创新者脑区' },
  { min: 65, name: '前额叶掌控者' },
  { min: 85, name: '21世纪最性感的大脑' },
];

export function getTitle(state: PlayerState): string {
  const { pct } = getTotalProgress(state);
  let title = TITLES[0].name;
  for (const t of TITLES) {
    if (pct >= t.min) title = t.name;
  }
  return title;
}

export function getRegionName(module: ModuleId): string {
  switch (module) {
    case 'attention':
      return '觉察回路';
    case 'emotion':
      return '调节回路';
    case 'memory':
      return '工作台';
    case 'inhibition':
      return '刹车回路';
    case 'boss':
      return '高负载回路';
  }
}

export function simulatedPercentile(pct: number): number {
  if (pct <= 0) return 5;
  if (pct >= 100) return 99;
  return Math.min(99, Math.round(20 + pct * 0.75));
}
