import React, { useState, createContext, useEffect } from 'react';

// creates an array with a random distribution of mines
function generateMinesweeperBoard(width, height, mineCount) {
  console.log('generating array: ', width, height, mineCount);
  const newBoard = [];
  for (let row = 0; row < height; row++) {
    const column = [];
    for (let col = 0; col < width; col++) {
      column.push(0);
    }
    newBoard.push(column);
  }

  console.log('generated empty array: ' + newBoard);
  for (let i = 0; i < mineCount; i++) {
    let row = Math.floor(Math.random() * height);
    let col = Math.floor(Math.random() * width);

    console.log('generating mine ' + i);
    while (newBoard[row][col] !== 0) {
      row = Math.floor(Math.random() * height);
      col = Math.floor(Math.random() * width);
      console.log(
        `checking cell ${row}:${col}, value is ${newBoard[row][col]}`
      );
    }

    newBoard[row][col] = 1;
  }

  console.log('newBoard generated');
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

  const getCellValue = (row, col) => {
    return board[row][col];
  };

  const globalStateValue = {
    board,
    boardWidth,
    setBoardWidth,
    boardHeight,
    setBoardHeight,
    boardMineCount,
    setBoardMineCount,
    generateNewBoard,
    getCellValue,
  };

  return (
    <GlobalContext.Provider value={globalStateValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
