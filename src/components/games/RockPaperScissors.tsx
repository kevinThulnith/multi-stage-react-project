import React, { useState } from "react";

type Choice = "rock" | "paper" | "scissors";
const choices: Choice[] = ["rock", "paper", "scissors"];

const RockPaperScissors: React.FC = () => {
  const [result, setResult] = useState<string>("Make your move!");
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);

  const handlePlayerChoice = (choice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);
    determineWinner(choice, computerChoice);
  };

  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) setResult("It's a tie!");
    else if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      setResult("You win!");
      setScores((prev) => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult("Computer wins!");
      setScores((prev) => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  const getEmoji = (choice: Choice | null) => {
    if (choice === "rock") return "✊";
    if (choice === "paper") return "✋";
    if (choice === "scissors") return "✌️";
    return "?";
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("Make your move!");
    setScores({ player: 0, computer: 0 });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">
        Rock Paper Scissors
      </h2>
      <div className="flex justify-around w-full max-w-md my-6 text-slate-400">
        <div className="text-xl">
          Player:{" "}
          <span className="font-bold text-green-400">{scores.player}</span>
        </div>
        <div className="text-xl">
          Computer:{" "}
          <span className="font-bold text-red-400">{scores.computer}</span>
        </div>
      </div>
      <div className="flex justify-around w-full max-w-sm my-6 text-slate-500">
        <div className="flex flex-col items-center">
          <span className="text-6xl">{getEmoji(playerChoice)}</span>
          <span className="mt-2">You</span>
        </div>
        <div className="text-4xl self-center font-bold">vs</div>
        <div className="flex flex-col items-center">
          <span className="text-6xl">{getEmoji(computerChoice)}</span>
          <span className="mt-2">Computer</span>
        </div>
      </div>
      <p className="text-2xl font-semibold my-4 h-8 text-slate-400">{result}</p>
      <div className="flex space-x-4 my-4">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handlePlayerChoice(choice)}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-xl capitalize"
          >
            {choice}
          </button>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
      >
        Reset Scores
      </button>
    </div>
  );
};

export default RockPaperScissors;
