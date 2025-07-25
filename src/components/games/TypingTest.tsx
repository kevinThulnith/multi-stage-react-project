import React, { useState, useEffect, useRef } from "react";

const TEXT_TO_TYPE =
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters of the alphabet. A developer's journey is filled with challenges, learning, and immense satisfaction. Writing clean, efficient, and maintainable code is a skill that is honed over time with practice and dedication. Keep typing, keep learning, and keep building amazing things.";

const TypingTest: React.FC = () => {
  const startTimeRef = useRef(0);
  const [wpm, setWpm] = useState(0);
  const [timer, setTimer] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [typedText, setTypedText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | undefined>(undefined);

  // Stop timer when component unmounts
  useEffect(() => {
    return () => window.clearInterval(intervalRef.current);
  }, []);

  const calculateResults = (finalText: string, timeTaken: number) => {
    const durationInMinutes = timeTaken / 1000 / 60;
    if (durationInMinutes > 0) {
      const wordsTyped = finalText.trim().split(/\s+/).length;
      const calculatedWpm = Math.round(wordsTyped / durationInMinutes);
      setWpm(calculatedWpm);
    } else {
      setWpm(0);
    }

    let correctChars = 0;
    const compareLength = Math.min(finalText.length, TEXT_TO_TYPE.length);
    for (let i = 0; i < compareLength; i++) {
      if (finalText[i] === TEXT_TO_TYPE[i]) {
        correctChars++;
      }
    }
    const newAccuracy =
      TEXT_TO_TYPE.length > 0
        ? Math.round((correctChars / TEXT_TO_TYPE.length) * 100)
        : 100;
    setAccuracy(newAccuracy);
  };

  const stopTimer = () => {
    setIsActive(false);
    window.clearInterval(intervalRef.current);
    const timeTaken = Date.now() - startTimeRef.current;
    setTimer(timeTaken);
    return timeTaken;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    if (!isActive && newText.length > 0) {
      setIsActive(true);
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setTimer(Date.now() - startTimeRef.current);
      }, 100);
    }

    setTypedText(newText);

    if (newText.length >= TEXT_TO_TYPE.length) {
      const timeTaken = stopTimer();
      calculateResults(newText, timeTaken);
    }
  };

  const resetTest = () => {
    if (isActive) stopTimer();

    setTypedText("");
    setTimer(0);
    setWpm(0);
    setAccuracy(100);
    startTimeRef.current = 0;
    setIsActive(false);
  };

  const getHighlightedText = () => {
    return TEXT_TO_TYPE.split("").map((char, index) => {
      let color;
      if (index < typedText.length) {
        color =
          char === typedText[index]
            ? "text-green-400"
            : "text-red-500 bg-red-900 bg-opacity-50";
      } else color = "text-slate-400";

      return (
        <span key={index} className={color}>
          {char}
        </span>
      );
    });
  };

  const isFinished = typedText.length >= TEXT_TO_TYPE.length;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-3xl font-bold mb-4 text-cyan-400">Typing Test</h2>
      <div className="flex justify-around w-full max-w-lg mb-4">
        <div className="text-center">
          <p className="text-slate-400">Time</p>
          <p className="text-2xl font-bold text-white">
            {(timer / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400">WPM</p>
          <p className="text-2xl font-bold text-white">{wpm}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400">Accuracy</p>
          <p className="text-2xl font-bold text-white">{accuracy}%</p>
        </div>
      </div>
      <div className="bg-slate-700 p-4 rounded-lg text-lg font-mono leading-relaxed mb-4 max-w-3xl">
        {getHighlightedText()}
      </div>
      <textarea
        value={typedText}
        onChange={handleTextChange}
        disabled={isFinished}
        className="w-full max-w-3xl h-32 p-4 bg-slate-900 border-2 border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
        placeholder="Start typing here..."
        spellCheck="false"
      />
      <button
        onClick={resetTest}
        className="mt-6 bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-6 rounded-lg"
      >
        Reset Test
      </button>
    </div>
  );
};

export default TypingTest;
