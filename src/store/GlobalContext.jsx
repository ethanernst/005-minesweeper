import React, { useState, createContext, useEffect } from 'react';

function generateEmptyArray(width, height) {
  const emptyArray = [];
  for (let row = 0; row < height; row++) {
    const emptyColumn = [];
    for (let col = 0; col < width; col++) {
      emptyColumn.push(0);
    }
    emptyArray.push(emptyColumn);
  }

  return emptyArray;
}

// creates an array with a random distribution of mines
function generateMinesweeperBoard(width, height, mineCount) {
  // board values:
  // 0 - 8 -> number of mines near cell
  // x -> mine

  console.log('generating empty array: ', width, height);
  const newBoard = generateEmptyArray(width, height);

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
const INITIALHEIGHT = 30;
const INITIALMINECOUNT = Math.floor(INITIALWIDTH * INITIALHEIGHT * 0.1);

const initialBoard = generateMinesweeperBoard(
  INITIALWIDTH,
  INITIALHEIGHT,
  INITIALMINECOUNT
);

const initialTileStates = generateEmptyArray(INITIALWIDTH, INITIALHEIGHT);

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [boardWidth, setBoardWidth] = useState(INITIALWIDTH);
  const [boardHeight, setBoardHeight] = useState(INITIALHEIGHT);
  const [boardMineCount, setBoardMineCount] = useState(INITIALMINECOUNT);
  const [board, setBoard] = useState(initialBoard);
  const [tileStates, setTileStates] = useState(initialTileStates);

  const isValidTile = (row, col, board, visited) => {
    return (
      row >= 0 &&
      row < board.length &&
      col >= 0 &&
      col < board[0].length &&
      board[row][col] === 0 &&
      !visited.includes(`${row}:${col}`)
    );
  };

  const searchNearbyCells = (row, col, board) => {
    console.log('searching cells from', row, col);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    const queue = [];
    const visitedCells = [];

    queue.push([row, col]);

    while (queue.length > 0) {
      const current = queue.shift();
      const currRow = current[0];
      const currCol = current[1];

      // skip to next loop if cell is invalid
      if (
        currRow < 0 ||
        currRow >= board.length ||
        currCol < 0 ||
        currCol >= board[0].length ||
        visitedCells.includes(`${currRow}:${currCol}`)
      ) {
        continue;
      }

      // encode visited cells so we can check if it includes(value)
      visitedCells.push(`${currRow}:${currCol}`);

      if (board[currRow][currCol] === 0) {
        for (const [rowOffset, colOffset] of directions) {
          const nextRow = currRow + rowOffset;
          const nextCol = currCol + colOffset;
          queue.push([nextRow, nextCol]);
        }
      }
    }

    setTileStates(prev => {
      const newStates = [...prev];

      visitedCells.forEach(cell => {
        const cellRow = Number(cell.slice(0, cell.indexOf(':')));
        const cellCol = Number(cell.slice(cell.indexOf(':') + 1));

        newStates[cellRow][cellCol] = 1;
      });

      return [...newStates];
    });
  };

  const generateNewBoard = (width, height, mineCount) => {
    setBoardWidth(width);
    setBoardHeight(height);
    setBoardMineCount(mineCount);
    setBoard(generateMinesweeperBoard(width, height, mineCount));
    setTileStates(generateEmptyArray(width, height));
  };

  const getTile = (row, col) => {
    // catches issues with out of sync tile updates
    if (row < boardHeight && col < boardWidth) {
      return { value: board[row][col], state: tileStates[row][col] };
    }

    return null;
  };

  const selectTile = (row, col) => {
    console.log('select tile', row, col);

    if (board[row][col] === 0) {
      searchNearbyCells(row, col, board);
      return;
    }

    setTileStates(prev => [...prev, (prev[row][col] = 1)]);
  };

  const flagTile = (row, col) => {
    console.log('flag tile', row, col);

    setTileStates(prev => [...prev, (prev[row][col] = 'f')]);
  };

  const globalStateValue = {
    board,
    tileStates,
    boardWidth,
    setBoardWidth,
    boardHeight,
    setBoardHeight,
    boardMineCount,
    setBoardMineCount,
    generateNewBoard,
    getTile,
    selectTile,
    flagTile,
  };

  return (
    <GlobalContext.Provider value={globalStateValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
