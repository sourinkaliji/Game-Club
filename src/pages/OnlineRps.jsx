import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import paper from "/RPS/paper.png";
import rock from "/RPS/rock.png";
import scissor from "/RPS/scissor.png";
import question from "/RPS/question.png";
import { Icons } from "../components/Icons";

export default function OnlineRps() {
  const [ws, setWs] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [showConnect, setShowConnect] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    connectToGame(newRoomId);
  };

  const joinRoom = (roomToJoin) => {
    if (!roomToJoin.trim()) {
      alert("لطفا کد اتاق را وارد کنید");
      return;
    }
    connectToGame(roomToJoin);
  };

  // WebSocket message handler
  const handleMessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received:", data);

    switch (data.type) {
      case "state":
        setGameState(data.payload);
        break;
      case "round_end":
        setRoundResult(data.payload);
        setTimeout(() => setRoundResult(null), 3000);
        break;
      case "match_end":
        setIsGameOver(true);
        console.log("Match End Data:", {
          gameState,
          payload: data.payload,
          winnerId: data.payload.winner,
          scores: data.payload.scores,
        });

        const winnerPlayer = gameState?.players.find(
          (p) => p.id === data.payload.winner
        );
        const winnerName = winnerPlayer?.name || data.payload.winner;
        const winnerScore = data.payload.scores
          ? data.payload.scores[data.payload.winner]
          : null;

        console.log("Winner Info:", {
          player: winnerPlayer,
          name: winnerName,
          score: winnerScore,
        });

        setWinner({
          id: data.payload.winner,
          name: winnerName,
          score: winnerScore,
        });
        break;
      case "system":
        console.log(data.payload.msg);
        break;
    }
  };

  const connectToGame = (gameRoomId) => {
    const token = localStorage.getItem("token"); // Get token from storage
    const wsUrl = `ws://127.0.0.1:8000/ws/rps/${encodeURIComponent(
      gameRoomId
    )}?token=${encodeURIComponent(token)}`;

    const newWs = new WebSocket(wsUrl);
    newWs.onopen = () => {
      setShowConnect(false);
      console.log("Connected to game");
    };
    newWs.onmessage = handleMessage;
    newWs.onclose = () => {
      console.log("Disconnected from game");
      setShowConnect(true);
    };
    setWs(newWs);
  };

  const makeChoice = (choice) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "play", payload: { choice } }));
    }
  };

  const requestRematch = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "rematch" }));
      setIsGameOver(false);
      setWinner(null);
    }
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  if (showConnect) {
    return (
      <div className="bg-backgroundcolor flex justify-center items-center w-screen min-h-screen p-4">
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
          <div className="flex flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-center">
              سنگ کاغذ قیچی آنلاین
            </h2>
            <button
              onClick={() => navigate("/OnlineGames", { replace: true })}
              className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
              <Icons.arrow className={"w-8 rotate-180"} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={createRoom}
              className="w-full bg-primary text-white p-3 rounded-xl hover:bg-darkPrimary text-lg font-bold">
              ساخت اتاق جدید
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">یا</span>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="کد اتاق را وارد کنید"
                className="w-full p-3 mb-3 border rounded-xl text-center"
                maxLength={6}
              />
              <button
                onClick={() => joinRoom(roomId)}
                disabled={!roomId.trim()}
                className="w-full bg-primary text-white p-3 rounded-xl hover:bg-darkPrimary text-lg font-bold disabled:opacity-50">
                ورود به اتاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-backgroundcolor w-screen min-h-screen flex flex-col justify-between">
      <div>
        <div className="py-3 px-2 xs:px-4 flex justify-between items-center mx-2 my-3 bg-darkBackgroundcolor rounded-xl">
          <div className="flex items-center justify-between gap-5">
            <h2 className="text-2xl font-bold">سنگ کاغذ قیچی آنلاین</h2>
            {roomId && (
              <div className="text-lg font-bold bg-gray-100 px-3 py-1 rounded-lg">
                کد اتاق: {roomId}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {Icons && Icons.reload && (
              <button
                onClick={requestRematch}
                className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                <Icons.reload className={"w-8"} />
              </button>
            )}
            {Icons && Icons.stop && (
              <button
                onClick={() => navigate("/OnlineGames", { replace: true })}
                className="hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                <Icons.arrow className={"w-8 rotate-180"} />
              </button>
            )}
          </div>
        </div>

        {/* Score Display */}
        {gameState && (
          <div className="flex justify-center items-center gap-8 font-bold text-lg">
            {gameState.players.map((player) => (
              <div key={player.id}>
                <h1>
                  {player.name}: {player.score}
                </h1>
                {player.miss_streak > 0 && (
                  <p className="text-red-500 text-sm">
                    Misses: {player.miss_streak}/3
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Status Display */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center pb-4 text-2xl font-bold">
          {roundResult
            ? roundResult.winner
              ? `برنده راند: ${
                  gameState?.players.find((p) => p.id === roundResult.winner)
                    ?.name
                }`
              : "مساوی"
            : "انتخاب کنید"}
        </h1>

        {/* Opponent's Choice */}
        <div className="size-40 p-3 rounded-3xl bg-subPrimary rotate-180">
          {roundResult &&
            (() => {
              const opponent = gameState?.players.find(
                (p) => p.id !== gameState?.players[0].id
              );
              const oppChoice = roundResult.choices[opponent?.id];
              let imgSrc = question;
              if (oppChoice === "rock") imgSrc = rock;
              else if (oppChoice === "paper") imgSrc = paper;
              else if (oppChoice === "scissors") imgSrc = scissor;
              return (
                <img
                  src={imgSrc}
                  alt="Opponent's Choice"
                  className="w-full h-full"
                />
              );
            })()}
        </div>
      </div>

      {/* Player Choices */}
      {!isGameOver ? (
        <div className="flex justify-center items-center gap-3 mb-5">
          <button onClick={() => makeChoice("rock")}>
            <h1 className="text-2xl font-bold pb-2">سنگ</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={rock}
              alt="Rock"
            />
          </button>
          <button onClick={() => makeChoice("paper")}>
            <h1 className="text-2xl font-bold pb-2">کاغذ</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={paper}
              alt="Paper"
            />
          </button>
          <button onClick={() => makeChoice("scissors")}>
            <h1 className="text-2xl font-bold pb-2">قیچی</h1>
            <img
              className="size-20 xs:size-25 lg:size-30 p-3 rounded-3xl bg-slowSubPrimary hover:bg-subPrimary hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
              src={scissor}
              alt="Scissors"
            />
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">بازی تمام شد!</h2>
            <p className="text-xl mb-6">برنده: {winner?.name}</p>
            <p className="text-lg mb-6">امتیاز: {winner?.score}</p>
            <div className="flex gap-4">
              <button
                onClick={requestRematch}
                className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-darkPrimary transition-all">
                بازی مجدد
              </button>
              <button
                onClick={() => navigate("/OnlineGames", { replace: true })}
                className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-all">
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
