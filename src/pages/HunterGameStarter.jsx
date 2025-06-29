import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HunterGameStarter() {
  const [playersCount, setPlayersCount] = useState(2); // تعداد بازیکنان
  const [time, setTime] = useState(60); // زمان بازی
  const [isNegativeScore, setIsNegativeScore] = useState(false); // نوع بازی
  const [playersNames, setPlayersNames] = useState([]); // اسم بازیکنان
  const navigate = useNavigate();

  useEffect(() => {
    // اگر داده‌ها قبلاً در لوکال استوریج ذخیره شده‌اند، آنها را بارگذاری کن
    const savedSettings = JSON.parse(
      localStorage.getItem("hunterGameSettings")
    );
    if (savedSettings) {
      setPlayersCount(savedSettings.playersCount);
      setTime(savedSettings.time);
      setIsNegativeScore(savedSettings.isNegativeScore);
      setPlayersNames(savedSettings.playersNames);
    }
  }, []);

  // ایجاد اسم بازیکنان
  const generatePlayerNames = () => {
    const names = [];
    for (let i = 1; i <= playersCount; i++) {
      names.push(`بازیکن ${i}`);
    }
    setPlayersNames(names);
  };

  // ذخیره تنظیمات در localStorage
  const saveSettings = () => {
    const settings = {
      playersCount,
      time,
      isNegativeScore,
      playersNames,
    };
    localStorage.setItem("hunterGameSettings", JSON.stringify(settings));
  };

  const handleStartGame = () => {
    saveSettings();
    navigate("/game"); // بعد از ذخیره تنظیمات، به صفحه بازی برو
  };

  return (
    <div className="p-8 bg-backgroundcolor w-screen h-screen">
      <h2 className="text-center mb-8 text-2xl font-bold">
        تنظیمات بازی هانتر
      </h2>

      {/* انتخاب تعداد بازیکنان */}
      <div className="mb-4">
        <label htmlFor="playersCount" className="block">
          تعداد بازیکنان
        </label>
        <input
          type="number"
          id="playersCount"
          value={playersCount}
          onChange={(e) => setPlayersCount(Number(e.target.value))}
          onBlur={generatePlayerNames}
          min="2"
          className="border rounded px-4 py-2"
        />
      </div>

      {/* انتخاب زمان بازی */}
      <div className="mb-4">
        <label htmlFor="time" className="block">
          زمان بازی
        </label>
        <select
          id="time"
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="border rounded px-4 py-2">
          <option value={60}>60 ثانیه</option>
          <option value={90}>90 ثانیه</option>
          <option value={120}>120 ثانیه</option>
        </select>
      </div>

      {/* انتخاب نوع امتیاز (منفی یا غیر منفی) */}
      <div className="mb-4">
        <label htmlFor="scoreType" className="block">
          نوع امتیاز
        </label>
        <select
          id="scoreType"
          value={isNegativeScore ? "negative" : "positive"}
          onChange={(e) => setIsNegativeScore(e.target.value === "negative")}
          className="border rounded px-4 py-2">
          <option value="positive">غیر منفی</option>
          <option value="negative">منفی</option>
        </select>
      </div>

      {/* نمایش اسامی بازیکنان */}
      <div className="mb-4">
        <h3>اسامی بازیکنان</h3>
        <ul>
          {playersNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>

      {/* دکمه شروع بازی */}
      <button
        onClick={handleStartGame}
        className="bg-primary text-white p-4 rounded-xl w-full hover:bg-darkPrimary transition-all duration-300 ease-out">
        شروع بازی
      </button>
    </div>
  );
}
