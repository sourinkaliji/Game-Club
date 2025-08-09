// SpyGame.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveGameSettingsSpy,
  loadGameSettingsSpy,
  clearGameSettingsSpy,
} from "./../utils";
import { Icons } from "../../components/Icons";

const words = ["سیب", "درخت", "آسمان", "کوه", "کتاب"];

export default function SpyGame() {
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);

  const [duration, setDuration] = useState(60);
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [word, setWord] = useState("");
  const [showWord, setShowWord] = useState(false);
  const [spyIndexes, setSpyIndexes] = useState([]);
  const [gameStatus, setGameStatus] = useState(null); //reveal | playing | stop | end

  const navigate = useNavigate();

  const radius = 50; // شعاع دایره
  const strokeWidth = 10; // عرض خط دایره
  const circumference = 2 * Math.PI * radius; // محیط دایره
  const dashOffset = circumference - (countdown / duration) * circumference;

  useEffect(() => {
    const savedSettings = loadGameSettingsSpy();
    if (savedSettings) {
      setPlayers(savedSettings.players);
      setSpies(savedSettings.spies);
      setDuration(savedSettings.duration);
      setCountdown(savedSettings.countdown);

      const chosenWord = words[Math.floor(Math.random() * words.length)];
      const finalWord = savedSettings.word ? savedSettings.word : chosenWord;
      setWord(finalWord);

      const spySet = new Set();
      let spyArray;
      if (savedSettings.spyIndexes) {
        spyArray = savedSettings.spyIndexes;
      } else {
        const tempSet = new Set();
        while (tempSet.size < savedSettings.spies) {
          tempSet.add(Math.floor(Math.random() * savedSettings.players));
        }
        spyArray = Array.from(tempSet);
      }
      setSpyIndexes(spyArray);

      const revealedInfo = Array.from({ length: players }, (_, i) =>
        spySet.has(i) ? null : chosenWord
      );
      setRevealed(
        savedSettings.revealed ? savedSettings.revealed : revealedInfo
      );

      setGameStatus(savedSettings.gameStatus);
      //   setPhase("setup");
    }
  }, []);

  useEffect(() => {
    if (gameStatus === "playing" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => {
          const newTime = c - 1;
          saveGameSettingsSpy({
            players: players,
            spies: spies,
            duration: duration,
            countdown: newTime,
            word: word,
            spyIndexes: spyIndexes,
            gameStatus: "playing",
          });
          return newTime;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (gameStatus === "playing" && countdown === 0) {
      setGameStatus("end");
      setCountdown(0);
      setCurrent(0);
      setShowWord(false);
      const savedSettings = loadGameSettingsSpy();
      saveGameSettingsSpy({
        players: savedSettings.players,
        spies: savedSettings.spies,
        duration: savedSettings.duration,
        countdown: countdown,
        word: word,
        spyIndexes: spyIndexes,
        gameStatus: "end",
        revealed: revealed,
      });
    }
  }, [countdown, gameStatus]);

  const handleRevealClick = () => setShowWord(true);

  const nextPlayer = () => {
    if (current + 1 < players) {
      setCurrent((c) => c + 1);
      setShowWord(false);
    } else {
      const savedSettings = loadGameSettingsSpy();
      saveGameSettingsSpy({
        players: savedSettings.players,
        spies: savedSettings.spies,
        duration: savedSettings.duration,
        countdown: countdown,
        word: word,
        spyIndexes: spyIndexes,
        gameStatus: "playing",
        revealed: revealed,
      });
      setGameStatus("playing");
    }
  };

  const pauseGame = () => {
    setGameStatus("stop");
    const savedSettings = loadGameSettingsSpy();
    saveGameSettingsSpy({
      players: savedSettings.players,
      spies: savedSettings.spies,
      duration: savedSettings.duration,
      countdown: countdown,
      word: word,
      spyIndexes: spyIndexes,
      gameStatus: "stop",
      revealed: revealed,
    });
  };

  const resumeGame = () => {
    setGameStatus("playing");
    const savedSettings = loadGameSettingsSpy();
    saveGameSettingsSpy({
      players: savedSettings.players,
      spies: savedSettings.spies,
      duration: savedSettings.duration,
      countdown: countdown,
      word: word,
      spyIndexes: spyIndexes,
      gameStatus: "playing",
      revealed: revealed,
    });
  };

  const resetGame = () => {
    const savedSettings = loadGameSettingsSpy();
    // ---------------------------------------------
    setCountdown(savedSettings.duration);

    const chosenWord = words[Math.floor(Math.random() * words.length)];
    setWord(chosenWord);

    const spySet = new Set();
    while (spySet.size < spies) spySet.add(Math.floor(Math.random() * players));
    const spyArray = Array.from(spySet);
    setSpyIndexes(spyArray);

    const revealedInfo = Array.from({ length: players }, (_, i) =>
      spySet.has(i) ? null : chosenWord
    );
    setRevealed(revealedInfo);

    setGameStatus("reveal");
    setCurrent(0);
    setShowWord(false);
    // ---------------------------------------------
    saveGameSettingsSpy({
      players: savedSettings.players,
      spies: savedSettings.spies,
      duration: savedSettings.duration,
      countdown: savedSettings.duration,
      word: chosenWord,
      spyIndexes: spyArray,
      gameStatus: "reveal",
      revealed: revealedInfo,
    });
  };

  return (
    <div
      className="relative w-screen min-h-screen bg-backgroundcolor"
      //p-6 flex flex-col gap-4 items-center
    >
      {gameStatus === "reveal" ? (
        <div className="text-center pt-3">
          <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 mb-3 bg-darkBackgroundcolor rounded-xl">
            <h2 className="text-center text-2xl font-bold">جاسوس</h2>
            <Link
              className="flex justify-center items-center gap-1 border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
              to={"/OfflineGames"}>
              <span>خانه</span>
              <Icons.home className={"w-6 fil fill-black"} />
            </Link>
          </div>

          <p>بازیکن {current + 1}</p>
          <p className="text-xl mt-2">
            {!showWord
              ? "👁️ روی دکمه کلیک کن تا ببینی!"
              : revealed[current]
              ? `کلمه: ${revealed[current]}`
              : "❗ تو جاسوسی!"}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={!showWord ? handleRevealClick : nextPlayer}>
            {!showWord
              ? "نمایش کلمه"
              : current + 1 === players
              ? "شروع بازی"
              : "بعدی"}
          </button>
        </div>
      ) : gameStatus === "end" ? (
        <div className="text-center pt-3">
          <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 mb-3 bg-darkBackgroundcolor rounded-xl">
            <h2 className="text-center text-2xl font-bold">جاسوس</h2>
            <Link
              className="flex justify-center items-center gap-1 border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
              to={"/OfflineGames"}>
              <span>خانه</span>
              <Icons.home className={"w-6 fil fill-black"} />
            </Link>
          </div>

          <p className="text-xl">🎯 بازی تمام شد!</p>
          <p className="mt-2">🕵️ جاسوس‌ها:</p>
          <ul className="mt-1">
            {spyIndexes.map((index) => (
              <li key={index}>بازیکن {index + 1}</li>
            ))}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
            onClick={resetGame}>
            بازی مجدد
          </button>
          <button
            onClick={() => {
              navigate("/OfflineGames", { replace: true });
              clearGameSettingsSpy();
            }}
            className="text-primary border-2 border-primary py-2 px-4 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
            خروج از بازی
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center pt-3">
            <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 mb-3 bg-darkBackgroundcolor rounded-xl">
              <h2 className="text-center text-2xl font-bold">جاسوس</h2>
              <button
                className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
                onClick={pauseGame}>
                <Icons.stop className={"w-8"} />
              </button>
            </div>

            {/* ------------------------------- MIDDLE CIRCLE ------------------------------- */}
            <div className="flex justify-center items-center">
              <div className="relative w-40 h-40">
                {/* دایره پس‌زمینه */}
                <svg width="100%" height="100%" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#d4bdac" // Tailwind gray-200
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* دایره پیشرفت تایمر */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#536493" // رنگ سبز برای پیشرفت
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
                    y="50%"
                    textAnchor="middle"
                    className="text-2xl font-bold text-gray-800"
                    dy=".3em">
                    {countdown}
                  </text>
                </svg>
              </div>
            </div>
            {/* ----------------------------------------------------- */}

            <div className="flex flex-col items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setGameStatus("end");
                  const savedSettings = loadGameSettingsSpy();
                  saveGameSettingsSpy({
                    players: savedSettings.players,
                    spies: savedSettings.spies,
                    duration: savedSettings.duration,
                    countdown: countdown,
                    word: word,
                    spyIndexes: spyIndexes,
                    gameStatus: "end",
                    revealed: revealed,
                  });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded">
                جاسوس پیدا شد!
              </button>
            </div>
          </div>
          {/* ----------------------------------------- GAME PAUSE ----------------------------------------- */}
          {gameStatus === "stop" && (
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
                    onClick={() => resumeGame()}
                    className="bg-primary text-white text-sm border-2 border-primary px-3
                  py-2 rounded-full mt-4 hover:bg-darkPrimary
                  hover:border-darkPrimary hover:scale-105 transition-all
                  duration-300 ease-out">
                    ادامه بازی
                  </button>
                  <button
                    onClick={() => {
                      resetGame();
                    }}
                    className="text-primary border-2 border-primary text-sm py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
                    شروع مجدد
                  </button>
                  <button
                    onClick={() => {
                      navigate("/OfflineGames", { replace: true });
                      const savedSettings = loadGameSettingsSpy();
                      saveGameSettingsSpy({
                        players: savedSettings.players,
                        spies: savedSettings.spies,
                        duration: savedSettings.duration,
                        countdown: countdown,
                        word: word,
                        spyIndexes: spyIndexes,
                        gameStatus: "playing",
                        revealed: revealed,
                      });
                    }}
                    className="text-primary border-2 border-primary text-sm py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
                    خروج از بازی
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
