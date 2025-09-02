import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveGameSettingsSpy,
  loadGameSettingsSpy,
  clearGameSettingsSpy,
} from "./../utils";
import { Icons } from "../../components/Icons";
import {
  spyWordCategories,
  loadSpyWordCategories,
  saveSpyWordCategories,
  getSpySelectedWords,
} from "./spyWordCategories";
import SpyMyListManager from "./SpyMyListManager";

const SpySetup = () => {
  const [duration, setDuration] = useState(1);
  const [players, setPlayers] = useState(3);
  const [spies, setSpies] = useState(1);
  const [newGame, setNewGame] = useState(true);

  // استیت‌های جدید برای دسته‌بندی کلمات
  const [selectedCategories, setSelectedCategories] = useState([
    "animals",
    "food",
  ]);
  const [categories, setCategories] = useState(spyWordCategories);
  const [showMyListManager, setShowMyListManager] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const startGame = () => {
    if (players > 0 && spies <= players && duration > 0) {
      if (selectedCategories.length === 0) {
        setErrorMessage("حداقل یک دسته‌بندی انتخاب کنید.");
        return;
      }

      // بررسی اینکه آیا کلمات کافی وجود دارد
      const selectedWords = getSpySelectedWords(selectedCategories);
      if (selectedWords.length === 0) {
        setErrorMessage("دسته‌بندی‌های انتخاب شده کلمه‌ای ندارند.");
        return;
      }

      saveGameSettingsSpy({
        players: players,
        spies: spies,
        duration: duration * 60,
        countdown: duration * 60,
        word: null,
        spyIndexes: null,
        gameStatus: "reveal",
        revealed: null,
        selectedCategories: selectedCategories, // اضافه کردن دسته‌بندی‌های انتخاب شده
      });
      navigate("/SpyGame");
    } else {
      setErrorMessage("مقادیر وارد شده معتبر نیستند");
    }
  };

  useEffect(() => {
    const savedSettings = loadGameSettingsSpy();
    const loadedCategories = loadSpyWordCategories();
    setCategories(loadedCategories);

    if (savedSettings) {
      setNewGame(false);
      // بارگیری دسته‌بندی‌های انتخاب شده
      if (savedSettings.selectedCategories) {
        setSelectedCategories(savedSettings.selectedCategories);
      }
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

  // تابع برای تغییر انتخاب دسته‌بندی
  const handleCategoryToggle = (categoryKey) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryKey)) {
        return prev.filter((key) => key !== categoryKey);
      } else {
        return [...prev, categoryKey];
      }
    });
    setErrorMessage(""); // پاک کردن پیام خطا
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
    saveSpyWordCategories(updatedCategories);
  };

  return (
    <>
      {/* مدیریت لیست شخصی */}
      {showMyListManager && (
        <SpyMyListManager
          myWords={categories.myList.words}
          onWordsChange={handleMyListWordsChange}
          onClose={() => setShowMyListManager(false)}
        />
      )}

      {!newGame && (
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-[300px] text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              بازی ذخیره شده است
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/SpyGame")}
                className="bg-primary text-white py-2 rounded-xl hover:bg-darkPrimaryk transition">
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
            {/* <p className="text-primary text-sm mt-2">
              برای آموزش بازی کلیک کنید!
            </p> */}
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

          {/* انتخاب دسته‌بندی کلمات */}
          <div className="text-center w-full max-w-md">
            <label className="block mb-3 font-bold text-xl">
              انتخاب دسته‌بندی کلمات
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="flex items-center gap-2">
                  <button
                    className={`flex-1 p-2 rounded-xl border-2 transition-all duration-300 text-sm ${
                      selectedCategories.includes(key)
                        ? "bg-primary border-primary text-white hover:bg-darkPrimary hover:border-darkPrimary"
                        : "bg-backgroundcolor border-black text-gray-800 hover:bg-darkPrimary hover:border-darkPrimary hover:text-white"
                    }`}
                    onClick={() => handleCategoryToggle(key)}>
                    <span className="font-bold">{category.name}</span>
                    <span className="text-xs block opacity-70">
                      ({category.words.length} کلمه)
                    </span>
                  </button>
                  {key === "myList" && (
                    <button
                      onClick={() => setShowMyListManager(true)}
                      className="p-2 bg-subPrimary text-white rounded-xl hover:bg-slowSubPrimary transition-all duration-300">
                      <Icons.edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <p className="text-sm mt-2 text-gray-600">
                مجموع کلمات انتخاب شده:{" "}
                {getSpySelectedWords(selectedCategories).length}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-center font-bold text-sm">
              {errorMessage}
            </p>
          )}

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
