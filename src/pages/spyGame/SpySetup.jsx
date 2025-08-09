import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveGameSettingsSpy,
  loadGameSettingsSpy,
  clearGameSettingsSpy,
} from "./../utils";
import { Icons } from "../../components/Icons";

const SpySetup = () => {
  const [duration, setDuration] = useState(1);
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);

  const [newGame, setNewGame] = useState(true);
  const navigate = useNavigate();

  const startGame = () => {
    if (players > 0 && spies <= players && duration > 0) {
      saveGameSettingsSpy({
        players: players,
        spies: spies,
        duration: duration * 60,
        countdown: duration * 60,
        word: null,
        spyIndexes: null,
        gameStatus: "reveal",
        revealed: null,
      });
      navigate("/SpyGame");
    } else {
      alert("مقادیر وارد شده معتبر نیستند");
    }
  };

  useEffect(() => {
    const savedSettings = loadGameSettingsSpy();
    if (savedSettings) {
      setNewGame(false);
    }
  }, []);

  const increment = (setter, value, max = 100) => {
    setter(Math.min(value + 1, max));
  };

  const decrement = (setter, value, min = 1) => {
    setter(Math.max(value - 1, min));
  };

  useEffect(() => {
    if (spies > players) {
      setSpies(players);
    }
  }, [players]);

  return (
    <>
      {!newGame && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-[300px] text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              بازی ذخیره شده است
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/SpyGame")}
                className="bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700 transition">
                ادامه بازی
              </button>
              <button
                onClick={() => {
                  setNewGame(true);
                  clearGameSettingsSpy();
                }}
                className="bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-900 transition">
                بازی جدید
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-backgroundcolor text-black w-screen flex flex-col justify-between gap-6">
        <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 mt-3 bg-darkBackgroundcolor rounded-xl">
          <h2 className="text-center text-2xl font-bold">جاسوس</h2>
          <Link
            className="flex justify-center items-center gap-1 border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
            to={"/OfflineGames"}>
            <span>خانه</span>
            <Icons.home className={"w-6 fil fill-black"} />
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">🎭 جاسوس</h1>
            <p className="text-primary text-sm mt-2">
              برای آموزش بازی کلیک کنید!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* تعداد بازیکن */}
            <div className="flex items-center justify-between w-64 bg-subPrimary text-white rounded-xl">
              <button
                className="size-10 cursor-pointer"
                onClick={() => increment(setPlayers, players)}>
                +
              </button>
              <span>تعداد بازیکن: {players}</span>
              <button
                className="size-10 cursor-pointer"
                onClick={() => decrement(setPlayers, players, 3)}>
                -
              </button>
            </div>

            {/* تعداد جاسوس */}
            <div className="flex items-center justify-between w-64 bg-subPrimary text-white rounded-xl">
              <button
                className="size-10 cursor-pointer"
                onClick={() => increment(setSpies, spies, players)}>
                +
              </button>
              <span>تعداد جاسوس: {spies}</span>
              <button
                className="size-10 cursor-pointer"
                onClick={() => decrement(setSpies, spies, 1)}>
                -
              </button>
            </div>

            {/* زمان */}
            <div className="flex items-center justify-between w-64 bg-subPrimary text-white rounded-xl">
              <button
                className="size-10 cursor-pointer"
                onClick={() => increment(setDuration, duration)}>
                +
              </button>
              <span>زمان: {duration}</span>
              <button
                className="size-10 cursor-pointer"
                onClick={() => decrement(setDuration, duration, 1)}>
                -
              </button>
            </div>
          </div>

          {/* دکمه شروع بازی */}
          <button
            onClick={startGame}
            className="mt-4 w-64 bg-primary py-3 rounded-xl text-white text-lg hover:bg-darkPrimary hover:scale-105 transition cursor-pointer">
            شروع بازی
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default SpySetup;
