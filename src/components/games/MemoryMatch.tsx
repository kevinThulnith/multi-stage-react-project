import React, { useState, useEffect } from "react";

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const MemoryMatch: React.FC = () => {
  const [moves, setMoves] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const initializeGame = () => {
    const duplicatedEmojis = [...EMOJIS, ...EMOJIS];
    const shuffledEmojis = shuffleArray(duplicatedEmojis);
    const newCards: Card[] = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.emoji === secondCard.emoji) {
        // Match
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedIndices([...flippedIndices, index]);
    if (flippedIndices.length === 0) setMoves((prev) => prev + 1);
  };

  const isGameWon = cards.every((card) => card.isMatched);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Memory Match</h2>
      <p className="text-lg mb-4 text-slate-300">Moves: {moves}</p>
      {isGameWon ? (
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400 mb-4">
            You won in {moves} moves!
          </p>
          <button
            onClick={initializeGame}
            className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="w-20 h-20 sm:w-24 sm:h-24 perspective-1000"
              onClick={() => handleCardClick(index)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  card.isFlipped ? "rotate-y-180" : ""
                }`}
              >
                <div className="absolute w-full h-full backface-hidden bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-600">
                  {/* Card Back */}
                </div>
                <div className="absolute w-full h-full backface-hidden bg-cyan-500 rounded-lg flex items-center justify-center text-4xl rotate-y-180">
                  {card.emoji}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default MemoryMatch;
