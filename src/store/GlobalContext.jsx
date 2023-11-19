import React, { useState, createContext, useEffect } from 'react';

// creates an array with a random distribution of mines
function generateMinesweeperBoard(width, height, mineCount) {
  // board values:
  // 0 - 8 -> number of mines near cell
  // x -> mine
  // f -> flagged cell (no mine)
  // xf -> flagged cell (mine)

  const newBoard = [];

  console.log('generating empty array: ', width, height, mineCount);
  for (let row = 0; row < height; row++) {
    const column = [];
    for (let col = 0; col < width; col++) {
      column.push(0);
    }
    newBoard.push(column);
  }

  console.log('adding mines');
  for (let i = 0; i < mineCount; i++) {
    let row = Math.floor(Math.random() * height);
    let col = Math.floor(Math.random() * width);

    while (typeof newBoard[row][col] !== 'number') {
      row = Math.floor(Math.random() * height);
      col = Math.floor(Math.random() * width);
    }

    newBoard[row][col] = 'x';
  }

  const checkSurroundingCells = (row, col) => {
    const numRows = newBoard.length;
    const numColumns = newBoard[0].length;
    let mineCount = 0;

    for (let rowOffset = row - 1; rowOffset <= row + 1; rowOffset++) {
      for (let colOffset = col - 1; colOffset <= col + 1; colOffset++) {
        // Check if the offsets are within bounds
        if (
          rowOffset >= 0 &&
          rowOffset < numRows &&
          colOffset >= 0 &&
          colOffset < numColumns
        ) {
          if (!(rowOffset === row && colOffset === col)) {
            if (newBoard[rowOffset][colOffset] === 'x') {
              mineCount++;
            }
          }
        }
      }
    }

    return mineCount;
  };

  console.log('updating cell mine counts');
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (newBoard[row][col] !== 'x') {
        newBoard[row][col] = checkSurroundingCells(row, col);
      }
    }
  }

  console.log('board generated: ', newBoard);
  return newBoard;
}

const INITIALWIDTH = 30;
const INITIALHEIGHT = 25;
const INITIALMINECOUNT = Math.floor(INITIALWIDTH * INITIALHEIGHT * 0.1);

const initialBoard = generateMinesweeperBoard(
  INITIALWIDTH,
  INITIALHEIGHT,
  INITIALMINECOUNT
);

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [boardWidth, setBoardWidth] = useState(INITIALWIDTH);
  const [boardHeight, setBoardHeight] = useState(INITIALHEIGHT);
  const [boardMineCount, setBoardMineCount] = useState(INITIALMINECOUNT);
  const [board, setBoard] = useState(initialBoard);

  const generateNewBoard = (width, height, mineCount) => {
    setBoardWidth(width);
    setBoardHeight(height);
    setBoardMineCount(mineCount);
    setBoard(generateMinesweeperBoard(width, height, mineCount));
  };

  const getTileValue = (row, col) => {
    // catches issues with out of sync tile updates
    if (row < boardHeight && col < boardWidth) {
      return board[row][col];
    }
    return null;
  };

  const handleTileSelected = (row, col) => {};

  const globalStateValue = {
    board,
    boardWidth,
    setBoardWidth,
    boardHeight,
    setBoardHeight,
    boardMineCount,
    setBoardMineCount,
    generateNewBoard,
    getTileValue,
  };

  return (
    <GlobalContext.Provider value={globalStateValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
