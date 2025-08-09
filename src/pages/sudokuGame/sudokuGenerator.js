export const generateSudoku = (difficulty = "easy") => {
  const basePuzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];
  const solved = solveSudoku(JSON.parse(JSON.stringify(basePuzzle)));
  const maskLevel =
    difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 55;
  const puzzle = basePuzzle.map((row) =>
    row.map((cell) => (Math.random() * 81 < maskLevel ? 0 : cell))
  );
  return { puzzle, solved };
};

const solveSudoku = (board) => {
  const isValid = (row, col, val) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === val || board[i][col] === val) return false;
      const r = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const c = 3 * Math.floor(col / 3) + (i % 3);
      if (board[r][c] === val) return false;
    }
    return true;
  };

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return board;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return board;
};
