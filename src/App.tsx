import { PiGameControllerFill } from "react-icons/pi";
import GameGallery from "./components/GameGallery";
import { FaAnglesLeft } from "react-icons/fa6";
import type { Game } from "./types";
import { GAMES } from "./constants";
import { useState } from "react";

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackToGallery = () => {
    setSelectedGame(null);
  };

  const GameComponent = selectedGame?.component;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 bg-slate-950 Container z-0 w-full">
      <header className="w-full max-w-6xl mb-8 text-center z-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-orange-500 flex justify-center gap-4">
          Game Cave
          <PiGameControllerFill />
        </h1>
        <p className="text-slate-300 mt-4 text-lg font-semibold">
          12 game projects from beginner to advanced.
        </p>
      </header>
      <main className="w-full max-w-6xl flex-grow z-20 flex">
        {selectedGame && GameComponent ? (
          <div className="bg-slate-800 rounded-xl shadow-2xl p-4 sm:p-8 w-full">
            <button
              onClick={handleBackToGallery}
              className="mb-6 bg-[#4a0ed6] hover:bg-[#434669] text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
            >
              <FaAnglesLeft className="mr-2" />
              Back to Games
            </button>
            <GameComponent />
          </div>
        ) : (
          <GameGallery games={GAMES} onSelectGame={handleSelectGame} />
        )}
      </main>
      <footer className="w-full max-w-6xl mt-8 text-center text-slate-400 z-20">
        <p>
          Built with Vite, React, TypeScript, and Tailwind CSS by Kevin Thulnith
          © 2025.
        </p>
      </footer>
    </div>
  );
};

export default App;
