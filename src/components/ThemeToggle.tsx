import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      className="fixed top-4 right-6 z-[100] p-2.5 rounded-full border-2 border-[rgb(var(--border-subtle-rgb)/0.35)] bg-bg-elevated text-text-primary hover:text-accent-gold hover:border-accent-gold transition-colors shadow-md"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
