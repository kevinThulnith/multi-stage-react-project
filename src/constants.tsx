import RockPaperScissors from "./components/games/RockPaperScissors";
import NumberGuesser from "./components/games/NumberGuesser";
import WordScramble from "./components/games/WordScramble";
import BrickBreaker from "./components/games/BrickBreaker";
import MemoryMatch from "./components/games/MemoryMatch";
import ConnectFour from "./components/games/ConnectFour";
import Minesweeper from "./components/games/Minesweeper";
import TypingTest from "./components/games/TypingTest";
import TicTacToe from "./components/games/TicTacToe";
import Hangman from "./components/games/Hangman";
import { GiSandSnake } from "react-icons/gi";
import Snake from "./components/games/Snake";
import { FaKeyboard } from "react-icons/fa";
import Pong from "./components/games/Pong";
import { MdQuiz } from "react-icons/md";
import { FaBomb } from "react-icons/fa";
import type { Game } from "./types";
import React from "react";

// Icon components
const TicTacToeIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 4v16M16 4v16M4 8h16M4 16h16"
    />
  </svg>
);
const RockPaperScissorsIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.5A2.25 2.25 0 006 20.25z"
    />
  </svg>
);
const HangmanIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {/* Gallows structure */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 20V4h8v2M12 4h4"
    />
    {/* Noose */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 6v2"
    />
    {/* Stick figure head */}
    <circle cx="16" cy="10" r="1" strokeWidth={2} />
    {/* Body */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11v4"
    />
    {/* Arms */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 13h4"
    />
    {/* Legs */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 15l-1.5 2M16 15l1.5 2"
    />
  </svg>
);
const WordScrambleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662s.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.21.138-2.43.138-3.662z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 18a3.75 3.75 0 00.495-7.467 5.25 5.25 0 01-1.135-1.412.5.5 0 01.3-.603l5.538-2.215a.5.5 0 01.604.3l2.215 5.538a.5.5 0 01-.603.7l-1.412-1.135a3.75 3.75 0 00-7.467.495z"
    />
  </svg>
);
const MemoryMatchIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 15.75V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
);
const ConnectFourIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PongIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="12" y1="3" x2="12" y2="21"></line>
    <rect x="5" y="9" width="2" height="6"></rect>
    <rect x="17" y="9" width="2" height="6"></rect>
  </svg>
);
const BrickBreakerIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    {/* Brick pattern */}
    <rect
      x="3"
      y="4"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.8"
    />
    <rect
      x="8"
      y="4"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.8"
    />
    <rect
      x="13"
      y="4"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.8"
    />
    <rect
      x="18"
      y="4"
      width="3"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.8"
    />

    <rect
      x="3"
      y="6"
      width="3"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.6"
    />
    <rect
      x="7"
      y="6"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.6"
    />
    <rect
      x="12"
      y="6"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.6"
    />
    <rect
      x="17"
      y="6"
      width="4"
      height="1.5"
      strokeWidth={1.5}
      fill="currentColor"
      fillOpacity="0.6"
    />

    {/* Ball */}
    <circle cx="15" cy="13" r="1" strokeWidth={2} fill="currentColor" />

    {/* Paddle with rounded ends */}
    <rect
      x="8"
      y="19"
      width="8"
      height="1.2"
      rx="0.6"
      strokeWidth={1.5}
      fill="currentColor"
    />
  </svg>
);

export const GAMES: Game[] = [
  {
    id: "tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Classic 3x3 grid game. Get three in a row to win.",
    component: TicTacToe,
    icon: <TicTacToeIcon />,
  },
  {
    id: "rock-paper-scissors",
    name: "Rock Paper Scissors",
    description: "The classic game of chance. Can you beat the computer?",
    component: RockPaperScissors,
    icon: <RockPaperScissorsIcon />,
  },
  {
    id: "hangman",
    name: "Hangman",
    description:
      "Guess the hidden word letter by letter before you run out of tries.",
    component: Hangman,
    icon: <HangmanIcon />,
  },
  {
    id: "number-guesser",
    name: "Number Guesser",
    description:
      "The computer has a secret number. Guess it in the fewest tries!",
    component: NumberGuesser,
    icon: <MdQuiz className="h-12 w-12" />,
  },
  {
    id: "word-scramble",
    name: "Word Scramble",
    description:
      "Unscramble the letters to form a valid word. A fun vocabulary test.",
    component: WordScramble,
    icon: <WordScrambleIcon />,
  },
  {
    id: "memory-match",
    name: "Memory Match",
    description:
      "Flip cards and find all the matching pairs. A test of your memory.",
    component: MemoryMatch,
    icon: <MemoryMatchIcon />,
  },
  {
    id: "connect-four",
    name: "Connect Four",
    description: "Drop your discs and be the first to get four in a row.",
    component: ConnectFour,
    icon: <ConnectFourIcon />,
  },
  {
    id: "snake",
    name: "Snake",
    description:
      "Guide the snake to eat the food and grow longer without crashing.",
    component: Snake,
    icon: <GiSandSnake className="text-5xl" />,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    description:
      "Clear the board without detonating any hidden mines. A game of logic.",
    component: Minesweeper,
    icon: <FaBomb className="text-4xl" />,
  },
  {
    id: "typing-test",
    name: "Typing Test",
    description: "Test your typing speed and accuracy with a random paragraph.",
    component: TypingTest,
    icon: <FaKeyboard className="text-4xl" />,
  },
  {
    id: "pong",
    name: "Pong",
    description:
      "The original arcade classic. Deflect the ball and outscore your opponent.",
    component: Pong,
    icon: <PongIcon />,
  },
  {
    id: "brick-breaker",
    name: "Brick Breaker",
    description: "Use the paddle to break all the bricks with the ball.",
    component: BrickBreaker,
    icon: <BrickBreakerIcon />,
  },
];
