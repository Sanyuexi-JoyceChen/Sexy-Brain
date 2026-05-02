import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-[#0A0A0A] border-b border-white/5 z-10 relative">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo area */}
        <div className="flex items-center space-x-2">
          <div className="text-xl font-bold tracking-wide flex items-center text-[#C5A059]">
            <span className="font-semibold mr-1">Sexy</span><span className="text-white/90">Brain</span>
          </div>
          <div className="text-[10px] text-gray-500 max-w-[200px] leading-tight ml-2 border-l border-white/10 pl-2">
            尊重前额叶，<br />
            成为21世纪最性感的大脑
          </div>
        </div>
      </div>
    </header>
  );
}
