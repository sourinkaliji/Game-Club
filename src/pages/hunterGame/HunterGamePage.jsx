import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveGameSettingsHunter,
  loadGameSettingsHunter,
  clearGameSettingsHunter,
} from "../utils";
import { Icons } from "../../components/Icons";

// لیستی از کلمات برای بازی
const words = [
  "گربه",
  "سگ",
  "درخت",
  "خانه",
  "کتاب",
  "کامپیوتر",
  "زمین",
  "دریا",
  "خورشید",
  "ماه",
  "دوچرخه",
  "مداد",
  "میز",
  "صندلی",
  "پنجره",
  "گل",
  "پرنده",
  "قطار",
  "هواپیما",
  "ماشین",
  "مدرسه",
  "دانشگاه",
  "سیب",
  "پرتقال",
  "خیار",
  "هندوانه",
  "موز",
  "نان",
  "شیر",
  "پنیر",
  "چای",
  "قهوه",
  "کفش",
  "کلاه",
  "لباس",
  "ساعت",
  "تلفن",
  "تلویزیون",
  "رادیو",
  "یخچال",
  "فرش",
  "دیوار",
  "کلید",
  "در",
  "پله",
  "چراغ",
  "کاغذ",
  "نقاشی",
  "دستکش",
];

// ---------------------------------------------------------------
// وقتی بازی رفرش میشه. دکمه تعویض در حالت بازی بدون منفی برمیگرده
// ---------------------------------------------------------------
export default function GamePage() {
  // const [playersCount, setPlayersCount] = useState(2); // نام‌های بازیکنان
  const [playersNames, setPlayersNames] = useState([]); // نام‌های بازیکنان
  const [time, setTime] = useState(60); // زمان باقی‌مانده
  const [timeLeft, setTimeLeft] = useState(60); // زمان باقی‌مانده
  const [isNegativeScore, setIsNegativeScore] = useState(false); // نوع امتیاز (منفی یا غیر منفی)
  // const [roundedCount, setRoundedCount] = useState(1); // تعداد دور بازی
  // const [currentRound, setCurrentRound] = useState(0); // دور درحال بازی

  const [currentPlayer, setCurrentPlayer] = useState(0); // نوبت بازیکن
  const [gameStatus, setGameStatus] = useState("playing"); // وضعیت بازی
  const [scores, setScores] = useState([0, 0]); // امتیازات بازیکنان
  const [guessedWords, setGuessedWords] = useState([]); // کلمات حدس زده شده
  const [currentWord, setCurrentWord] = useState(""); // کلمه جاری برای حدس

  const [isStop, setIsStop] = useState(false); // وضعیت استپ بازی
  const [swapWordUsed, setSwapWordUsed] = useState(true); // برای کنترل دکمه تعویض کلمه

  const radius = 50; // شعاع دایره
  const strokeWidth = 10; // عرض خط دایره
  const circumference = 2 * Math.PI * radius; // محیط دایره
  const dashOffset = circumference - (timeLeft / time) * circumference;

  const navigate = useNavigate();

  // بارگذاری تنظیمات بازی از localStorage
  useEffect(() => {
    const savedSettings = loadGameSettingsHunter();
    if (savedSettings) {
      // setPlayersCount(savedSettings.playersCount);
      setPlayersNames(savedSettings.playersNames); // اسامی بازیکنان را بارگذاری کن
      setTime(savedSettings.time);
      setTimeLeft(savedSettings.timeLeft); // زمان باقی‌مانده را از ذخیره شده بارگذاری می‌کنیم
      setIsNegativeScore(savedSettings.isNegativeScore);
      // setRoundedCount(savedSettings.roundedCount);
      setCurrentPlayer(savedSettings.currentPlayer);
      // setCurrentRound(savedSettings.currentRound);
      setGameStatus(savedSettings.gameStatus);
      setIsStop(savedSettings.gameStatus === "playing" ? false : true);
      setScores(savedSettings.scores);
      setGuessedWords(savedSettings.guessedWords || []); // کلمات حدس زده شده را بارگذاری می‌کنیم
      setCurrentWord(
        savedSettings.currentWord ? savedSettings.currentWord : getRandomWord()
      ); // کلمه جاری را از ذخیره شده بارگذاری می‌کنیم
    }
  }, []);

  // تایمر بازی
  useEffect(() => {
    if (gameStatus === "playing" && !isStop) {
      const savedSettings = loadGameSettingsHunter();
      const interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
          saveGameSettingsHunter({
            playersCount: savedSettings.playersCount,
            playersNames: savedSettings.playersNames,
            time: savedSettings.time,
            timeLeft: timeLeft - 1, // تغییر تایم مونده بازی
            isNegativeScore: savedSettings.isNegativeScore,
            roundedCount: savedSettings.roundedCount,
            currentPlayer: savedSettings.currentPlayer,
            currentRound: savedSettings.currentRound,
            gameStatus: gameStatus,
            scores: scores,
            guessedWords: guessedWords,
            currentWord: currentWord,
          });
        } else {
          clearInterval(interval);
          handleEndGame();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStatus, timeLeft, isStop]);

  // تابع برای دریافت کلمه رندوم از لیست کلمات
  const getRandomWord = () => {
    const remainingWords = words.filter((word) => !guessedWords.includes(word));

    if (remainingWords.length === 0) {
      setGameStatus("paused");

      const savedSettings = loadGameSettingsHunter();
      saveGameSettingsHunter({
        playersCount: savedSettings.playersCount,
        playersNames: savedSettings.playersNames,
        time: savedSettings.time,
        timeLeft: 0,
        isNegativeScore: savedSettings.isNegativeScore,
        roundedCount: savedSettings.roundedCount,
        currentPlayer: savedSettings.currentPlayer,
        currentRound: savedSettings.currentRound,
        gameStatus: "paused",
        scores: scores,
        guessedWords: guessedWords,
        currentWord: currentWord,
      });
      navigate("/HunterScoreBoeard");
      return "پایان کلمات";
    }

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const selectedWord = remainingWords[randomIndex];

    // به محض انتخاب، آن را به guessedWords اضافه کن
    // setGuessedWords((prev) => [...prev, selectedWord]);

    return selectedWord;
  };

  // تعویض کلمه
  const handleChangeWord = () => {
    if (isNegativeScore) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] -= 2; // در حالت منفی امتیاز 2 کم می‌شود
        return newScores;
      });
    } else {
      setSwapWordUsed(false);
    }
    handleNextWord();
  };

  // کلمه جدید
  const handleNextWord = () => {
    setCurrentWord(getRandomWord());

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      playersCount: savedSettings.playersCount,
      playersNames: savedSettings.playersNames,
      time: savedSettings.time,
      timeLeft: timeLeft,
      isNegativeScore: savedSettings.isNegativeScore,
      roundedCount: savedSettings.roundedCount,
      currentPlayer: savedSettings.currentPlayer,
      currentRound: savedSettings.currentRound,
      gameStatus: gameStatus,
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
    });
  };

  // پاسخ درست
  const handleCorrectAnswer = () => {
    if (isNegativeScore) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] += 3; // در حالت منفی 3 امتیاز اضافه می‌شود
        return newScores;
      });
    } else {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] += 1; // در حالت غیر منفی 1 امتیاز اضافه می‌شود
        return newScores;
      });
    }
    setGuessedWords([...guessedWords, currentWord]);
    handleNextWord();
  };

  // پاسخ اشتباه
  const handleIncorrectAnswer = () => {
    if (isNegativeScore) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] -= 1; // در حالت منفی امتیاز 1 کم می‌شود
        return newScores;
      });
    }
    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      playersCount: savedSettings.playersCount,
      playersNames: savedSettings.playersNames,
      time: savedSettings.time,
      timeLeft: timeLeft,
      isNegativeScore: savedSettings.isNegativeScore,
      roundedCount: savedSettings.roundedCount,
      currentPlayer: savedSettings.currentPlayer,
      currentRound: savedSettings.currentRound,
      gameStatus: gameStatus,
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
    });
  };

  // پایان بازی و نمایش جدول امتیازات
  const handleEndGame = () => {
    handlePauseGame();
    navigate("/HunterScoreBoeard", { replace: true });
  };

  // استپ بازی
  const handlePauseGame = () => {
    setIsStop(true);
    setGameStatus("paused");

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      playersCount: savedSettings.playersCount,
      playersNames: savedSettings.playersNames,
      time: savedSettings.time,
      timeLeft: timeLeft,
      isNegativeScore: savedSettings.isNegativeScore,
      roundedCount: savedSettings.roundedCount,
      currentPlayer: savedSettings.currentPlayer,
      currentRound: savedSettings.currentRound,
      gameStatus: "paused",
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
    });
  };

  const handleContinueGame = () => {
    setIsStop(false);
    setGameStatus("playing");

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      playersCount: savedSettings.playersCount,
      playersNames: savedSettings.playersNames,
      time: savedSettings.time,
      timeLeft: timeLeft,
      isNegativeScore: savedSettings.isNegativeScore,
      roundedCount: savedSettings.roundedCount,
      currentPlayer: savedSettings.currentPlayer,
      currentRound: savedSettings.currentRound,
      gameStatus: "playing",
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
    });
  };

  return (
    // <div className="flex flex-col items-center justify-center p-4">
    //   {/* دکمه برای شروع یا توقف بازی */}
    //   <button
    //     onClick={() =>
    //       // setGameStatus(gameStatus === "playing" ? "paused" : "playing")
    //       // handlePauseGame();
    //       handleContinueGame()
    //     }
    //     className="bg-blue-500 text-white p-4 rounded-xl mt-4 hover:bg-blue-700 transition-all duration-300 ease-out">
    //     {gameStatus === "playing" ? "توقف بازی" : "ادامه بازی"}
    //   </button>
    // </div>
    <div className="bg-backgroundcolor w-screen min-h-screen">
      <div className="py-3">
        <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 bg-darkBackgroundcolor rounded-xl">
          <h2 className="text-center text-2xl font-bold">هانتر</h2>
          <button
            className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
            onClick={handlePauseGame}>
            <Icons.stop className={"w-8"} />
          </button>
        </div>
      </div>

      <p className="text-center">نوبت: {playersNames[currentPlayer]}</p>
      <h3 className="text-center pb-2">امتیاز: {scores[currentPlayer]}</h3>
      {/* ------------------------------- MIDDLE CIRCLE ------------------------------- */}
      <div className="flex justify-center items-center">
        <div className="relative w-40 h-40">
          {/* دایره پس‌زمینه */}
          <svg width="100%" height="100%" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#d4bdac"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* دایره پیشرفت تایمر */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#536493"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)" // برای شروع از بالای دایره
            />
            {/* نمایش زمان داخل دایره */}
            <text
              x="50%"
              y="40%"
              textAnchor="middle"
              className="text-2xl font-bold text-gray-800"
              dy=".3em">
              {timeLeft}
            </text>
            <text
              x="50%"
              y="65%"
              textAnchor="middle"
              className="text-md font-bold text-gray-800"
              dy=".3em">
              {currentWord}
            </text>
          </svg>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mt-4">
        <button
          onClick={handleCorrectAnswer}
          className="bg-green-400 text-white text-lg px-6 py-2 rounded-full hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
          پاسخ درست
        </button>
        {isNegativeScore && (
          <button
            onClick={handleIncorrectAnswer}
            className="bg-primary text-white text-lg px-6 py-2 rounded-full hover:bg-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
            پاسخ اشتباه
          </button>
        )}
        {swapWordUsed && (
          <button
            onClick={handleChangeWord}
            className="bg-slowSubPrimary text-white text-lg px-6 py-2 rounded-full hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
            تعویض کلمه
          </button>
        )}
      </div>
      {/* ----------------------------------------- GAME PAUSE ----------------------------------------- */}
      {isStop && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center">
          <div className="bg-backgroundcolor p-3 rounded-3xl">
            <h1 className="text-center text-xl font-bold pb-1">
              بازی استپ خرده است
            </h1>
            <h3 className="text-sm">
              یکی از گزینه های زیر را برای ادامه انتخاب کنید
            </h3>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={handleContinueGame}
                className="bg-primary text-white border-2 text-sm border-primary px-3 py-2 rounded-full mt-4 hover:bg-darkPrimary hover:border-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                ادامه بازی
              </button>
              <button
                onClick={() => {
                  clearGameSettingsHunter();
                  navigate("/HunterGameStarter", { replace: true });
                }}
                className="text-primary border-2 text-sm border-primary py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                شروع مجدد
              </button>
              <button
                onClick={() => {
                  // clearGameSettingsHunter();
                  const savedSettings = loadGameSettingsHunter();
                  saveGameSettingsHunter({
                    playersCount: savedSettings.playersCount,
                    playersNames: savedSettings.playersNames,
                    time: savedSettings.time,
                    timeLeft: savedSettings.timeLeft,
                    isNegativeScore: savedSettings.isNegativeScore,
                    roundedCount: savedSettings.roundedCount,
                    currentPlayer: savedSettings.currentPlayer,
                    currentRound: savedSettings.currentRound,
                    gameStatus: "playing",
                    scores: savedSettings.scores,
                    guessedWords: savedSettings.guessedWords,
                    currentWord: savedSettings.currentWord,
                  });
                  navigate("/OfflineGames", { replace: true });
                }}
                className="text-primary border-2 text-sm border-primary py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                خروج از بازی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
