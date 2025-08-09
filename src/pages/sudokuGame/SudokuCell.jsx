const SudokuCell = ({ value, isFixed }) => {
  return (
    <div
      className={`size-8 md:size-12 flex items-center justify-center text-lg md:text-2xl font-bold
        ${
          isFixed
            ? "bg-subPrimary text-white font-bold"
            : value
            ? "bg-SlowPrimary text-darkPrimary"
            : "bg-SuperSlowSubPrimary"
        } 
        border border-gray-400 select-none`}>
      {value !== 0 ? value : ""}
    </div>
  );
};

export default SudokuCell;
