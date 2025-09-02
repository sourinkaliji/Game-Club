import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveTicTacToeSettings,
  loadTicTacToeSettings,
  clearTicTacToeSettings,
} from "./utils";
import { Icons } from "../components/Icons";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // true = player, false = computer
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost, draw
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [gameMessage, setGameMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadTicTacToeSettings();
    if (savedSettings) {
      setBoard(savedSettings.board || Array(9).fill(null));
      setIsPlayerTurn(
        savedSettings.isPlayerTurn !== undefined
          ? savedSettings.isPlayerTurn
          : true
      );
      setGameStatus(savedSettings.gameStatus || "playing");
      setPlayerScore(savedSettings.playerScore || 0);
      setComputerScore(savedSettings.computerScore || 0);
      setDrawScore(savedSettings.drawScore || 0);
      setIsGamePaused(savedSettings.isGamePaused || false);
      setGameMessage(savedSettings.gameMessage || "");
    }
  }, []);

  // ذخیره تنظیمات در localStorage
  const saveCurrentSettings = (newState = {}) => {
    const settings = {
      board: newState.board || board,
      isPlayerTurn:
        newState.isPlayerTurn !== undefined
          ? newState.isPlayerTurn
          : isPlayerTurn,
      gameStatus: newState.gameStatus || gameStatus,
      playerScore:
        newState.playerScore !== undefined ? newState.playerScore : playerScore,
      computerScore:
        newState.computerScore !== undefined
          ? newState.computerScore
          : computerScore,
      drawScore:
        newState.drawScore !== undefined ? newState.drawScore : drawScore,
      isGamePaused:
        newState.isGamePaused !== undefined
          ? newState.isGamePaused
          : isGamePaused,
      gameMessage:
        newState.gameMessage !== undefined ? newState.gameMessage : gameMessage,
    };
    saveTicTacToeSettings(settings);
  };

  // بررسی برنده
  const checkWinner = (boardState) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // سطرها
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // ستون‌ها
      [0, 4, 8],
      [2, 4, 6], // قطرها
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a]; // X یا O
      }
    }

    if (boardState.every((cell) => cell !== null)) {
      return "draw"; // مساوی
    }

    return null; // بازی ادامه دارد
  };

  // کلیک بازیکن
  const handlePlayerClick = (index) => {
    if (
      !isPlayerTurn ||
      isGamePaused ||
      gameStatus !== "playing" ||
      board[index]
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = "X";

    const winner = checkWinner(newBoard);

    if (winner === "X") {
      const newPlayerScore = playerScore + 1;
      setBoard(newBoard);
      setPlayerScore(newPlayerScore);
      setGameStatus("won");
      setGameMessage("تبریک! شما برنده شدید! 🎉");

      saveCurrentSettings({
        board: newBoard,
        playerScore: newPlayerScore,
        gameStatus: "won",
        gameMessage: "تبریک! شما برنده شدید! 🎉",
      });
    } else if (winner === "draw") {
      const newDrawScore = drawScore + 1;
      setBoard(newBoard);
      setDrawScore(newDrawScore);
      setGameStatus("draw");
      setGameMessage("بازی مساوی شد! 🤝");

      saveCurrentSettings({
        board: newBoard,
        drawScore: newDrawScore,
        gameStatus: "draw",
        gameMessage: "بازی مساوی شد! 🤝",
      });
    } else {
      setBoard(newBoard);
      setIsPlayerTurn(false);
      setGameMessage("نوبت کامپیوتر...");

      saveCurrentSettings({
        board: newBoard,
        isPlayerTurn: false,
        gameMessage: "نوبت کامپیوتر...",
      });

      // نوبت کامپیوتر با تاخیر
      setTimeout(() => {
        makeComputerMove(newBoard);
      }, 1000);
    }
  };

  // حرکت کامپیوتر - نسخه باهوش
  const makeComputerMove = (currentBoard) => {
    const availableSpots = currentBoard
      .map((spot, index) => (spot === null ? index : null))
      .filter((spot) => spot !== null);

    if (availableSpots.length === 0) return;

    // 1. اول بررسی کن کامپیوتر می‌تونه برنده بشه
    const winningMove = findWinningMove(currentBoard, "O");
    if (winningMove !== -1) {
      executeComputerMove(currentBoard, winningMove);
      return;
    }

    // 2. بعد بررسی کن بازیکن می‌تونه برنده بشه - باید جلوشو بگیریم
    const blockingMove = findWinningMove(currentBoard, "X");
    if (blockingMove !== -1) {
      executeComputerMove(currentBoard, blockingMove);
      return;
    }

    // 3. اگر مرکز خالی باشه، اون رو انتخاب کن
    if (currentBoard[4] === null) {
      executeComputerMove(currentBoard, 4);
      return;
    }

    // 4. گوشه‌ها رو در اولویت قرار بده
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(
      (corner) => currentBoard[corner] === null
    );
    if (availableCorners.length > 0) {
      const randomCorner =
        availableCorners[Math.floor(Math.random() * availableCorners.length)];
      executeComputerMove(currentBoard, randomCorner);
      return;
    }

    // 5. در آخر یکی از کناره‌ها رو انتخاب کن
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter((side) => currentBoard[side] === null);
    if (availableSides.length > 0) {
      const randomSide =
        availableSides[Math.floor(Math.random() * availableSides.length)];
      executeComputerMove(currentBoard, randomSide);
      return;
    }

    // 6. اگر هیچ استراتژی کار نکرد، تصادفی انتخاب کن
    const randomSpot =
      availableSpots[Math.floor(Math.random() * availableSpots.length)];
    executeComputerMove(currentBoard, randomSpot);
  };

  // پیدا کردن حرکت برنده (برای خودش یا جلوگیری از برد بازیکن)
  const findWinningMove = (boardState, player) => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // سطرها
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // ستون‌ها
      [0, 4, 8],
      [2, 4, 6], // قطرها
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      const line = [boardState[a], boardState[b], boardState[c]];

      // اگر دو تا از سه تا پر باشه با همین بازیکن و یکی خالی
      if (
        line.filter((cell) => cell === player).length === 2 &&
        line.filter((cell) => cell === null).length === 1
      ) {
        // برگردان اندیس خونه خالی
        if (boardState[a] === null) return a;
        if (boardState[b] === null) return b;
        if (boardState[c] === null) return c;
      }
    }

    return -1; // هیچ حرکت برنده‌ای پیدا نشد
  };

  // اجرای حرکت کامپیوتر
  const executeComputerMove = (currentBoard, moveIndex) => {
    const newBoard = [...currentBoard];
    newBoard[moveIndex] = "O";

    const winner = checkWinner(newBoard);

    if (winner === "O") {
      const newComputerScore = computerScore + 1;
      setBoard(newBoard);
      setComputerScore(newComputerScore);
      setGameStatus("lost");
      setGameMessage("کامپیوتر برنده شد! 😔");

      saveCurrentSettings({
        board: newBoard,
        computerScore: newComputerScore,
        gameStatus: "lost",
        gameMessage: "کامپیوتر برنده شد! 😔",
      });
    } else if (winner === "draw") {
      const newDrawScore = drawScore + 1;
      setBoard(newBoard);
      setDrawScore(newDrawScore);
      setGameStatus("draw");
      setGameMessage("بازی مساوی شد! 🤝");

      saveCurrentSettings({
        board: newBoard,
        drawScore: newDrawScore,
        gameStatus: "draw",
        gameMessage: "بازی مساوی شد! 🤝",
      });
    } else {
      setBoard(newBoard);
      setIsPlayerTurn(true);
      setGameMessage("نوبت شماست!");

      saveCurrentSettings({
        board: newBoard,
        isPlayerTurn: true,
        gameMessage: "نوبت شماست!",
      });
    }
  };

  // شروع مجدد دست
  const restartRound = () => {
    const newBoard = Array(9).fill(null);
    setBoard(newBoard);
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setGameMessage("بازی جدید شروع شد!");

    saveCurrentSettings({
      board: newBoard,
      isPlayerTurn: true,
      gameStatus: "playing",
      gameMessage: "بازی جدید شروع شد!",
    });
  };

  // ریست کل بازی
  const resetGame = () => {
    clearTicTacToeSettings();
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setPlayerScore(0);
    setComputerScore(0);
    setDrawScore(0);
    setIsGamePaused(false);
    setGameMessage("بازی از اول شروع شد!");
  };

  // مکث/ادامه بازی
  const PauseBtn = () => {
    setIsGamePaused(true);
    const message = "بازی متوقف شد";
    setGameMessage(message);

    saveCurrentSettings({
      isGamePaused: true,
      gameMessage: message,
    });
  };
  const PlayBtn = () => {
    setIsGamePaused(false);
    const message = "بازی ادامه یافت";
    setGameMessage(message);

    saveCurrentSettings({
      isGamePaused: false,
      gameMessage: message,
    });
  };

  // رندر سلول‌های بازی
  const renderCell = (index) => (
    <button
      key={index}
      onClick={() => handlePlayerClick(index)}
      disabled={
        !isPlayerTurn ||
        isGamePaused ||
        gameStatus !== "playing" ||
        board[index]
      }
      className={`
        w-24 h-24 border-2 border-subPrimary rounded-xl text-4xl font-bold
        flex items-center justify-center transition-all duration-300
        ${board[index] === "X" ? "text-primary bg-SlowPrimary" : ""}
        ${board[index] === "O" ? "text-darkPrimary bg-SuperSlowSubPrimary" : ""}
        ${
          !board[index] &&
          isPlayerTurn &&
          gameStatus === "playing" &&
          !isGamePaused
            ? "hover:bg-SlowPrimary cursor-pointer"
            : ""
        }
        ${
          !board[index] &&
          (!isPlayerTurn || gameStatus !== "playing" || isGamePaused)
            ? "bg-SuperSlowSubPrimary cursor-not-allowed"
            : ""
        }
      `}>
      {board[index]}
    </button>
  );

  return (
    <div className="min-h-screen bg-backgroundcolor p-4">
      {/* هدر */}
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-darkBackgroundcolor rounded-xl">
        <h2 className="text-center text-2xl font-bold">بازی دوز</h2>
        <button
          className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
          onClick={PauseBtn}>
          <Icons.stop className={"w-8"} />
        </button>
      </div>

      {/* مودال توقف بازی */}
      {isGamePaused && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center">
          <div className="bg-backgroundcolor p-3 rounded-3xl">
            <h1 className="text-center text-xl font-bold pb-1">
              بازی متوقف شده است
            </h1>
            <h3 className="text-sm">
              یکی از گزینه‌های زیر را برای ادامه انتخاب کنید
            </h3>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={PlayBtn}
                className="bg-primary text-white border-2 text-sm border-primary px-3 py-2 rounded-full mt-4 hover:bg-darkPrimary hover:border-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                ادامه بازی
              </button>
              <button
                onClick={resetGame}
                className="text-primary border-2 text-sm border-primary py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                شروع مجدد
              </button>
              <button
                onClick={() => {
                  // PlayBtn();
                  navigate("/OfflineGames", { replace: true });
                }}
                className="text-primary border-2 text-sm border-primary py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                خروج از بازی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نمایش امتیاز */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-primary text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{playerScore}</div>
          <div className="text-sm">شما</div>
        </div>
        <div className="bg-subPrimary text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{drawScore}</div>
          <div className="text-sm">مساوی</div>
        </div>
        <div className="bg-darkPrimary text-white p-4 rounded-xl text-center">
          <div className="text-2xl font-bold">{computerScore}</div>
          <div className="text-sm">کامپیوتر</div>
        </div>
      </div>

      {/* پیغام بازی */}
      {gameMessage && (
        <div className="text-center mb-4 p-3 bg-SlowPrimary rounded-xl">
          <span className="text-darkPrimary font-bold">{gameMessage}</span>
        </div>
      )}

      {/* صفحه بازی */}
      <div className="grid grid-cols-3 gap-2 max-w-80 mx-auto mb-6">
        {board.map((_, index) => renderCell(index))}
      </div>

      {/* دکمه‌های کنترل */}
      <div className="flex flex-col gap-3 max-w-80 mx-auto">
        {gameStatus !== "playing" && (
          <button
            onClick={restartRound}
            className="bg-primary text-white p-4 rounded-xl font-bold hover:bg-darkPrimary transition-all duration-300">
            دست جدید
          </button>
        )}

        {/* {gameStatus === "playing" && (
          <button
            onClick={togglePause}
            className={`p-4 rounded-xl font-bold transition-all duration-300 ${
              isGamePaused
                ? "bg-primary text-white hover:bg-darkPrimary"
                : "bg-subPrimary text-white hover:bg-slowSubPrimary"
            }`}>
            {isGamePaused ? "ادامه بازی" : "توقف بازی"}
          </button>
        )} */}

        {/* <button
          onClick={resetGame}
          className="bg-darkPrimary text-white p-4 rounded-xl font-bold hover:bg-primary transition-all duration-300">
          شروع از اول
        </button> */}
      </div>
    </div>
  );
}
