import React, { useState, useEffect } from "react";
import { randomWord } from "../words";

// Generate 6 random words at module load
const WORDS = Array.from({ length: 6 }, () => randomWord());
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX_WRONG_GUESSES = 6;

const Hangman: React.FC = () => {
  const [word, setWord] = useState("");
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  const startNewGame = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus("playing");
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (!word) return;

    const isWon = word
      .split("")
      .every((letter) => guessedLetters.includes(letter));
    if (isWon) setGameStatus("won");
    else if (wrongGuesses >= MAX_WRONG_GUESSES) setGameStatus("lost");
  }, [guessedLetters, wrongGuesses, word]);

  const handleGuess = (letter: string) => {
    if (gameStatus !== "playing" || guessedLetters.includes(letter)) return;

    setGuessedLetters([...guessedLetters, letter]);
    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const hiddenWord = word
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">Hangman</h2>
      <p className="text-slate-400 mb-4">
        Wrong guesses remaining: {MAX_WRONG_GUESSES - wrongGuesses}
      </p>

      <div className="mb-6">
        {/* Basic hangman drawing */}
        <pre className="text-slate-400 font-mono text-lg">
          {`
  +---+
  |   |
  ${wrongGuesses > 0 ? "O" : " "}   |
 ${wrongGuesses > 2 ? "/" : " "}${wrongGuesses > 1 ? "|" : " "}${
            wrongGuesses > 3 ? "\\" : " "
          }  |
 ${wrongGuesses > 4 ? "/" : " "} ${wrongGuesses > 5 ? "\\" : " "}  |
      |
=========`}
        </pre>
      </div>

      <p className="text-4xl tracking-widest font-mono mb-6 text-slate-400">
        {hiddenWord}
      </p>

      {gameStatus === "playing" && (
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter)}
              className="w-10 h-10 bg-slate-700 text-white font-bold rounded-lg transition-colors duration-200 enabled:hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 uppercase"
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {gameStatus !== "playing" && (
        <div className="mt-4">
          <p
            className={`text-2xl font-bold ${
              gameStatus === "won" ? "text-green-400" : "text-red-400"
            }`}
          >
            {gameStatus === "won"
              ? "You won!"
              : `You lost! The word was "${word}".`}
          </p>
          <button
            onClick={startNewGame}
            className="mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Hangman;
