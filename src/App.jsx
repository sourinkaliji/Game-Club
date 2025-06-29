import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import OfflineGames from "./pages/OfflineGames";
import HunterGameStarter from "./pages/HunterGameStarter";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/OfflineGames" element={<OfflineGames />} />
        <Route path="/HunterGameStarter" element={<HunterGameStarter />} />
      </Routes>
    </Router>
  );
}

export default App;
