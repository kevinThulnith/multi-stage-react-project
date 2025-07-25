import React, { useState, useEffect } from "react";
import { randomWord } from "../words";

const WORDS = Array.from({ length: 6 }, () => randomWord());

const scrambleWord = (word: string): string => {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

const WordScramble: React.FC = () => {
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [originalWord, setOriginalWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");

  const setupNewWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setOriginalWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setGuess("");
    setMessage("");
  };

  useEffect(() => {
    setupNewWord();
  }, []);

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

      <p
        className={`text-lg mb-4 h-6 ${
          message.includes("Correct") ? "text-green-400" : "text-red-400"
        }`}
      >
        {message}
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
