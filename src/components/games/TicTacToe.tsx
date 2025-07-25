import React, { useState, useEffect } from "react";
import { FaRegCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

type Player = "X" | "O";
type SquareValue = Player | null;

const calculateWinner = (
  squares: SquareValue[]
): { winner: Player | null; winningSquares: number[] } => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }
  return { winner: null, winningSquares: [] };
};

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [winningSquares, setWinningSquares] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const {
      winner: calculatedWinner,
      winningSquares: calculatedWinningSquares,
    } = calculateWinner(board);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      setWinningSquares(calculatedWinningSquares);
    } else if (board.every((square) => square !== null)) setIsDraw(true);
  }, [board]);

  const handleClick = (index: number) => {
    if (winner || board[index]) return;
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setWinningSquares([]);
    setIsDraw(false);
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    const isWinningSquare = winningSquares.includes(index);

    const renderIcon = () => {
      if (value === "X") {
        return (
          <IoClose
            className={`text-9xl ${
              isWinningSquare ? "text-red-600" : "text-red-400"
            }`}
          />
        );
      } else if (value === "O") {
        return (
          <FaRegCircle
            className={`text-7xl ${
              isWinningSquare ? "text-blue-600" : "text-blue-400"
            }`}
          />
        );
      }
      return null;
    };

    return (
      <button
        onClick={() => handleClick(index)}
        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          isWinningSquare ? "bg-slate-600" : "bg-slate-700 hover:bg-slate-600"
        }`}
      >
        {renderIcon()}
      </button>
    );
  };

  let status;
  if (winner) status = `Winner: ${winner}!`;
  else if (isDraw) status = "It's a Draw!";
  else status = `Next player: ${currentPlayer}`;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">Tic Tac Toe</h2>
      <div className="text-xl mb-4 text-slate-300">{status}</div>
      <div className="grid grid-cols-3 gap-3">
        {Array(9)
          .fill(null)
          .map((_, i) => renderSquare(i))}
      </div>
      <button
        onClick={resetGame}
        className="mt-6 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
