import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveGameSettingsRPS,
  loadGameSettingsRPS,
  clearGameSettingsRPS,
} from "./utils";

import paper from "/RPS/paper.png";
import rock from "/RPS/rock.png";
import scissor from "/RPS/scissor.png";
import question from "/RPS/question.png";
import { Icons } from "../components/Icons";

export default function Rps() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [gameResult, setGameResult] = useState(0);

  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const [isGameStopped, setIsGameStopped] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedSettings = loadGameSettingsRPS();
    if (savedSettings) {
      setUserScore(savedSettings.userScore || 0);
      setComputerScore(savedSettings.computerScore || 0);
      setIsGameStopped(true);
    }
  }, []);

  const handleUserClick = (userChoice) => {
    if (isGameStopped) return;
    if (gameResult != 0) return;

    const computerChoice = Math.floor(Math.random() * 3) + 1;
    setRandomNumber(computerChoice);

    // Logic Of Game
    if (userChoice === computerChoice) {
      setGameResult(3); // Draw
      saveGameSettingsRPS({
        userScore: userScore,
        computerScore: computerScore,
      });
      saveGameSettingsRPS({
        userScore: userScore,
        computerScore: computerScore,
      });
    } else if (
      (userChoice === 1 && computerChoice === 3) ||
      (userChoice === 2 && computerChoice === 1) ||
      (userChoice === 3 && computerChoice === 2)
    ) {
      setGameResult(1); // User wins
      setUserScore((prev) => prev + 1);

      saveGameSettingsRPS({
        userScore: userScore + 1,
        computerScore: computerScore,
      });
    } else {
      setGameResult(2); // Computer wins
      setComputerScore((prev) => prev + 1);

      saveGameSettingsRPS({
        userScore: userScore,
        computerScore: computerScore + 1,
      });
    }

    setTimeout(() => {
      setRandomNumber(0);
      setGameResult(0);
    }, 3000);
  };

  const resetGame = () => {
    clearGameSettingsRPS();
    setUserScore(0);
    setComputerScore(0);
    setIsGameStopped(false);
  };

  return (
    <>
      <div className="bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between">
        <div>
          <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 my-3 bg-darkBackgroundcolor rounded-xl">
            <h2 className="text-center text-2xl font-bold">سنگ کاغذ قیچی</h2>
            <button
              className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              onClick={() => setIsGameStopped(true)}>
              {/* {isGameStopped ? "ادامه بازی" : "توقف بازی"} */}
              <Icons.stop className={"w-8"} />
            </button>
          </div>
          <div className="flex justify-center items-center gap-8 font-bold text-lg">
            <h1> کاربر : {userScore}</h1>
            <h1> کامپیوتر : {computerScore}</h1>
          </div>
        </div>

        {/* ------------------------------------------------- Computer Choice ------------------------------------------------- */}
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-center pb-4 text-2xl font-bold ${
              gameResult === 1
                ? "text-green-700"
                : gameResult === 2
                ? "text-primary"
                : gameResult === 3
                ? "text-slowSubPrimary"
                : "text-black"
            }`}>
            {gameResult === 1
              ? "برنده شدی"
              : gameResult === 2
              ? "سوختی"
              : gameResult === 3
              ? "مساوی"
              : "انتخاب کنید"}
          </h1>
          <img
            className="size-40 p-3 rounded-3xl bg-subPrimary rotate-180"
            src={
              randomNumber === 1
                ? rock
                : randomNumber === 2
                ? paper
                : randomNumber === 3
                ? scissor
                : question
            }
            alt="Computer Chioce"
          />
        </div>
        {/* ----------------------------------------- PLAYER CHOICE ----------------------------------------- */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <button onClick={() => handleUserClick(1)}>
            <h1 className="text-2xl font-bold pb-2">سنگ</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={rock}
              alt="Player-Rock"
            />
          </button>
          <button onClick={() => handleUserClick(2)}>
            <h1 className="text-2xl font-bold pb-2">کاغذ</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={paper}
              alt="Player-Paper"
            />
          </button>
          <button onClick={() => handleUserClick(3)}>
            <h1 className="text-2xl font-bold pb-2">قیچی</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={scissor}
              alt="Plyer-Scissor"
            />
          </button>
        </div>
        {/* ----------------------------------------- GAME PAUSE ----------------------------------------- */}
        {isGameStopped && (
          <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-md w-screen h-screen flex justify-center items-center">
            <div className="bg-backgroundcolor p-3 rounded-3xl">
              <h1 className="text-center text-xl font-bold pb-1">
                بازی متوقف شده است
              </h1>
              <h3 className="text-sm">
                یکی از گزینه های زیر را برای ادامه انتخاب کنید
              </h3>
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setIsGameStopped(false)}
                  className="bg-primary text-white text-sm border-2 border-primary px-3
                  py-2 rounded-full mt-4 hover:bg-darkPrimary
                  hover:border-darkPrimary hover:scale-105 transition-all
                  duration-300 ease-out cursor-pointer">
                  ادامه بازی
                </button>
                <button
                  onClick={() => {
                    resetGame();
                  }}
                  className="text-primary border-2 text-sm border-primary py-2 px-3 rounded-full mt-4 hover:border-darkPrimary hover:text-darkPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                  شروع مجدد
                </button>
                <button
                  onClick={() => {
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
    </>
  );
}
