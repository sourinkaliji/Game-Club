import React from "react";
import SudokuCell from "./SudokuCell";

const SudokuBoard = ({ board, fixedCells, onSelectCell }) => {
  return (
    <div className="grid grid-cols-9 gap-0">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const thickTop =
            rowIndex % 3 === 0 ? "border-t-2 border-t-gray-500" : "";
          const justBottom =
            rowIndex === 8 ? "border-b-2 border-b-gray-500" : "";
          const thickLeft =
            colIndex % 3 === 0 ? "border-r-2 border-r-gray-500" : "";
          const justRight =
            colIndex === 8 ? "border-l-2 border-l-gray-500" : "";
          const borderClasses = `${thickTop} ${justBottom} ${thickLeft} ${justRight} border border-gray-300`;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={borderClasses}
              onClick={() => onSelectCell(rowIndex, colIndex)}>
              <SudokuCell
                row={rowIndex}
                col={colIndex}
                value={cell}
                isFixed={fixedCells[rowIndex][colIndex]}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default SudokuBoard;
