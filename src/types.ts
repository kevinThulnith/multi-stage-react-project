import React from "react";

export type GameId =
  | "tic-tac-toe"
  | "rock-paper-scissors"
  | "hangman"
  | "number-guesser"
  | "word-scramble"
  | "memory-match"
  | "connect-four"
  | "snake"
  | "minesweeper"
  | "typing-test"
  | "pong"
  | "brick-breaker";

export interface Game {
  id: GameId;
  name: string;
  description: string;
  component: React.FC;
  icon: React.ReactNode;
}
