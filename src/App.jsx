import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Maximize2, Gamepad2, Trophy, Flame, Zap } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState(null);

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
    <div className="min-h-screen flex flex-col">
      {/* Marquee Header */}
      <div className="bg-black text-white overflow-hidden py-2 brutal-border border-x-0 border-t-0">
        <div className="marquee-track whitespace-nowrap flex gap-8 items-center">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
              <Zap size={14} className="text-yellow-400" />
              Unblocked Arcade v1.0
              <Zap size={14} className="text-yellow-400" />
              Play Anywhere
              <Zap size={14} className="text-yellow-400" />
              No Limits
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white brutal-border border-x-0 border-t-0 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 brutal-border">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            Unblocked<span className="text-blue-600">Arcade</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="SEARCH GAMES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 brutal-border focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 brutal-border text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white translate-y-[-2px] brutal-shadow' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <div className="bg-white brutal-border brutal-shadow-hover transition-all p-4 flex flex-col gap-4 h-full">
                <div className="relative aspect-video overflow-hidden brutal-border bg-gray-200">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">
                    {game.category}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">
                      {game.title}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-500 uppercase">
                      ID: #{game.id.padStart(4, '0')}
                    </p>
                  </div>
                  <div className="bg-blue-600 p-2 brutal-border text-white group-hover:bg-black transition-colors">
                    <Zap size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white brutal-border p-8 brutal-shadow max-w-md">
              <X size={48} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-black uppercase mb-2">No Games Found</h2>
              <p className="text-gray-600 font-mono text-sm">
                WE COULDN'T FIND ANY GAMES MATCHING "{searchQuery.toUpperCase()}". 
                TRY A DIFFERENT SEARCH OR CATEGORY.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white brutal-border border-x-0 border-b-0 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-black uppercase mb-4 italic">Unblocked Arcade</h4>
            <p className="text-sm text-gray-600 font-mono leading-relaxed">
              A MINIMALIST, HIGH-PERFORMANCE HUB FOR WEB-BASED GAMING. 
              NO TRACKING. NO ADS. JUST GAMES.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Stats</h4>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Trophy size={16} className="text-yellow-500" />
              {gamesData.length} GAMES AVAILABLE
            </div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <Flame size={16} className="text-orange-500" />
              DAILY UPDATES
            </div>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] font-mono text-gray-400">
              &copy; {new Date().getFullYear()} UNBLOCKED ARCADE SYSTEM
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`game-${selectedGame.id}`}
              className="bg-white w-full max-w-6xl h-full max-h-[90vh] flex flex-col brutal-border brutal-shadow"
            >
              <div className="p-4 brutal-border border-x-0 border-t-0 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black uppercase italic">{selectedGame.title}</h2>
                  <span className="bg-gray-100 px-3 py-1 brutal-border text-[10px] font-bold uppercase">
                    {selectedGame.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(selectedGame.url, '_blank')}
                    className="p-2 brutal-border hover:bg-gray-100 transition-colors"
                    title="Open in new tab"
                  >
                    <Maximize2 size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 bg-red-500 text-white brutal-border hover:bg-black transition-colors"
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
                />
              </div>
              <div className="p-4 bg-gray-50 brutal-border border-x-0 border-b-0 flex justify-between items-center">
                <p className="text-xs font-mono text-gray-500 uppercase">
                  PLAYING: {selectedGame.title} // SOURCE: {new URL(selectedGame.url).hostname}
                </p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Zap size={12} className="text-blue-600" /> Low Latency
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
