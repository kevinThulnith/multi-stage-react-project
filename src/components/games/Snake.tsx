import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const Snake: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [speed, setSpeed] = useState<number | null>(200);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const createFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    createFood(INITIAL_SNAKE);
    setDirection("RIGHT");
    setSpeed(200);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  }, [createFood]);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default arrow key behavior (scrolling)
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      // Start game on first key press
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
      }

      setDirection((prevDirection) => {
        switch (e.key) {
          case "ArrowUp":
            return prevDirection !== "DOWN" ? "UP" : prevDirection;
          case "ArrowDown":
            return prevDirection !== "UP" ? "DOWN" : prevDirection;
          case "ArrowLeft":
            return prevDirection !== "RIGHT" ? "LEFT" : prevDirection;
          case "ArrowRight":
            return prevDirection !== "LEFT" ? "RIGHT" : prevDirection;
          default:
            return prevDirection;
        }
      });
    },
    [gameStarted, gameOver]
  );

  const handleReactKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Prevent default arrow key behavior (scrolling)
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      // Start game on first key press
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
      }

      setDirection((prevDirection) => {
        switch (e.key) {
          case "ArrowUp":
            return prevDirection !== "DOWN" ? "UP" : prevDirection;
          case "ArrowDown":
            return prevDirection !== "UP" ? "DOWN" : prevDirection;
          case "ArrowLeft":
            return prevDirection !== "RIGHT" ? "LEFT" : prevDirection;
          case "ArrowRight":
            return prevDirection !== "LEFT" ? "RIGHT" : prevDirection;
          default:
            return prevDirection;
        }
      });
    },
    [gameStarted, gameOver]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) {
      return;
    }

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setSpeed(null);
        return prevSnake;
      }

      // Self collision
      for (let i = 0; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameOver(true);
          setSpeed(null);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setSpeed((s) => Math.max(50, (s || 200) * 0.95));
        createFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, createFood]);

  useEffect(() => {
    if (speed !== null && gameStarted && !gameOver) {
      const gameInterval = setInterval(moveSnake, speed);
      return () => clearInterval(gameInterval);
    }
  }, [speed, moveSnake, gameStarted, gameOver]);

  // Initialize food on first render
  useEffect(() => {
    createFood(INITIAL_SNAKE);
  }, [createFood]);

  return (
    <div className="flex flex-col items-center" tabIndex={0}>
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Snake</h2>
      <p className="text-lg mb-4 text-slate-300">Score: {score}</p>
      <div
        className="grid bg-slate-700 border-2 border-slate-600 relative focus:outline-none"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: "400px",
          height: "400px",
        }}
        tabIndex={0}
        onKeyDown={handleReactKeyDown}
      >
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-10">
            <p className="text-2xl font-bold text-cyan-400 mb-4">
              Press any arrow key to start
            </p>
            <button
              onClick={startGame}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
            >
              Start Game
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-10">
            <p className="text-3xl font-bold text-red-500 mb-2">Game Over</p>
            <p className="text-xl text-white mb-4">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Again
            </button>
          </div>
        )}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`
                ${isSnake ? (isHead ? "bg-green-400" : "bg-green-500") : ""}
                ${isFood ? "bg-red-500 rounded-full" : ""}
                ${!isSnake && !isFood ? "bg-slate-800" : ""}
              `}
              style={{
                width: `${400 / GRID_SIZE}px`,
                height: `${400 / GRID_SIZE}px`,
              }}
            />
          );
        })}
      </div>
      <p className="mt-4 text-slate-400">Use arrow keys to move the snake</p>
    </div>
  );
};

export default Snake;
