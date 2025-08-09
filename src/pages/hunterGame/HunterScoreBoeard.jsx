import React, { useEffect, useState } from "react";
import {
  loadGameSettingsHunter,
  saveGameSettingsHunter,
  clearGameSettingsHunter,
} from "../utils";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "../../components/Icons";

export default function HunterScoreBoeard() {
  const [playersCount, setPlayersCount] = useState(2); // نام‌های بازیکنان
  const [playersNames, setPlayersNames] = useState([]); // نام‌های بازیکنان
  const [currentPlayer, setCurrentPlayer] = useState(0); // نوبت بازیکن
  const [scores, setScores] = useState([0, 0]); // امتیازات بازیکنان
  const [roundedCount, setRoundedCount] = useState(1); // تعداد دور بازی
  const [currentRound, setCurrentRound] = useState(0); // دور درحال بازی

  const [nextPlayer, setNextPlayer] = useState(0);
  const [newRound, setNewRound] = useState(0);
  const [endGame, setEndGame] = useState(false); // پایان بازی

  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadGameSettingsHunter(); // بارگذاری تنظیمات بازی از localStorage
    if (savedSettings) {
      setPlayersCount(savedSettings.playersCount);
      setPlayersNames(savedSettings.playersNames); // اسامی بازیکنان را بارگذاری کن
      setCurrentPlayer(savedSettings.currentPlayer);
      setScores(savedSettings.scores);
      setRoundedCount(savedSettings.roundedCount);
      setCurrentRound(savedSettings.currentRound);
    }

    setNextPlayer(
      (savedSettings.currentPlayer + 1) % savedSettings.playersCount
    );
    setNewRound(savedSettings.currentRound);

    // اگر بازیکن فعلی آخرین بازیکن دور است و حالا نوبت اول شروع میشه => یعنی یه دور کامل شده
    if (
      savedSettings.currentRound === 0 &&
      savedSettings.currentPlayer === savedSettings.playersCount - 1
    ) {
      setNewRound(savedSettings.currentRound + 1);
      // اگر دور بعدی بیشتر از تعداد کل دورها بود، یعنی بازی تموم شده
      if (savedSettings.currentRound + 1 >= savedSettings.roundedCount) {
        setEndGame(true);
        // alert("🎉 بازی تمام شد!");
        // console.log("Game Over!");
        return;
      }
      setCurrentRound(newRound);
    }
    setCurrentPlayer(nextPlayer);
    setCurrentPlayer(nextPlayer);
  }, []);

  // تغییر نوبت بازیکنان
  const handleNextPlayer = () => {
    if (endGame === false) {
      const savedSettings = loadGameSettingsHunter(); // بارگذاری تنظیمات بازی از localStorage
      saveGameSettingsHunter({
        playersCount: savedSettings.playersCount,
        playersNames: savedSettings.playersNames,
        time: savedSettings.time,
        timeLeft: savedSettings.time,
        isNegativeScore: savedSettings.isNegativeScore,
        roundedCount: savedSettings.roundedCount,
        currentPlayer: nextPlayer,
        currentRound: newRound,
        gameStatus: "playing",
        scores: savedSettings.scores,
        guessedWords: savedSettings.guessedWords,
        currentWord: "",
      });
      navigate("/HunterGamePage", { replace: true });
    } else {
      clearGameSettingsHunter();
      navigate("/HunterGameStarter", { replace: true });
    }
  };

  const getWinner = () => {
    const maxScore = Math.max(...scores);
    const winnerIndex = scores.indexOf(maxScore);
    return playersNames[winnerIndex];
  };

  return (
    <div className="bg-backgroundcolor w-screen min-h-screen">
      <div className="py-3">
        <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 bg-darkBackgroundcolor rounded-xl">
          <h2 className="text-center text-2xl font-bold">جدول امتیازات</h2>
          {/* <button
            className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
            onClick={() => {
              clearGameSettingsHunter();
              navigate("/HunterGameStarter", { replace: true });
            }}>
            <span>برگشت</span>
            <Icons.arrow className={"w-6 rotate-180"} />
          </button> */}
          <Link
            className="flex justify-center items-center gap-1 border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
            to={"/OfflineGames"}>
            <span>خانه</span>
            <Icons.home className={"w-6 fil fill-black"} />
          </Link>
        </div>
      </div>

      {endGame && (
        <div className="text-center mt-4">
          <h3 className="text-2xl font-bold">برنده بازی: {getWinner()}</h3>
        </div>
      )}
      <div className="flex justify-center items-center flex-col">
        {/* <h2 className="text-2xl font-bold text-center pt-2">جدول امتیازات</h2> */}
        <div className="mt-4 text-center">
          <div className="flex justify-center items-center gap-5 border-b-2 mb-3">
            <h1 className="w-10 text-center">شماره</h1>
            <h1 className="w-30 text-center">نام بازیکن/تیم</h1>
            <h1 className="w-10 text-center">امتیاز</h1>
          </div>
          {playersNames.map((name, index) => (
            <div
              className="flex justify-center items-center gap-5 bg-darkBackgroundcolor p-1 my-2 rounded-3xl"
              key={index}>
              <h3 className="w-10 text-center">{index + 1}</h3>
              <h3 className="w-30 text-center">{name}</h3>
              <h3 className="w-10 text-center">{scores[index]}</h3>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center items-center gap-5">
          <button
            onClick={handleNextPlayer}
            className={`${
              endGame
                ? "bg-primary border-primary hover:bg-darkPrimary hover:border-darkPrimary"
                : "bg-slowSubPrimary border-slowSubPrimary hover:bg-subPrimary hover:border-subPrimary"
            } text-white px-4 py-2 rounded-full border-2 transition-all hover:scale-105 duration-300 ease-out`}>
            {endGame ? "پایان بازی" : "نوبت بعدی"}
          </button>
          {!endGame && (
            <button
              onClick={() => {
                clearGameSettingsHunter();
                navigate("/HunterGameStarter", { replace: true });
              }}
              className="text-primary border-2 border-primary py-2 px-4 rounded-full hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out">
              خروج از بازی
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
