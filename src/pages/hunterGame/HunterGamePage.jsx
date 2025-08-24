import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveGameSettingsHunter,
  loadGameSettingsHunter,
  clearGameSettingsHunter,
} from "../utils";
import { Icons } from "../../components/Icons";
import { getSelectedWords } from "./wordCategories";

// ---------------------------------------------------------------
// وقتی بازی رفرش میشه. دکمه تعویض در حالت بازی بدون منفی برمیگرده
// ---------------------------------------------------------------
export default function GamePage() {
  const [availableWords, setAvailableWords] = useState([]);
  const [playersNames, setPlayersNames] = useState([]);
  const [time, setTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isNegativeScore, setIsNegativeScore] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [scores, setScores] = useState([0, 0]);
  const [guessedWords, setGuessedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [isStop, setIsStop] = useState(false);
  const [swapWordUsed, setSwapWordUsed] = useState(true);

  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (timeLeft / time) * circumference;
  const navigate = useNavigate();

  // بارگذاری تنظیمات بازی از localStorage
  useEffect(() => {
    const savedSettings = loadGameSettingsHunter();
    if (savedSettings) {
      // اول کلمات رو بارگیری کن
      const selectedWords = getSelectedWords(
        savedSettings.selectedCategories || ["animals", "food"]
      );
      setAvailableWords(selectedWords);

      // بعد بقیه تنظیمات رو بارگیری کن
      setPlayersNames(savedSettings.playersNames);
      setTime(savedSettings.time);
      setTimeLeft(savedSettings.timeLeft);
      setIsNegativeScore(savedSettings.isNegativeScore);
      setCurrentPlayer(savedSettings.currentPlayer);
      setGameStatus(savedSettings.gameStatus);
      setIsStop(savedSettings.gameStatus === "playing" ? false : true);
      setScores(savedSettings.scores);
      setGuessedWords(savedSettings.guessedWords || []);

      // در نهایت کلمه جاری رو تنظیم کن
      if (savedSettings.currentWord) {
        setCurrentWord(savedSettings.currentWord);
      } else {
        // اگر کلمه ذخیره نشده، یکی انتخاب کن
        const randomWord = getRandomWordFromList(
          selectedWords,
          savedSettings.guessedWords || []
        );
        setCurrentWord(randomWord);
      }

      // تنظیم swapWordUsed بر اساس نوع بازی
      if (!savedSettings.isNegativeScore) {
        setSwapWordUsed(
          savedSettings.swapWordUsed !== undefined
            ? savedSettings.swapWordUsed
            : true
        );
      }
    }
  }, []);

  // تابع کمکی برای دریافت کلمه رندوم
  const getRandomWordFromList = (wordsList, usedWords) => {
    const remainingWords = wordsList.filter(
      (word) => !usedWords.includes(word)
    );

    if (remainingWords.length === 0) {
      return "پایان کلمات";
    }

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    return remainingWords[randomIndex];
  };

  // تابع برای دریافت کلمه رندوم از لیست کلمات
  const getRandomWord = () => {
    const remainingWords = availableWords.filter(
      (word) => !guessedWords.includes(word)
    );

    if (remainingWords.length === 0) {
      setGameStatus("paused");

      const savedSettings = loadGameSettingsHunter();
      saveGameSettingsHunter({
        ...savedSettings,
        timeLeft: 0,
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

    return selectedWord;
  };

  // تعویض کلمه
  const handleChangeWord = () => {
    if (isNegativeScore) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] -= 2;
        return newScores;
      });
    } else {
      setSwapWordUsed(false);
    }
    handleNextWord();
  };

  // کلمه جدید
  const handleNextWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      ...savedSettings,
      timeLeft: timeLeft,
      gameStatus: gameStatus,
      scores: scores,
      guessedWords: guessedWords,
      currentWord: newWord,
      swapWordUsed: swapWordUsed, // ذخیره وضعیت دکمه تعویض
    });
  };

  // پاسخ درست
  const handleCorrectAnswer = () => {
    if (isNegativeScore) {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] += 3;
        return newScores;
      });
    } else {
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentPlayer] += 1;
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
        newScores[currentPlayer] -= 1;
        return newScores;
      });
    }

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      ...savedSettings,
      timeLeft: timeLeft,
      gameStatus: gameStatus,
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
      swapWordUsed: swapWordUsed,
    });
  };

  // تایمر بازی
  useEffect(() => {
    if (gameStatus === "playing" && !isStop && availableWords.length > 0) {
      const interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);

          const savedSettings = loadGameSettingsHunter();
          saveGameSettingsHunter({
            ...savedSettings,
            timeLeft: timeLeft - 1,
            gameStatus: gameStatus,
            scores: scores,
            guessedWords: guessedWords,
            currentWord: currentWord,
            swapWordUsed: swapWordUsed,
          });
        } else {
          clearInterval(interval);
          handleEndGame();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStatus, timeLeft, isStop, availableWords]);

  const handleEndGame = () => {
    handlePauseGame();
    navigate("/HunterScoreBoeard", { replace: true });
  };

  const handlePauseGame = () => {
    setIsStop(true);
    setGameStatus("paused");

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      ...savedSettings,
      timeLeft: timeLeft,
      gameStatus: "paused",
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
      swapWordUsed: swapWordUsed,
    });
  };

  const handleContinueGame = () => {
    setIsStop(false);
    setGameStatus("playing");

    const savedSettings = loadGameSettingsHunter();
    saveGameSettingsHunter({
      ...savedSettings,
      timeLeft: timeLeft,
      gameStatus: "playing",
      scores: scores,
      guessedWords: guessedWords,
      currentWord: currentWord,
      swapWordUsed: swapWordUsed,
    });
  };

  return (
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

      {/* دایره تایمر */}
      <div className="flex justify-center items-center">
        <div className="relative w-50 h-50">
          <svg width="100%" height="100%" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#d4bdac"
              strokeWidth={strokeWidth}
              fill="none"
            />
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
              transform="rotate(-90 60 60)"
            />
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
              className="text-sm font-bold text-gray-800"
              dy=".3em">
              {currentWord}
            </text>
          </svg>
        </div>
      </div>

      {/* دکمه‌های بازی */}
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

      {/* مودال توقف بازی */}
      {isStop && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center">
          <div className="bg-backgroundcolor p-3 rounded-3xl">
            <h1 className="text-center text-xl font-bold pb-1">
              بازی استپ شده است
            </h1>
            <h3 className="text-sm">
              یکی از گزینه‌های زیر را برای ادامه انتخاب کنید
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
                  const savedSettings = loadGameSettingsHunter();
                  saveGameSettingsHunter({
                    ...savedSettings,
                    gameStatus: "playing",
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
