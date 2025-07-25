import React, { useState, useEffect, useRef, useCallback } from "react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 450;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 4;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;
const BRICK_WIDTH =
  (GAME_WIDTH - BRICK_OFFSET_LEFT * 2 - BRICK_GAP * (BRICK_COLS - 1)) /
  BRICK_COLS;

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
}

const createBricks = (): Brick[] => {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      bricks.push({
        x: BRICK_OFFSET_LEFT + c * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_OFFSET_TOP + r * (BRICK_HEIGHT + BRICK_GAP),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        alive: true,
      });
    }
  }
  return bricks;
};

const BrickBreaker: React.FC = () => {
  const [gameState, setGameState] = useState<
    "start" | "playing" | "won" | "lost"
  >("start");
  const [paddleX, setPaddleX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
  const [ball, setBall] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT - 50,
    dx: 3,
    dy: -3,
  });
  const [bricks, setBricks] = useState<Brick[]>(createBricks());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const resetLevel = useCallback((newLives: number) => {
    setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
    setBall({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 3, dy: -3 });
    if (newLives <= 0) {
      setBricks(createBricks());
      setScore(0);
      setLives(3);
      setGameState("lost");
    } else {
      setLives(newLives);
    }
  }, []);

  const startGame = () => {
    setGameState("playing");
    if (gameState !== "start") {
      resetLevel(3);
      setBricks(createBricks());
      setScore(0);
    }
  };

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    // Ball movement
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Wall collision
    if (newBall.x <= 0 || newBall.x >= GAME_WIDTH - BALL_RADIUS * 2)
      newBall.dx *= -1;
    if (newBall.y <= 0) newBall.dy *= -1;

    // Paddle collision
    if (
      newBall.y + BALL_RADIUS * 2 >= GAME_HEIGHT - PADDLE_HEIGHT &&
      newBall.x + BALL_RADIUS > paddleX &&
      newBall.x < paddleX + PADDLE_WIDTH
    ) {
      newBall.dy *= -1;
      newBall.y = GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS * 2;
    }

    // Brick collision
    let newBricks = [...bricks];
    let newScore = score;
    let bricksLeft = false;
    newBricks.forEach((brick) => {
      if (brick.alive) {
        if (
          newBall.x > brick.x &&
          newBall.x < brick.x + brick.width &&
          newBall.y > brick.y &&
          newBall.y < brick.y + brick.height
        ) {
          newBall.dy *= -1;
          brick.alive = false;
          newScore += 10;
        } else {
          bricksLeft = true;
        }
      }
    });

    setBricks(newBricks);
    setScore(newScore);

    // Win condition
    if (!bricksLeft) {
      setGameState("won");
      return;
    }

    // Lose life
    if (newBall.y > GAME_HEIGHT) {
      resetLevel(lives - 1);
    } else {
      setBall(newBall);
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [ball, bricks, paddleX, score, lives, gameState, resetLevel]);

  useEffect(() => {
    if (gameState === "playing") {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const newPaddleX = e.clientX - rect.left - PADDLE_WIDTH / 2;
      setPaddleX(Math.max(0, Math.min(GAME_WIDTH - PADDLE_WIDTH, newPaddleX)));
    };
    const currentRef = gameAreaRef.current;
    currentRef?.addEventListener("mousemove", handleMouseMove);
    return () => currentRef?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const brickColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
  ];

  return (
    <div className="flex flex-col items-center text-slate-400">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Brick Breaker</h2>
      <div className="flex justify-between w-full max-w-lg mb-2">
        <p className="text-xl font-bold">Score: {score}</p>
        <p className="text-xl font-bold">Lives: {lives}</p>
      </div>
      <div
        ref={gameAreaRef}
        className="relative bg-slate-900 border-2 border-slate-500"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-20">
            <h3 className="text-4xl font-bold text-white mb-4">
              {gameState === "start" && "Break the Bricks!"}
              {gameState === "won" && `You Win! Score: ${score}`}
              {gameState === "lost" && "Game Over"}
            </h3>
            <button
              onClick={startGame}
              className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              {gameState === "start" ? "Start Game" : "Play Again"}
            </button>
          </div>
        )}
        {bricks.map(
          (brick, i) =>
            brick.alive && (
              <div
                key={i}
                className={`absolute ${brickColors[i % BRICK_ROWS]}`}
                style={{
                  left: brick.x,
                  top: brick.y,
                  width: brick.width,
                  height: brick.height,
                }}
              ></div>
            )
        )}
        <div
          className="absolute bg-cyan-400"
          style={{
            left: paddleX,
            top: GAME_HEIGHT - PADDLE_HEIGHT,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
          }}
        ></div>
        <div
          className="absolute bg-white rounded-full"
          style={{
            left: ball.x,
            top: ball.y,
            width: BALL_RADIUS * 2,
            height: BALL_RADIUS * 2,
          }}
        ></div>
      </div>
      <p className="mt-4 text-slate-400">
        Move your mouse to control the paddle.
      </p>
    </div>
  );
};

export default BrickBreaker;
