import React from "react";
import type { Game } from "../types";

interface GameGalleryProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const GameGallery: React.FC<GameGalleryProps> = ({ games, onSelectGame }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <button
          key={game.id}
          onClick={() => onSelectGame(game)}
          className="relative bg-[#1e1e24] h-[175px] rounded-xl overflow-hidden group isolate transform transition-all duration-300 hover:scale-105 hover:bg-[#2f2f32] focus:outline-none focus:ring-4 focus:ring-cyan-500 focus:ring-opacity-50"
        >
          {/* ::before substitute */}
          <div className="absolute inset-[1px] bg-[#18181b] rounded-[0.9375rem] z-[2]"></div>

          {/* Left gradient strip (::after substitute) */}
          <div className="absolute top-[0.65rem] bottom-[0.65rem] left-[0.5rem] w-1 rounded-sm bg-gradient-to-b from-[#8d84d8] via-[#4e29d3] to-[#ab28cc] z-[4] transition-transform duration-300 ease-in-out group-hover:translate-x-[0.15rem]"></div>

          {/* Glow effects */}
          <div className="absolute w-[20rem] h-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 bg-[radial-gradient(circle_closest-side_at_center,white,transparent)] z-[3] transition-opacity duration-300 ease-in-out group-hover:opacity-10"></div>
          <div className="absolute w-[20rem] h-[20rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 bg-[radial-gradient(circle_closest-side_at_center,white,transparent)] z-[1] transition-opacity duration-300 ease-in-out group-hover:opacity-10"></div>

          {/* Content */}
          <div className="relative z-[5] flex flex-col items-center justify-center h-full px-4 py-2 space-y-2">
            <div className="text-[#32a6ff] text-xl">{game.icon}</div>
            <h2 className="text-[#32a6ff] text-lg font-medium text-center transition-transform duration-300 group-hover:translate-x-[0.15rem]">
              {game.name}
            </h2>
            <p className="text-[#99999d] text-sm text-center transition-transform duration-300 group-hover:translate-x-[0.25rem] px-2">
              {game.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default GameGallery;
