import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import OfflineGames from "./pages/OfflineGames";
import OnlineGames from "./pages/OnlineGames";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import HunterGameStarter from "./pages/hunterGame/HunterGameStarter";
import HunterGamePage from "./pages/hunterGame/HunterGamePage";
import HunterScoreBoeard from "./pages/hunterGame/HunterScoreBoeard";

import Rps from "./pages/RPS";
import SudokuGame from "./pages/sudokuGame/SudokuGame";

import SpySetup from "./pages/spyGame/SpySetup";
import SpyGame from "./pages/spyGame/SpyGame";

import TicTacToe from "./pages/TicTacToe";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/OfflineGames" element={<OfflineGames />} />
        <Route path="/OnlineGames" element={<OnlineGames />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/HunterGameStarter" element={<HunterGameStarter />} />
        <Route path="/HunterGamePage" element={<HunterGamePage />} />
        <Route path="/HunterScoreBoeard" element={<HunterScoreBoeard />} />

        <Route path="/Rps" element={<Rps />} />
        <Route path="/SudokuGame" element={<SudokuGame />} />

        <Route path="/SpySetup" element={<SpySetup />} />
        <Route path="/SpyGame" element={<SpyGame />} />

        <Route path="/TicTacToe" element={<TicTacToe />} />
      </Routes>
    </Router>
  );
}

export default App;
