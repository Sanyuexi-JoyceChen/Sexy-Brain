import { motion } from 'motion/react';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Top vignette — protects title/tagline zone from brain bleed */}
      <div
        className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--bg-base-rgb) / 0.96) 0%, rgb(var(--bg-base-rgb) / 0.65) 55%, rgb(var(--bg-base-rgb) / 0) 100%)',
        }}
      />

      {/* Bottom vignette — protects button zone */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[26vh] pointer-events-none"
        style={{
          background:
            'linear-gradient(0deg, rgb(var(--bg-base-rgb) / 0.96) 0%, rgb(var(--bg-base-rgb) / 0.6) 55%, rgb(var(--bg-base-rgb) / 0) 100%)',
        }}
      />

      {/* NAME + TAGLINE — locked inside top band (ends ≤ 26vh) */}
      <motion.div
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="absolute top-[6vh] left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 flex flex-col items-center text-center"
      >
        <h1 className="text-6xl md:text-7xl font-light tracking-[0.08em] text-text-primary leading-none mb-5 drop-shadow-[0_2px_20px_rgb(var(--shadow-strong-rgb)/0.9)]">
          <span className="text-accent-gold italic">Sexy</span>
          <span className="font-extralight">Brain</span>
        </h1>

        <p className="text-sm md:text-base text-[rgb(var(--text-primary-rgb)/0.8)] leading-[2] tracking-[0.1em] drop-shadow-[0_1px_10px_rgb(var(--shadow-strong-rgb)/0.9)]">
          AI 在烧 token,人类在烧前额叶。
          <br />
          尊重前额叶,养成 21 世纪最性感的大脑。
        </p>
      </motion.div>

      {/* START — locked inside bottom band (starts ≥ 78vh) */}
      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 pointer-events-auto"
      >
        <motion.button
          onClick={onStart}
          className="group relative px-20 py-5 border-2 border-accent-gold text-accent-gold tracking-[0.5em] text-base font-medium overflow-hidden rounded-sm"
          style={{ background: 'rgb(var(--bg-base-rgb) / 0.55)', backdropFilter: 'blur(4px)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="absolute inset-0 bg-[rgb(var(--accent-gold-rgb)/0.25)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <span className="relative">START</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
