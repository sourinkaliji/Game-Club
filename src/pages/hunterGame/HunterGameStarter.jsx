import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveGameSettingsHunter,
  loadGameSettingsHunter,
  clearGameSettingsHunter,
} from "../utils";
import { Icons } from "../../components/Icons";
import {
  wordCategories,
  loadWordCategories,
  saveWordCategories,
  getSelectedWords,
} from "./wordCategories";
import MyListManager from "./MyListManager";

export default function HunterGameStarter() {
  const [playersCount, setPlayersCount] = useState(2);
  const [time, setTime] = useState(60);
  const [isNegativeScore, setIsNegativeScore] = useState(false);
  const [roundedCount, setRoundedCount] = useState(1);
  const [playersNames, setPlayersNames] = useState(["بازیکن 1", "بازیکن 2"]);
  const [isGameSaved, setIsGameSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // استیت‌های جدید برای دسته‌بندی کلمات
  const [selectedCategories, setSelectedCategories] = useState([
    "animals",
    "food",
  ]);
  const [categories, setCategories] = useState(wordCategories);
  const [showMyListManager, setShowMyListManager] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadGameSettingsHunter();
    const loadedCategories = loadWordCategories();
    setCategories(loadedCategories);

    if (savedSettings) {
      setIsGameSaved(true);
      // بارگیری دسته‌بندی‌های انتخاب شده
      if (savedSettings.selectedCategories) {
        setSelectedCategories(savedSettings.selectedCategories);
      }
    } else {
      generatePlayerNames();
    }
  }, []);

  const generatePlayerNames = () => {
    const names = [];
    for (let i = 1; i <= playersCount; i++) {
      names.push(`بازیکن ${i}`);
    }
    setPlayersNames(names);
  };

  // تابع برای تغییر انتخاب دسته‌بندی
  const handleCategoryToggle = (categoryKey) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryKey)) {
        return prev.filter((key) => key !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
  };

  // تابع برای مدیریت لیست شخصی
  const handleMyListWordsChange = (newWords) => {
    const updatedCategories = {
      ...categories,
      myList: {
        ...categories.myList,
        words: newWords,
      },
    };
    setCategories(updatedCategories);
    saveWordCategories(updatedCategories);
  };

  const saveSettings = () => {
    const updatedNames = playersNames.map((name, index) => {
      return name.trim() === "" ? `بازیکن ${index + 1}` : name;
    });

    const settings = {
      playersCount: playersCount,
      playersNames: updatedNames,
      time: time,
      timeLeft: time,
      isNegativeScore: isNegativeScore,
      roundedCount: roundedCount,
      currentPlayer: 0,
      currentRound: 0,
      gameStatus: "playing",
      scores: Array(playersCount).fill(0),
      guessedWords: [],
      currentWord: "",
      selectedCategories: selectedCategories, // اضافه کردن دسته‌بندی‌های انتخاب شده
    };
    saveGameSettingsHunter(settings);
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
    if (selectedCategories.length === 0) {
      setErrorMessage("حداقل یک دسته‌بندی انتخاب کنید.");
      return;
    }

    // بررسی اینکه آیا کلمات کافی وجود دارد
    const selectedWords = getSelectedWords(selectedCategories);
    if (selectedWords.length === 0) {
      setErrorMessage("دسته‌بندی‌های انتخاب شده کلمه‌ای ندارند.");
      return;
    }

    saveSettings();
    handleContinueGame();
  };

  const handleContinueGame = () => {
    navigate("/HunterGamePage");
  };

  const handleTimeChange = (selectedTime) => {
    setTime(selectedTime);
  };

  const handlePlayersCountChange = (e) => {
    const value = Math.min(20, Math.max(2, Number(e.target.value)));
    setPlayersCount(value);
    if (value <= 20) {
      setErrorMessage("");
    }
  };

  const handleRoundedCountChange = (e) => {
    const value = Math.min(20, Math.max(1, Number(e.target.value)));
    setRoundedCount(value);
    if (value <= 20) {
      setErrorMessage("");
    }
  };

  const handlePlayerNameChange = (index, name) => {
    const updatedNames = [...playersNames];
    updatedNames[index] = name;
    setPlayersNames(updatedNames);
  };

  return (
    <>
      {/* مدیریت لیست شخصی */}
      {showMyListManager && (
        <MyListManager
          myWords={categories.myList.words}
          onWordsChange={handleMyListWordsChange}
          onClose={() => setShowMyListManager(false)}
        />
      )}

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
            {/* تعداد بازیکنان */}
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
            </div>

            {/* انتخاب زمان بازی */}
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

            {/* انتخاب نوع بازی و تعداد دور */}
            <div className="flex justify-around items-center">
              <div className="text-center">
                <label
                  htmlFor="gameType"
                  className="block mb-1 font-bold text-xl">
                  نوع بازی
                </label>
                <div className="flex justify-center items-center">
                  <button
                    className={`${
                      isNegativeScore === false
                        ? "border-white"
                        : "bg-primary border-primary"
                    } text-xl font-bold p-2 w-30 rounded-full border-2 hover:bg-darkPrimary text-white transition-all duration-300`}
                    onClick={() => setIsNegativeScore(!isNegativeScore)}>
                    {isNegativeScore === false ? "غیر منفی" : "منفی"}
                  </button>
                </div>
              </div>
              <div className="text-center">
                <label
                  htmlFor="roundCount"
                  className="block mb-1 font-bold text-xl">
                  تعداد دور
                </label>
                <input
                  type="number"
                  id="roundCount"
                  value={roundedCount}
                  onChange={handleRoundedCountChange}
                  min="1"
                  max="20"
                  className="text-center text-white text-3xl font-bold w-30 border-2 rounded-full px-2 pt-2"
                />
              </div>
            </div>

            {/* انتخاب دسته‌بندی کلمات */}
            <div className="text-center">
              <label className="block mb-3 font-bold text-xl">
                انتخاب دسته‌بندی کلمات
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categories).map(([key, category]) => (
                  <div key={key} className="flex items-center gap-2">
                    <button
                      className={`flex-1 p-2 rounded-xl border-2 transition-all duration-300  hover:bg-darkPrimary hover:border-darkPrimary ${
                        selectedCategories.includes(key)
                          ? "bg-primary border-primary text-white"
                          : "bg-darkBackgroundcolor border-white text-white"
                      }`}
                      onClick={() => handleCategoryToggle(key)}>
                      <span className="font-bold">{category.name}</span>
                      <span className="text-sm block">
                        ({category.words.length} کلمه)
                      </span>
                    </button>
                    {key === "myList" && (
                      <button
                        onClick={() => setShowMyListManager(true)}
                        className="p-2 bg-subPrimary text-white rounded-xl hover:bg-slowSubPrimary transition-all duration-300">
                        <Icons.edit className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-sm mt-2">
                  مجموع کلمات انتخاب شده:{" "}
                  {getSelectedWords(selectedCategories).length}
                </p>
              )}
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

            {errorMessage && (
              <p className="text-red-500 text-center font-bold">
                {errorMessage}
              </p>
            )}

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
