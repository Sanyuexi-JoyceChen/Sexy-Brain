import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import StartScreen from './screens/StartScreen';
import ModuleSelect from './screens/ModuleSelect';
import NeuralMap from './screens/NeuralMap';
import CardDetail from './screens/CardDetail';
import Reward from './screens/Reward';
import ShareCard from './components/ShareCard';
import { ModuleId, TaskCard } from './data/cards';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { drawCardForNode, RewardResult } from './data/playerState';

type Screen = 'home' | 'start' | 'module' | 'map' | 'detail' | 'reward';

function Inner() {
  const [screen, setScreen] = useState<Screen>('start');
  const [moduleId, setModuleId] = useState<ModuleId | null>(null);
  const [card, setCard] = useState<TaskCard | null>(null);
  const [lastReward, setLastReward] = useState<RewardResult | null>(null);
  const [lastDone, setLastDone] = useState<boolean>(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { state, completeCardAction } = usePlayer();

  const handlePickNode = (star: number) => {
    if (!moduleId) return;
    const drawn = drawCardForNode(moduleId, star, state);
    setCard(drawn);
    setScreen('detail');
  };

  const handleCardOutcome = (done: boolean) => {
    if (!card) return;
    const reward = completeCardAction(card, done);
    setLastReward(reward);
    setLastDone(done);
    setScreen('reward');
  };

  return (
    <>
      {screen === 'home' && (
        <motion.button
          onClick={() => setScreen('start')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 right-8 z-30 px-6 py-3 text-xs tracking-[0.3em] text-[#C5A059] border border-[#C5A059]/40 bg-black/40 backdrop-blur-sm hover:bg-[#C5A059]/10 hover:border-[#C5A059]/70 transition-all rounded"
        >
          ▶ START TRAINING
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {screen === 'start' && (
          <StartScreen key="start" onStart={() => setScreen('module')} />
        )}
        {screen === 'module' && (
          <ModuleSelect
            key="module"
            onBack={() => setScreen('home')}
            onSelect={(id) => {
              setModuleId(id);
              setScreen('map');
            }}
          />
        )}
        {screen === 'map' && moduleId && (
          <NeuralMap
            key="map"
            moduleId={moduleId}
            onBack={() => setScreen('module')}
            onPickNode={handlePickNode}
            onOpenShare={() => setShareOpen(true)}
          />
        )}
        {screen === 'detail' && card && (
          <CardDetail
            key="detail"
            card={card}
            onBack={() => setScreen('map')}
            onOutcome={handleCardOutcome}
          />
        )}
        {screen === 'reward' && card && lastReward && (
          <Reward
            key="reward"
            card={card}
            done={lastDone}
            reward={lastReward}
            onContinue={() => setScreen('map')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && <ShareCard onClose={() => setShareOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function GameRoot() {
  return (
    <PlayerProvider>
      <Inner />
    </PlayerProvider>
  );
}
