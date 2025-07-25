import React, { useState, useEffect } from "react";

const NumberGuesser: React.FC = () => {
  const [guess, setGuess] = useState("");
  const [isWon, setIsWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [secretNumber, setSecretNumber] = useState(0);
  const [message, setMessage] = useState("Guess a number between 1 and 100!");

  const startNewGame = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("Guess a number between 1 and 100!");
    setAttempts(0);
    setIsWon(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWon) return;

    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setMessage("Please enter a valid number.");
      return;
    }

    setAttempts((prev) => prev + 1);
    if (numGuess === secretNumber) {
      setMessage(
        `You got it in ${
          attempts + 1
        } attempts! The number was ${secretNumber}.`
      );
      setIsWon(true);
    } else if (numGuess < secretNumber) setMessage("Too low! Guess higher.");
    else setMessage("Too high! Guess lower.");

    setGuess("");
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">Number Guesser</h2>
      <p className="text-xl mb-6 text-slate-300 h-8">{message}</p>
      <form
        onSubmit={handleGuess}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={isWon}
          className="bg-slate-700 text-white text-center text-lg px-4 py-2 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          min="1"
          max="100"
        />
        <button
          type="submit"
          disabled={isWon}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          Guess
        </button>
      </form>
      <p className="mt-4 text-slate-400">Attempts: {attempts}</p>
      {isWon && (
        <button
          onClick={startNewGame}
          className="mt-6 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default NumberGuesser;
