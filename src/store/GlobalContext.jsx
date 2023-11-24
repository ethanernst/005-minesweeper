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

// creates a 2D array of objects with tile values and states
// and randomly distributes x number of mines
function generateMinesweeperBoard(width, height, mineCount) {
  // for { value, state } in 2d array:
  // value:
  // 0 - 8 -> number of mines near cell
  // x -> mine
  // state:
  // 0 -> not revealed
  // 1 -> revealed
  // f -> flagged

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

  console.log('updating cell values');
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (newBoard[row][col] !== 'x') {
        newBoard[row][col] = checkSurroundingCells(row, col);
      }
    }
  }

  // convert tile value array to board array with tile value and states
  console.log('generating final board');
  const finalBoard = [];
  for (let row = 0; row < height; row++) {
    const finalCol = [];
    for (let col = 0; col < width; col++) {
      finalCol.push({ value: newBoard[row][col], state: 0 });
    }
    finalBoard.push(finalCol);
  }

  console.log('board generated: ', finalBoard);
  return finalBoard;
}

// initial constants
const INITIALWIDTH = 30;
const INITIALHEIGHT = 30;
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

  // recursively reveal nearby cells of empty cells
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

    // loop queue until all cells have been exhausted
    while (queue.length > 0) {
      const [currRow, currCol] = queue.shift();

      // skip loop if cell is invalid, already visited, or flagged
      if (
        currRow < 0 ||
        currRow >= board.length ||
        currCol < 0 ||
        currCol >= board[0].length ||
        visitedCells.includes(`${currRow}:${currCol}`) ||
        board[currRow][currCol].state === 'f'
      ) {
        continue;
      }

      // encode visited cells so we can quickly check for inclusion
      visitedCells.push(`${currRow}:${currCol}`);

      if (board[currRow][currCol].value === 0) {
        for (const [rowOffset, colOffset] of directions) {
          const nextRow = currRow + rowOffset;
          const nextCol = currCol + colOffset;
          queue.push([nextRow, nextCol]);
        }
      }
    }

    // update board states using visitedCells
    setBoard(prev => {
      const updatedBoard = [...prev];

      visitedCells.forEach(cell => {
        const cellRow = Number(cell.slice(0, cell.indexOf(':')));
        const cellCol = Number(cell.slice(cell.indexOf(':') + 1));

        updatedBoard[cellRow][cellCol].state = 1;
      });

      return [...updatedBoard];
    });
  };

  const generateNewBoard = (width, height, mineCount) => {
    setBoardWidth(width);
    setBoardHeight(height);
    setBoardMineCount(mineCount);
    setBoard(generateMinesweeperBoard(width, height, mineCount));
  };

  const getTile = (row, col) => {
    // catches issues with out of sync tile updates
    if (row < boardHeight && col < boardWidth) {
      return board[row][col];
    }

    return null;
  };

  const selectTile = (row, col) => {
    // skip flagged tiles
    if (board[row][col].state === 'f') {
      return;
    }

    // reveal empty sections of board if empty
    if (board[row][col].value === 0) {
      searchNearbyCells(row, col, board);
      return;
    }

    // reveal a single tile
    setBoard(prev => {
      const updatedBoard = [...prev];
      updatedBoard[row][col].state = 1;
      return updatedBoard;
    });
  };

  const flagTile = (row, col) => {
    setBoard(prev => {
      const updatedBoard = [...prev];

      if (updatedBoard[row][col].state === 0) {
        updatedBoard[row][col].state = 'f';
      } else if (updatedBoard[row][col].state === 'f') {
        updatedBoard[row][col].state = 0;
      }

      return updatedBoard;
    });
  };

  const globalStateValue = {
    board,
    boardWidth,
    boardHeight,
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
