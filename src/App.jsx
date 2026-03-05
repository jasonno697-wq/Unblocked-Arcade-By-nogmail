import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Maximize2, Gamepad2, Trophy, Flame, Zap } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);

  // Anti-Inspect Logic
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#00ff00] cyber-grid">
      {/* Marquee Header */}
      <div className="bg-black text-[#00ff00] overflow-hidden py-2 cyber-border border-x-0 border-t-0">
        <div className="marquee-track whitespace-nowrap flex gap-8 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest neon-text">
              <Zap size={14} className="text-[#00ff00]" />
              SYSTEM STATUS: OPTIMAL // ARCADE v2.0
              <Zap size={14} className="text-[#00ff00]" />
              NEON PROTOCOL ACTIVE
              <Zap size={14} className="text-[#00ff00]" />
              BYPASSING RESTRICTIONS...
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-md cyber-border border-x-0 border-t-0 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#00ff00] p-2 cyber-border">
            <Gamepad2 className="text-black" size={24} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic neon-text">
            CYBER<span className="text-[#ff00ff] neon-magenta">ARCADE</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff00]/50" size={18} />
            <input
              type="text"
              placeholder="SCAN FOR GAMES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black cyber-border text-[#00ff00] focus:outline-none focus:ring-1 focus:ring-[#ff00ff] font-mono text-sm placeholder-[#00ff00]/30"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 cyber-border text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-[#00ff00] text-black cyber-shadow' 
                    : 'bg-black text-[#00ff00] hover:bg-[#00ff00]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl">
          {filteredGames.map((game, idx) => (
            <motion.div
              layoutId={`game-${game.id}`}
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedGame(game)}
              className="group cursor-pointer"
            >
              <div className="bg-black cyber-border cyber-shadow-hover transition-all p-4 flex flex-col gap-4 h-full items-center text-center">
                <div className="relative aspect-video overflow-hidden cyber-border bg-[#111] w-full">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#ff00ff] text-white px-2 py-1 text-[10px] font-bold uppercase neon-magenta">
                    {game.category}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-none neon-text">
                    {game.title}
                  </h3>
                  <p className="text-[10px] font-mono text-[#00ff00]/50 uppercase">
                    NODE: {game.id.toUpperCase()}
                  </p>
                  <div className="bg-[#00ff00] p-2 cyber-border text-black group-hover:bg-[#ff00ff] group-hover:text-white transition-colors mt-2">
                    <Zap size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-black cyber-border p-8 cyber-shadow max-w-md">
              <Gamepad2 size={48} className="mx-auto mb-4 text-[#ff00ff]" />
              <h2 className="text-2xl font-black uppercase mb-2 neon-magenta">No Data Found</h2>
              <p className="text-[#00ff00]/70 font-mono text-sm uppercase">
                THE GRID IS EMPTY. SCANNING FOR NEW NODES...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black cyber-border border-x-0 border-b-0 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-black uppercase mb-4 italic neon-text">Cyber Arcade</h4>
            <p className="text-sm text-[#00ff00]/60 font-mono leading-relaxed">
              A HIGH-SPEED GATEWAY TO THE DIGITAL FRONTIER. 
              ENCRYPTED. ANONYMOUS. UNSTOPPABLE.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h4 className="text-xs font-bold uppercase text-[#00ff00]/30 mb-2">Network Stats</h4>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Trophy size={16} className="text-[#ff00ff]" />
              {gamesData.length} NODES CONNECTED
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Flame size={16} className="text-[#00ff00]" />
              REAL-TIME UPLINK
            </div>
          </div>
          <div className="text-center md:text-right flex flex-col justify-end">
            <p className="text-[10px] font-mono text-[#00ff00]/30">
              &copy; {new Date().getFullYear()} CYBER ARCADE OS // v2.0.4
            </p>
          </div>
        </div>
      </footer>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              layoutId={`game-${selectedGame.id}`}
              className="bg-black w-full h-full flex flex-col"
            >
              <div className="p-4 cyber-border border-x-0 border-t-0 flex justify-between items-center bg-black">
                <div className="flex items-center gap-4 flex-grow justify-center">
                  <h2 className="text-2xl font-black uppercase italic neon-text text-center">{selectedGame.title}</h2>
                  <span className="bg-[#111] px-3 py-1 cyber-border text-[10px] font-bold uppercase text-[#ff00ff]">
                    {selectedGame.category}
                  </span>
                </div>
                <div className="flex gap-2 absolute right-4">
                  <button 
                    onClick={() => window.open(selectedGame.url, '_blank')}
                    className="p-2 cyber-border hover:bg-[#00ff00]/10 text-[#00ff00] transition-colors"
                    title="Open in new tab"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 bg-[#ff00ff] text-white cyber-border hover:bg-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-grow bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="fullscreen; autoplay; encrypted-media"
                  sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads allow-storage-access-by-user-activation"
                />
              </div>
              <div className="p-4 bg-black cyber-border border-x-0 border-b-0 flex justify-between items-center">
                <p className="text-xs font-mono text-[#00ff00]/50 uppercase flex-grow text-center">
                  UPLINK: {selectedGame.title} // STATUS: SECURE
                </p>
                <div className="flex gap-4 absolute right-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-[#00ff00]">
                    <Zap size={12} className="text-[#00ff00]" /> ENCRYPTED
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
