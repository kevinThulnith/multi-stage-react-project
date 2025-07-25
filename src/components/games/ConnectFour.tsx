
import React, { useState, useEffect } from 'react';

const ROWS = 6;
const COLS = 7;
type Player = '1' | '2';
type Cell = Player | null;
type Board = Cell[][];

const createEmptyBoard = (): Board => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

const checkWin = (board: Board): Player | null => {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const player = board[r][c];
      if (player && player === board[r][c+1] && player === board[r][c+2] && player === board[r][c+3]) {
        return player;
      }
    }
  }
  // Check vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (player && player === board[r+1][c] && player === board[r+2][c] && player === board[r+3][c]) {
        return player;
      }
    }
  }
  // Check diagonal (down-right)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const player = board[r][c];
      if (player && player === board[r+1][c+1] && player === board[r+2][c+2] && player === board[r+3][c+3]) {
        return player;
      }
    }
  }
  // Check diagonal (up-right)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const player = board[r][c];
      if (player && player === board[r-1][c+1] && player === board[r-2][c+2] && player === board[r-3][c+3]) {
        return player;
      }
    }
  }
  return null;
};

const ConnectFour: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('1');
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const win = checkWin(board);
    if (win) {
      setWinner(win);
    } else if (board.every(row => row.every(cell => cell !== null))) {
      setIsDraw(true);
    }
  }, [board]);

  const handleColumnClick = (colIndex: number) => {
    if (winner || board[0][colIndex]) return;

    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!newBoard[r][colIndex]) {
        newBoard[r][colIndex] = currentPlayer;
        break;
      }
    }
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === '1' ? '2' : '1');
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('1');
    setWinner(null);
    setIsDraw(false);
  };

  const getStatusMessage = () => {
    if (winner) return `Player ${winner} Wins!`;
    if (isDraw) return "It's a Draw!";
    return `Player ${currentPlayer}'s Turn`;
  };
  
  const getPlayerColor = (player: Player) => player === '1' ? 'bg-red-500' : 'bg-yellow-400';

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Connect Four</h2>
      <p className={`text-xl mb-4 font-bold ${winner === '1' ? 'text-red-400' : winner === '2' ? 'text-yellow-400' : 'text-slate-300'}`}>
        {getStatusMessage()}
      </p>
      <div className="bg-blue-800 p-2 sm:p-3 rounded-lg inline-block">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {board.map((row, rIndex) => 
            row.map((cell, cIndex) => (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-900 flex items-center justify-center cursor-pointer"
                onClick={() => handleColumnClick(cIndex)}
              >
                {cell && <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${getPlayerColor(cell)}`}></div>}
              </div>
            ))
          )}
        </div>
      </div>
      <button
        onClick={resetGame}
        className="mt-6 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
      >
        Reset Game
      </button>
    </div>
  );
};

export default ConnectFour;
