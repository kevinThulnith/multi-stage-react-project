import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import { randomWord } from "../words";

// Generate 6 different words
const WORDS = (): string[] => {
  const words = new Set<string>();
  while (words.size < 6) words.add(randomWord());
  return [...words];
};

// Access the environment variable for Gemini API
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the GoogleGenerativeAI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const scrambleWord = (word: string): string => {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

const WordScramble: React.FC = () => {
  const [hint, setHint] = useState("");
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [originalWord, setOriginalWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);

  const setupNewWord = () => {
    const newWord = WORDS()[Math.floor(Math.random() * WORDS.length)];
    setHint("");
    setGuess("");
    setMessage("");
    setHintUsed(false);
    setHintError(null);
    setIsHintLoading(false);
    setOriginalWord(newWord);
    setScrambledWord(scrambleWord(newWord));
  };

  useEffect(() => {
    setupNewWord();
  }, []);

  // Function to call Gemini API and get a hint
  const getHint = async () => {
    if (!originalWord || hintUsed || isHintLoading) return;

    setIsHintLoading(true);
    setHintError(null);

    if (!GEMINI_API_KEY || !genAI) {
      setHintError(
        "API key not found. Please set VITE_GEMINI_API_KEY in your .env file."
      );
      setIsHintLoading(false);
      return;
    }

    const prompt = `Provide a short, one-sentence clue for the word "${originalWord}" for a word scramble game. Do not use the word "${originalWord}" in your clue.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toLowerCase() === originalWord.toLowerCase()) {
      setMessage("Correct! Well done!");
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setupNewWord();
      }, 1500);
    } else {
      setMessage("Incorrect. Try again!");
      setGuess("");
    }
  };

  const handleSkip = () => {
    setMessage(`The word was "${originalWord}".`);
    setTimeout(() => {
      setupNewWord();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Word Scramble</h2>
      <p className="text-xl mb-4 text-slate-300">Score: {score}</p>
      <p className="mb-4 text-slate-400">
        Unscramble the letters to form a word.
      </p>

      <div className="bg-slate-700 p-4 rounded-lg my-4">
        <p className="text-4xl tracking-widest font-mono text-white">
          {scrambledWord}
        </p>
      </div>

      {/* Hint display and button section */}
      <div className="flex flex-col items-center justify-center">
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
        {hint && <p className="text-yellow-300 text-lg italic">Hint: {hint}</p>}
      </div>

      <p
        className={`text-lg my-5 h-6 ${
          message.includes("Correct") ? "text-green-400" : "text-red-400"
        }`}
      >
        {message ? message : "Make a guess!"}
      </p>

      <form
        onSubmit={handleGuess}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64 text-center"
          placeholder="Your guess"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          Submit
        </button>
      </form>

      <button
        onClick={handleSkip}
        className="mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Skip Word
      </button>
    </div>
  );
};

export default WordScramble;
