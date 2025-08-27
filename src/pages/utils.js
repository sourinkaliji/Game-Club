// HUNTER GAME SETTING ---------------------------------------------------
export const saveGameSettingsHunter = (settings) => {
  localStorage.setItem("hunterGameSettings", JSON.stringify(settings));
};

export const loadGameSettingsHunter = () => {
  const savedSettings = localStorage.getItem("hunterGameSettings");
  return savedSettings ? JSON.parse(savedSettings) : null;
};

export const clearGameSettingsHunter = () => {
  localStorage.removeItem("hunterGameSettings");
};

// RPS GAME SETTING ---------------------------------------------------
export const saveGameSettingsRPS = (settings) => {
  localStorage.setItem("RPSGameSettings", JSON.stringify(settings));
};

export const loadGameSettingsRPS = () => {
  const savedSettings = localStorage.getItem("RPSGameSettings");
  return savedSettings ? JSON.parse(savedSettings) : null;
};

export const clearGameSettingsRPS = () => {
  localStorage.removeItem("RPSGameSettings");
};

// Sudoku GAME SETTING ---------------------------------------------------
export const saveGameSettingsSudoku = (settings) => {
  localStorage.setItem("SudokuGameSettings", JSON.stringify(settings));
};

export const loadGameSettingsSudoku = () => {
  const savedSettings = localStorage.getItem("SudokuGameSettings");
  return savedSettings ? JSON.parse(savedSettings) : null;
};

export const clearGameSettingsSudoku = () => {
  localStorage.removeItem("SudokuGameSettings");
};

// SPY GAME SETTING ---------------------------------------------------
export const saveGameSettingsSpy = (settings) => {
  localStorage.setItem("SpyGameSettings", JSON.stringify(settings));
};

export const loadGameSettingsSpy = () => {
  const savedSettings = localStorage.getItem("SpyGameSettings");
  return savedSettings ? JSON.parse(savedSettings) : null;
};

export const clearGameSettingsSpy = () => {
  localStorage.removeItem("SpyGameSettings");
};

// TIC TAC TOE ----------------------------------------------------
export const saveTicTacToeSettings = (settings) => {
  try {
    localStorage.setItem("tic-tac-toe-settings", JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving Tic Tac Toe settings:", error);
  }
};

export const loadTicTacToeSettings = () => {
  try {
    const settings = localStorage.getItem("tic-tac-toe-settings");
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error("Error loading Tic Tac Toe settings:", error);
    return null;
  }
};

export const clearTicTacToeSettings = () => {
  try {
    localStorage.removeItem("tic-tac-toe-settings");
  } catch (error) {
    console.error("Error clearing Tic Tac Toe settings:", error);
  }
};
