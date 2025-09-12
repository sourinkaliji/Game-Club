import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";

const games = [
  {
    name: "سنگ کاغذ قیچی",
    image: "./rps.png",
    page: "/OnlineRPS",
    soon: false,
  },
  {
    name: "دوز",
    image: "./TicTacToe.png",
    page: "/HunterGameStarter",
    soon: true,
  },
  {
    name: "اوتلو",
    image: "Othello.png",
    page: "/SudokuGame",
    soon: true,
  },
  //   {
  //     name: "جاسوس",
  //     image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Ludo_board.jpg",
  //     page: "/SpySetup",
  //   },
];

export default function OnlineGames() {
  return (
    <div className="p-2 bg-backgroundcolor w-screen min-h-screen">
      <div className="py-3 px-2 xs:px-4 flex justify-between items-center mt-1 mb-5 bg-slowSubPrimary rounded-xl">
        <h2 className="text-center text-backgroundcolor text-2xl font-bold">
          بازی های آنلاین
        </h2>
        <Link
          className="flex justify-center items-center border-2 rounded-3xl py-1 pl-2 pr-3 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out bg-backgroundcolor hover:bg-darkBackgroundcolor border-subPrimary"
          to={"/"}>
          <span>برگشت</span>
          <Icons.arrow className={"w-6 rotate-180"} />
        </Link>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-center gap-4">
        {games.map((game) => (
          <Link
            to={game.soon ? "" : game.page}
            key={game.name}
            className="relative border rounded-3xl size-full aspect-square hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
            style={{ pointerEvents: game.soon ? "none" : "auto" }}>
            <div
              className={`absolute inset-0 rounded-3xl ${
                game.soon ? "blur-sm" : ""
              }`}
              style={{
                background: `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url(${game.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {game.soon && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-2xl font-bold text-white bg-black/60 px-6 py-2 rounded-2xl">
                  بزودی
                </span>
              </div>
            )}
            <h3 className="absolute bottom-5 right-2 text-lg font-bold text-white z-20">
              {game.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
