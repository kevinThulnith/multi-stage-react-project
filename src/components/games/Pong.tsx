import React, { useState, useEffect, useRef, useCallback } from "react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const WINNING_SCORE = 5;

const Pong: React.FC = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "over">(
    "start"
  );
  const [ball, setBall] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    dx: 4,
    dy: 4,
  });
  const [paddles, setPaddles] = useState({
    player: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
    ai: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
  });
  const [score, setScore] = useState({ player: 0, ai: 0 });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const resetBall = useCallback((direction: number) => {
    setBall({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      dx: 4 * direction,
      dy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 2),
    });
  }, []);

  const startGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameState("playing");
    resetBall(1);
  };

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    setBall((prevBall) => {
      let { x, y, dx, dy } = prevBall;
      let newScore = { ...score };

      x += dx;
      y += dy;

      // Wall collision (top/bottom)
      if (y <= 0 || y >= GAME_HEIGHT - BALL_SIZE) {
        dy = -dy;
      }

      // Paddle collision
      const playerY = paddles.player;
      const aiY = paddles.ai;

      // Player paddle
      if (
        x <= PADDLE_WIDTH &&
        y + BALL_SIZE >= playerY &&
        y <= playerY + PADDLE_HEIGHT
      ) {
        dx = -dx * 1.05; // Increase speed slightly
      }
      // AI paddle
      if (
        x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        y + BALL_SIZE >= aiY &&
        y <= aiY + PADDLE_HEIGHT
      ) {
        dx = -dx * 1.05;
      }

      // Score points
      if (x < 0) {
        // AI scores
        newScore.ai++;
        resetBall(1);
      } else if (x > GAME_WIDTH) {
        // Player scores
        newScore.player++;
        resetBall(-1);
      }

      setScore(newScore);

      if (newScore.player >= WINNING_SCORE || newScore.ai >= WINNING_SCORE) {
        setGameState("over");
      }

      return { x, y, dx, dy };
    });

    // AI movement
    setPaddles((prevPaddles) => {
      const aiCenter = prevPaddles.ai + PADDLE_HEIGHT / 2;
      const ballCenter = ball.y + BALL_SIZE / 2;
      let newAiY = prevPaddles.ai;

      if (aiCenter < ballCenter) {
        newAiY += 3;
      } else if (aiCenter > ballCenter) {
        newAiY -= 3;
      }

      newAiY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newAiY));
      return { ...prevPaddles, ai: newAiY };
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [ball.y, gameState, paddles.player, paddles.ai, resetBall, score]);

  useEffect(() => {
    if (gameState === "playing") {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const newPlayerY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
      setPaddles((prev) => ({
        ...prev,
        player: Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newPlayerY)),
      }));
    };

    const currentRef = gameAreaRef.current;
    currentRef?.addEventListener("mousemove", handleMouseMove);
    return () => currentRef?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getMessage = () => {
    if (gameState === "over") {
      return score.player > score.ai ? "You Win!" : "AI Wins!";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center text-slate-400">
      <h2 className="text-3xl font-bold mb-2 text-cyan-400">Pong</h2>
      <div className="flex justify-between w-full max-w-lg mb-2">
        <p className="text-2xl font-bold">Player: {score.player}</p>
        <p className="text-2xl font-bold">AI: {score.ai}</p>
      </div>
      <div
        ref={gameAreaRef}
        className="relative bg-slate-900 border-2 border-slate-500 cursor-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-70 z-10">
            {gameState === "start" ? (
              <h3 className="text-4xl font-bold text-white mb-4">
                Welcome to Pong
              </h3>
            ) : (
              <h3 className="text-4xl font-bold text-white mb-4">
                {getMessage()}
              </h3>
            )}
            <button
              onClick={startGame}
              className="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              {gameState === "start" ? "Start Game" : "Play Again"}
            </button>
          </div>
        )}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-slate-700"></div>
        <div
          className="absolute bg-cyan-400"
          style={{
            width: BALL_SIZE,
            height: BALL_SIZE,
            left: ball.x,
            top: ball.y,
            borderRadius: "50%",
          }}
        ></div>
        <div
          className="absolute bg-white"
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            left: 0,
            top: paddles.player,
          }}
        ></div>
        <div
          className="absolute bg-white"
          style={{
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            right: 0,
            top: paddles.ai,
          }}
        ></div>
      </div>
      <p className="mt-4 text-slate-400">
        Move your mouse to control the paddle.
      </p>
    </div>
  );
};

export default Pong;
