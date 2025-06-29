import React from "react";
import { Link } from "react-router-dom";

const games = [
  {
    name: "Chess",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/4/4b/Chess_board_opening_staunton.jpg",
  },
  {
    name: "هانتر",
    image: "../../public/HunterGame.png",
    page: "/HunterGameStarter",
  },
  {
    name: "پینگ پونگ",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Table_tennis_table.jpg",
  },
  {
    name: "Ludo",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Ludo_board.jpg",
  },
  {
    name: "Badminton",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Badminton_court.jpg",
  },
  {
    name: "Snakes and Ladders",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/Snakes_and_Ladders.jpg",
  },
  {
    name: "Scrabble",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Scrabble_game_in_progress.jpg",
  },
  {
    name: "Monopoly",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Monopoly_board_on_white_bg.jpg",
  },
];

export default function OfflineGames() {
  return (
    <div className="p-8 bg-backgroundcolor w-screen h-screen">
      <h2 className="text-center mb-8 text-2xl font-bold">بازی های آفلاین</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-center gap-4">
        {games.map((game) => (
          <Link
            to={game.page}
            key={game.name}
            className="relative border rounded-3xl size-full aspect-square hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%), url(${game.image})`,
                backgroundSize: "contain",
                backgroundPosition: "contain",
              }}
            />

            <h3 className="absolute bottom-8 right-2 text-2xl font-bold text-white">
              {game.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
