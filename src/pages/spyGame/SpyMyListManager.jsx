import React, { useState } from "react";
import { Icons } from "../../components/Icons";

export default function SpyMyListManager({ myWords, onWordsChange, onClose }) {
  const [newWord, setNewWord] = useState("");

  const handleAddWord = () => {
    if (newWord.trim() && !myWords.includes(newWord.trim())) {
      onWordsChange([...myWords, newWord.trim()]);
      setNewWord("");
    }
  };

  const handleRemoveWord = (indexToRemove) => {
    onWordsChange(myWords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center z-50">
      <div className="bg-pink-600 p-4 rounded-3xl w-80 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">مدیریت لیست من</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <Icons.close className="w-6 h-6" />
          </button>
        </div>

        {/* اضافه کردن کلمه جدید */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
              placeholder="کلمه جدید..."
              className="flex-1 px-3 py-2 rounded-xl text-black"
            />
            <button
              onClick={handleAddWord}
              className="bg-pink-800 text-white px-4 py-2 rounded-xl hover:bg-pink-900">
              افزودن
            </button>
          </div>
        </div>

        {/* لیست کلمات */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {myWords.length === 0 ? (
            <p className="text-center text-white opacity-70">
              هیچ کلمه‌ای اضافه نشده است
            </p>
          ) : (
            myWords.map((word, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-pink-800 p-2 rounded-xl">
                <span className="text-white">{word}</span>
                <button
                  onClick={() => handleRemoveWord(index)}
                  className="text-red-300 hover:text-red-500">
                  <Icons.trash className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-white opacity-70">
            تعداد کلمات: {myWords.length}
          </p>
        </div>
      </div>
    </div>
  );
}
