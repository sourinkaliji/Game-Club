import React, { useEffect, useState } from "react";
import SudokuBoard from "./SudokuBoard";
import { generateSudoku } from "./sudokuGenerator";
import { useNavigate } from "react-router-dom";
import {
  saveGameSettingsSudoku,
  loadGameSettingsSudoku,
  clearGameSettingsSudoku,
} from "./../utils";
import { Icons } from "../../components/Icons";

const Numpad = ({ selectedNumber, setSelectedNumber }) => {
  return (
    <div className="fixed bottom-2 left-0 font-bold w-full">
      <div className="w-full xs:w-3/4 sm:w-2/3 xl:w-2/5 mx-auto bg-slowSubPrimary text-white rounded-2xl py-2 gap-2 grid grid-cols-5 sm:grid-cols-10 z-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() =>
              setSelectedNumber(selectedNumber === num ? null : num)
            }
            className={`size-10 mx-auto rounded-2xl text-lg transition-colors duration-300 ${
              selectedNumber === num ? "bg-primary" : "bg-subPrimary"
            }`}>
            {num}
          </button>
        ))}
        <button
          onClick={() => setSelectedNumber(selectedNumber === 0 ? null : 0)}
          className={`size-10 mx-auto text-xl font-bold rounded-2xl ${
            selectedNumber === 0 ? "bg-primary" : "bg-subPrimary"
          }`}>
          <Icons.delete className={"w-7 mx-auto stroke-white"} />
        </button>
      </div>
    </div>
  );
};

const SudokuGame = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [fixedCells, setFixedCells] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const [newGame, setNewGame] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadGameSettingsSudoku();
    if (savedSettings) {
      setBoard(savedSettings.board);
      setFixedCells(savedSettings.fixedCells);
      setSolution(savedSettings.solution);
      setSeconds(savedSettings.seconds);
      setDifficulty(savedSettings.difficulty);
      setIsRunning(false);
    } else {
      setNewGame(true);
    }
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (isRunning && !newGame) {
  //       setSeconds((s) => s + 1);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [isRunning]);

  useEffect(() => {
    if (!isRunning || newGame) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, newGame]);

  useEffect(() => {
    if (board.length > 0) {
      saveGameSettingsSudoku({
        board: board,
        fixedCells: fixedCells,
        solution: solution,
        seconds: seconds,
        difficulty: difficulty,
      });
    }
  }, [board, seconds]);

  const startNewGame = (level = difficulty) => {
    clearGameSettingsSudoku();
    const { puzzle, solved } = generateSudoku(level);
    setBoard(puzzle);
    setSolution(solved);
    setFixedCells(puzzle.map((row) => row.map((cell) => cell !== 0)));
    setSeconds(0);
    setSelectedNumber(null);

    setIsRunning(true);
    setNewGame(false);
  };

  const handleCellSelect = (row, col) => {
    if (!fixedCells[row][col] && selectedNumber !== null) {
      const newBoard = board.map((r, ri) =>
        r.map((c, ci) => (ri === row && ci === col ? selectedNumber : c))
      );
      setBoard(newBoard);
    }
  };

  const checkWin = () => {
    return JSON.stringify(board) === JSON.stringify(solution);
  };

  return (
    <div className="flex flex-col justify-between gap-4 bg-backgroundcolor min-h-screen">
      <div>
        <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 my-3 bg-darkBackgroundcolor rounded-xl">
          <h2 className="text-center text-2xl font-bold">بازی سودوکو</h2>
          <button
            className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
            onClick={() => setIsRunning(false)}>
            <Icons.stop className={"w-8"} />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 text-lg font-medium">
          <h1>
            درجه سختی:{" "}
            <span>
              {difficulty === "easy"
                ? "آسان"
                : difficulty === "medium"
                ? "متوسط"
                : difficulty === "hard"
                ? "سخت"
                : "نامعلوم"}
            </span>
          </h1>
          <p className="text-gray-700">
            زمان: {Math.floor(seconds / 60)}:
            {String(seconds % 60).padStart(2, "0")}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <SudokuBoard
          board={board}
          fixedCells={fixedCells}
          onSelectCell={handleCellSelect}
        />
        <button
          onClick={() =>
            alert(checkWin() ? "✅ تبریک! جدول کامل شد" : "🔍 هنوز کامل نیست")
          }
          className="bg-slowSubPrimary text-white text-lg px-6 py-2 rounded-full hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer mt-3">
          بررسی جدول
        </button>

        <Numpad
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
        />
      </div>
      <div className="h-24"></div>
      {/* ----------------------------------------- GAME PAUSE ----------------------------------------- */}
      {!isRunning && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center z-20">
          <div className="bg-backgroundcolor p-3 rounded-3xl">
            <h1 className="text-center text-xl font-bold pb-1">
              بازی استپ خرده است
            </h1>
            <h3 className="text-sm">
              یکی از گزینه های زیر را برای ادامه انتخاب کنید
            </h3>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setIsRunning(true)}
                className="bg-primary text-white text-sm border-2 border-primary px-3
                  py-2 rounded-full mt-4 hover:bg-darkPrimary
                  hover:border-darkPrimary hover:scale-105 transition-all
                  duration-300 ease-out">
                ادامه بازی
              </button>
              <button
                onClick={() => {
                  clearGameSettingsSudoku();
                  setNewGame(true);
                  setIsRunning(true);
                }}
                className="text-primary border-2 border-primary text-sm py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
                شروع مجدد
              </button>
              <button
                onClick={() => {
                  navigate("/OfflineGames", { replace: true });
                }}
                className="text-primary border-2 border-primary text-sm py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
                خروج از بازی
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ----------------------------------------- NEW GAME ----------------------------------------- */}
      {newGame && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center z-20">
          <div className="bg-backgroundcolor p-4 rounded-3xl flex flex-col gap-2">
            <h1 className="text-center text-xl font-bold pb-1">
              درجه سختی بازی رو مشخص کنید
            </h1>

            <div className="flex justify-around items-center">
              <button
                className={`px-4 py-2 rounded-full ${
                  difficulty === "easy"
                    ? "bg-primary border-primary"
                    : "bg-darkBackgroundcolor border-white"
                } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                onClick={() => setDifficulty("easy")}>
                آسان
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  difficulty === "medium"
                    ? "bg-primary border-primary"
                    : "bg-darkBackgroundcolor border-white"
                } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                onClick={() => setDifficulty("medium")}>
                متوسط
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  difficulty === "hard"
                    ? "bg-primary border-primary"
                    : "bg-darkBackgroundcolor border-white"
                } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                onClick={() => setDifficulty("hard")}>
                سخت
              </button>
            </div>

            <button
              onClick={() => {
                startNewGame();
              }}
              className="mt-2 font-bold text-xl bg-primary text-white p-4 rounded-3xl w-full hover:bg-darkPrimary transition-all duration-300 ease-out">
              شروع بازی
            </button>

            <button
              onClick={() => {
                navigate("/OfflineGames", { replace: true });
              }}
              className="text-primary border-2 border-primary py-2 px-4 rounded-full hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
              خروج از بازی
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;
