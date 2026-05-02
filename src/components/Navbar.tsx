export default function Navbar() {
  return (
    <header className="bg-bg-elevated border-b border-[rgb(var(--border-subtle-rgb)/0.15)] z-10 relative shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold tracking-wide flex items-center text-accent-gold">
            <span className="font-semibold mr-1">Sexy</span>
            <span className="text-text-primary">Brain</span>
          </div>
          <div className="text-[10px] text-[rgb(var(--text-primary-rgb)/0.65)] max-w-[200px] leading-tight ml-2 border-l border-[rgb(var(--border-subtle-rgb)/0.25)] pl-2">
            尊重前额叶，<br />
            成为21世纪最性感的大脑
          </div>
        </div>
      </div>
    </header>
  );
}
