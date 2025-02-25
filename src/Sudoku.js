import { useState, useEffect } from "react";
import "./Sudoku.css";

const BASE_GRID = [
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

const Sudoku = () => {
  const [grid, setGrid] = useState([]);
  const [baseGrid, setBaseGrid] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setGrid(JSON.parse(JSON.stringify(BASE_GRID)));
    setBaseGrid(JSON.parse(JSON.stringify(BASE_GRID)));
  }, []);

  const isSafe = (grid, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }

    return true;
  };

  const handleInputChange = (row, col, value) => {
    if (baseGrid[row][col] !== 0) return; // Prevent changing base values
    const newGrid = JSON.parse(JSON.stringify(grid));
    if (!isNaN(value) && value >= 0 && value <= 9) {
      newGrid[row][col] = value ? parseInt(value) : 0;
      setGrid(newGrid);
    }
  };

  const checkSolution = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 || !isSafe(grid, row, col, grid[row][col])) {
          setMessage("❌ Try Again!");
          return;
        }
      }
    }
    setMessage("🎉 You Win!");
  };

  const fillSudoku = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [...Array(9).keys()].map((x) => x + 1).sort(() => Math.random() - 0.5); 
          for (let num of numbers) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillSudoku(grid)) return true;
              grid[row][col] = 0; 
            }
          }
          return false;
        }
      }
    }
    return true; 
  };
  
  const removeCells = (grid, holes = 40) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let count = 0;
    while (count < holes) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (newGrid[row][col] !== 0) {
        newGrid[row][col] = 0;
        count++;
      }
    }
    return newGrid;
  };
  
  const generateSudoku = () => {
    const emptyGrid = Array(9).fill().map(() => Array(9).fill(0));
    fillSudoku(emptyGrid); 
    const puzzle = removeCells(emptyGrid, 45); 
    setGrid(puzzle);
    setBaseGrid(JSON.parse(JSON.stringify(puzzle)));
    setMessage("");
  };
  

  return (
    <div className="sudoku-container">
      <h1 className="title">Sudoku Game</h1>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength="1"
              value={cell === 0 ? "" : cell}
              readOnly={baseGrid[rowIndex][colIndex] !== 0}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              className={`sudoku-cell ${
                baseGrid[rowIndex][colIndex] !== 0 ? "prefilled" : ""
              } ${
                (rowIndex % 3 === 2 && rowIndex !== 8 ? "border-bottom-bold " : "") +
                (colIndex % 3 === 2 && colIndex !== 8 ? "border-right-bold" : "")
              }`}
            />
          ))
        )}
      </div>

      <div className="button-container">
        <button onClick={generateSudoku} className="generate-button">
          Generate New Sudoku
        </button>
        <button onClick={checkSolution} className="check-button">
          Check Solution
        </button>
      </div>

      {message && <p className="result-message">{message}</p>}
    </div>
  );
};

export default Sudoku;
