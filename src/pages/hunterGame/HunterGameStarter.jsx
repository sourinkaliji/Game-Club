import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveGameSettingsHunter,
  loadGameSettingsHunter,
  clearGameSettingsHunter,
} from "../utils";
import { Icons } from "../../components/Icons";

export default function HunterGameStarter() {
  const [playersCount, setPlayersCount] = useState(2);
  const [time, setTime] = useState(60);
  const [isNegativeScore, setIsNegativeScore] = useState(false);
  const [roundedCount, setRoundedCount] = useState(1);

  const [playersNames, setPlayersNames] = useState(["بازیکن 1", "بازیکن 2"]);
  const [isGameSaved, setIsGameSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadGameSettingsHunter();
    if (savedSettings) {
      setIsGameSaved(true);
    } else {
      generatePlayerNames();
    }
  }, []);

  // ایجاد اسم پیش‌فرض بازیکنان
  const generatePlayerNames = () => {
    const names = [];
    for (let i = 1; i <= playersCount; i++) {
      names.push(`بازیکن ${i}`);
    }
    setPlayersNames(names);
  };

  // ذخیره تنظیمات در localStorage
  const saveSettings = () => {
    const updatedNames = playersNames.map((name, index) => {
      return name.trim() === "" ? `بازیکن ${index + 1}` : name;
    });

    const settings = {
      playersCount: playersCount,
      playersNames: updatedNames, // ذخیره نام‌های بازیکنان بررسی‌شده
      time: time,
      timeLeft: time, // زمان باقی‌مانده
      isNegativeScore: isNegativeScore,
      roundedCount: roundedCount,
      currentPlayer: 0, // نوبت بازیکن اول
      currentRound: 0, // نوبت دور
      gameStatus: "playing", // وضعیت بازی
      scores: Array(playersCount).fill(0), // امتیازات اولیه برای هر بازیکن
      guessedWords: "",
      currentWord: "",
    };
    saveGameSettingsHunter(settings); // ذخیره تنظیمات در localStorage
  };

  const handleStartGame = () => {
    if (playersCount > 20) {
      setErrorMessage("حداکثر تعداد بازیکنان 20 نفر است.");
      return;
    }
    if (roundedCount > 20) {
      setErrorMessage("حداکثر تعداد دور بازی 20 دور است.");
      return;
    }
    saveSettings();
    handleContinueGame();
  };

  const handleContinueGame = () => {
    navigate("/HunterGamePage");
  };

  // تابع برای انتخاب زمان بازی
  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  // تابع برای تغییر تعداد بازیکنان
  const handlePlayersCountChange = (e) => {
    const value = Math.min(20, Math.max(2, Number(e.target.value))); // محدودیت بین 2 تا 20
    setPlayersCount(value);
    if (value <= 20) {
      setErrorMessage(""); // پاک کردن پیام خطا
    }
  };

  // تابع برای تغییر تعداد دور بازی
  const handleRoundedCountChange = (e) => {
    const value = Math.min(20, Math.max(1, Number(e.target.value))); // محدودیت بین 1 تا 20
    setRoundedCount(value);
    if (value <= 20) {
      setErrorMessage(""); // پاک کردن پیام خطا
    }
  };

  // تابع برای بررسی و اطمینان از اینکه نام بازیکن خالی نباشد
  const handlePlayerNameChange = (index, name) => {
    const updatedNames = [...playersNames];
    updatedNames[index] = name; // تغییر نام بازیکن
    setPlayersNames(updatedNames);
  };

  return (
    <>
      {/* نمایش پیغام و دکمه‌ها برای ادامه بازی یا شروع بازی جدید */}
      {isGameSaved && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center">
          <div className="bg-primary p-4 rounded-3xl w-70">
            <h3 className="text-center mb-4 text-backgroundcolor font-bold text-xl">
              بازی ذخیره شده است
            </h3>
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <button
                onClick={handleContinueGame}
                className="text-xl font-bold bg-subPrimary text-backgroundcolor p-4 rounded-xl w-full hover:bg-slowSubPrimary transition-all duration-300 ease-out">
                ادامه بازی
              </button>
              <button
                onClick={() => {
                  setIsGameSaved(false);
                  clearGameSettingsHunter();
                }}
                className="text-xl font-bold bg-darkPrimary text-backgroundcolor p-4 rounded-xl w-full hover:bg-primary transition-all duration-300 ease-out">
                بازی جدید
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-backgroundcolor w-screen min-h-screen">
        {/* <h2 className="text-center text-2xl font-bold pt-4 pb-6">
          تنظیمات بازی هانتر
        </h2> */}
        <div className="py-3">
          <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 bg-darkBackgroundcolor rounded-xl">
            <h2 className="text-center text-2xl font-bold">تنظیمات هانتر</h2>
            <Link
              className="flex justify-center items-center gap-1 border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-darkBackgroundcolor hover:bg-backgroundcolor"
              to={"/OfflineGames"}>
              <span>خانه</span>
              <Icons.home className={"w-6 fil fill-black"} />
            </Link>
          </div>
        </div>

        <div className="h-fit flex justify-center items-center">
          <div className="bg-darkBackgroundcolor p-4 rounded-3xl overflow-auto max-h-[90vh] flex flex-col gap-5">
            {/* فرم تنظیمات برای شروع بازی جدید */}
            <div className="text-center">
              <label
                htmlFor="playersCount"
                className="block mb-1 font-bold text-xl">
                تعداد بازیکنان
              </label>
              <input
                type="number"
                id="playersCount"
                value={playersCount}
                onChange={handlePlayersCountChange}
                onBlur={generatePlayerNames}
                min="2"
                max="20"
                className="text-center text-white text-3xl font-bold w-20 border-2 rounded-full px-4 pt-2"
              />
              {errorMessage && (
                <p className="text-red-500 mt-2">{errorMessage}</p>
              )}
            </div>

            {/* انتخاب زمان بازی با استفاده از دکمه‌های radio */}
            <div className="text-center">
              <label htmlFor="time" className="block mb-1 font-bold text-xl">
                زمان بازی
              </label>
              <div className="flex justify-around items-center">
                <button
                  className={`px-4 py-2 rounded-full ${
                    time === 60
                      ? "bg-primary border-primary"
                      : "bg-darkBackgroundcolor border-white"
                  } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                  onClick={() => handleTimeChange(60)}>
                  60 ثانیه
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${
                    time === 90
                      ? "bg-primary border-primary"
                      : "bg-darkBackgroundcolor border-white"
                  } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                  onClick={() => handleTimeChange(90)}>
                  90 ثانیه
                </button>
                <button
                  className={`px-4 py-2 rounded-full ${
                    time === 120
                      ? "bg-primary border-primary"
                      : "bg-darkBackgroundcolor border-white"
                  } hover:bg-darkPrimary border-2 font-bold text-white text-md transition-all duration-300`}
                  onClick={() => handleTimeChange(120)}>
                  120 ثانیه
                </button>
              </div>
            </div>

            {/* انتخاب نوع بازی با استفاده از دکمه‌های radio */}
            <div className="flex justify-around items-center">
              <div className="text-center">
                <label htmlFor="time" className="block mb-1 font-bold text-xl">
                  نوع بازی
                </label>
                <div className="flex justify-center items-center">
                  <button
                    className={`${
                      isNegativeScore === false
                        ? "border-white"
                        : "bg-primary border-primary"
                    } text-xl font-bold p-2 w-30 rounded-full border-2 hover:bg-darkPrimary text-white transition-all duration-300`}
                    onClick={() =>
                      setIsNegativeScore(
                        isNegativeScore === false ? true : false
                      )
                    }>
                    {isNegativeScore === false ? "غیر منفی" : "منفی"}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <label
                  htmlFor="playersCount"
                  className="block mb-1 font-bold text-xl">
                  تعداد دور
                </label>
                <input
                  type="number"
                  id="playersCount"
                  value={roundedCount}
                  onChange={handleRoundedCountChange}
                  // onBlur={generatePlayerNames}
                  min="1"
                  max="20"
                  className="text-center text-white text-3xl font-bold w-30 border-2 rounded-full px-2 pt-2"
                />
              </div>
            </div>

            {/* اسم بازیکنان */}
            <div className="text-center">
              <h3 className="mb-1 font-bold text-xl">اسامی بازیکنان</h3>
              <ul className="grid grid-cols-2 gap-2">
                {playersNames.map((name, index) => (
                  <li key={index}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        handlePlayerNameChange(index, e.target.value)
                      }
                      className="w-35 border-2 rounded-3xl px-2 py-1"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleStartGame}
              className="mt-2 font-bold text-xl bg-primary text-white p-4 rounded-3xl w-full hover:bg-darkPrimary transition-all duration-300 ease-out">
              شروع بازی
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
