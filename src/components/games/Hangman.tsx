import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import { randomWord } from "../words";

// Generate 6 random words at module load
const WORDS = Array.from({ length: 6 }, () => randomWord());
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX_WRONG_GUESSES = 6;

// NEW: Access the environment variable (ensure it's prefixed, e.g., VITE_GEMINI_API_KEY)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// NEW: Initialize the GoogleGenerativeAI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const Hangman: React.FC = () => {
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  const startNewGame = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setHint("");
    setHintUsed(false);
    setWrongGuesses(0);
    setHintError(null);
    setGuessedLetters([]);
    setGameStatus("playing");
    setIsHintLoading(false);
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

  // NEW: Function to call Gemini API and get a hint
  const getHint = async () => {
    if (!word || hintUsed || isHintLoading) return;

    setIsHintLoading(true);
    setHintError(null);

    if (!GEMINI_API_KEY || !genAI) {
      setHintError(
        "API key not found. Please set VITE_GEMINI_API_KEY in your .env file."
      );
      setIsHintLoading(false);
      return;
    }

    const prompt = `Provide a short, one-sentence clue for the word "${word}" for a game of hangman. Do not use the word "${word}" in your clue.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const hintText = response.text();

      if (hintText) {
        setHint(hintText.trim());
        setHintUsed(true); // Mark hint as used for this round
      } else throw new Error("Could not extract hint from API response.");
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHintError("Sorry, couldn't fetch a hint right now.");
    } finally {
      setIsHintLoading(false);
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

      {/* NEW: Hint display and button section */}
      {gameStatus === "playing" && (
        <div className="mb-6 h-16 flex flex-col items-center justify-center">
          {!hint && !isHintLoading && !hintError && (
            <button
              onClick={getHint}
              disabled={hintUsed || isHintLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get a Hint
            </button>
          )}
          {isHintLoading && (
            <p className="text-slate-400 animate-pulse">Generating hint...</p>
          )}
          {hintError && <p className="text-red-400">{hintError}</p>}
          {hint && (
            <p className="text-yellow-300 text-lg italic">Hint: {hint}</p>
          )}
        </div>
      )}

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
