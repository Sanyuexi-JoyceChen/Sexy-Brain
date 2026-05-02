import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
  completeCard,
  createInitialState,
  loadPlayer,
  PlayerState,
  RewardResult,
  savePlayer,
} from './data/playerState';
import { TaskCard } from './data/cards';

interface PlayerContextValue {
  state: PlayerState;
  completeCardAction: (card: TaskCard, done: boolean) => RewardResult;
  resetProgress: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(() => {
    if (typeof window === 'undefined') return createInitialState();
    return loadPlayer();
  });

  useEffect(() => {
    savePlayer(state);
  }, [state]);

  const completeCardAction = useCallback(
    (card: TaskCard, done: boolean): RewardResult => {
      let reward: RewardResult = {
        xpGained: 0,
        mulberryGained: 0,
        firstTime: false,
        nodeJustCompleted: false,
        nodeUnlocked: false,
        newTitle: null,
      };
      setState((prev) => {
        const res = completeCard(prev, card, done);
        reward = res.reward;
        return res.next;
      });
      return reward;
    },
    [],
  );

  const resetProgress = useCallback(() => {
    setState(createInitialState());
  }, []);

  return (
    <PlayerContext.Provider value={{ state, completeCardAction, resetProgress }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
