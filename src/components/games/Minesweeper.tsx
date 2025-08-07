import React, { useState, useEffect } from "react";

const GRID_SIZE = 10;
const MINE_COUNT = 10;

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}
type Board = Cell[][];

const createEmptyBoard = (): Board =>
  Array(GRID_SIZE)
    .fill(null)
    .map(() =>
      Array(GRID_SIZE)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const plantMines = (
    initialBoard: Board,
    startR: number,
    startC: number
  ): Board => {
    let minesPlaced = 0;
    const newBoard = JSON.parse(JSON.stringify(initialBoard));

    while (minesPlaced < MINE_COUNT) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newBoard[r][c].isMine && (r !== startR || c !== startC)) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }
    return calculateAdjacentMines(newBoard);
  };

  const calculateAdjacentMines = (b: Board): Board => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!b[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 &&
                nr < GRID_SIZE &&
                nc >= 0 &&
                nc < GRID_SIZE &&
                b[nr][nc].isMine
              ) {
                count++;
              }
            }
          }
          b[r][c].adjacentMines = count;
        }
      }
    }
    return b;
  };

  const revealCellsRecursive = (r: number, c: number, boardToReveal: Board) => {
    if (
      r < 0 ||
      r >= GRID_SIZE ||
      c < 0 ||
      c >= GRID_SIZE ||
      boardToReveal[r][c].isRevealed
    ) {
      return;
    }

    const cell = boardToReveal[r][c];
    cell.isRevealed = true;
    cell.isFlagged = false;

    if (cell.adjacentMines === 0 && !cell.isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          revealCellsRecursive(r + dr, c + dc, boardToReveal);
        }
      }
    }
  };

  const handleClick = (r: number, c: number) => {
    if (gameOver || gameWon || board[r][c].isFlagged) return;

    let newBoard: Board;

    if (isFirstClick) {
      newBoard = plantMines(board, r, c);
      setIsFirstClick(false);
    } else newBoard = JSON.parse(JSON.stringify(board));

    if (newBoard[r][c].isMine) {
      setGameWon(false);
      setGameOver(true);
      const finalBoard = newBoard.map((row) =>
        row.map((cell) => ({ ...cell, isRevealed: true }))
      );
      setBoard(finalBoard);
      return;
    }

    revealCellsRecursive(r, c, newBoard);
    setBoard(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || board[r][c].isRevealed) return;
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  useEffect(() => {
    if (isFirstClick || gameOver) return;
    const revealedNonMines = board
      .flat()
      .filter((cell) => cell.isRevealed && !cell.isMine).length;
    if (revealedNonMines === GRID_SIZE * GRID_SIZE - MINE_COUNT) {
      setGameWon(true);
      setGameOver(true);
    }
  }, [board, isFirstClick, gameOver]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setGameWon(false);
    setIsFirstClick(true);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged && !cell.isRevealed) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return "";
  };

  const getTextColor = (count: number) => {
    switch (count) {
      case 1:
        return "text-blue-500";
      case 2:
        return "text-green-500";
      case 3:
        return "text-red-500";
      case 4:
        return "text-purple-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Minesweeper</h2>
      {gameOver && (
        <p
          className={`text-xl mb-2 font-bold ${
            gameWon ? "text-green-400" : "text-red-400"
          }`}
        >
          {gameWon ? "You Win!" : "Game Over"}
        </p>
      )}
      <div className="grid grid-cols-10 gap-px bg-slate-600 p-1">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-lg ${
                cell.isRevealed
                  ? "bg-slate-800"
                  : "bg-slate-700 hover:bg-slate-600"
              } ${getTextColor(cell.adjacentMines)}`}
              disabled={gameOver}
            >
              {getCellContent(cell)}
            </button>
          ))
        )}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
      >
        Reset Game
      </button>
      <p className="text-sm mt-2 text-slate-400">
        Left click to reveal, right click to flag.
      </p>
    </div>
  );
};

export default Minesweeper;
