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
//
// { value, state } in 2d array:
// value:
// 0 - 8 -> number of mines near tile
// x -> mine
// state:
// 0 -> not revealed
// 1 -> revealed
// f -> flagged
function generateMinesweeperBoard(width, height, mineCount) {
  console.log(`[Context] Generating board (${width}w x ${height}h)`);
  const newBoard = generateEmptyArray(width, height);

  console.log(`[Context] Adding ${mineCount} mines`);
  for (let i = 0; i < mineCount; i++) {
    let row = Math.floor(Math.random() * height);
    let col = Math.floor(Math.random() * width);

    while (typeof newBoard[row][col] !== 'number') {
      row = Math.floor(Math.random() * height);
      col = Math.floor(Math.random() * width);
    }

    newBoard[row][col] = 'x';
  }

  // returns the number of mines around a given tile
  const checkSurroundingTiles = (row, col) => {
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

  console.log('[Context] Updating tile values');
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (newBoard[row][col] !== 'x') {
        newBoard[row][col] = checkSurroundingTiles(row, col);
      }
    }
  }

  // convert tile value array to board array with tile value and states
  console.log('[Context] Generating final board');
  const finalBoard = [];
  for (let row = 0; row < height; row++) {
    const finalCol = [];
    for (let col = 0; col < width; col++) {
      finalCol.push({ value: newBoard[row][col], state: 0 });
    }
    finalBoard.push(finalCol);
  }

  console.log('[Context] Board generated');
  // console.log(finalBoard);
  return finalBoard;
}

// initial constants
const INITIALWIDTH = 30;
const INITIALHEIGHT = 30;
const INITIALMINECOUNT = Math.floor(INITIALWIDTH * INITIALHEIGHT * 0.1);
// const INITIALBOARDSCALE = 1;

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
  // const [boardScale, setBoardScale] = useState(INITIALBOARDSCALE);
  const [board, setBoard] = useState(initialBoard);
  const [gameState, setGameState] = useState('playing');

  // starting from an empty tile, recursively reveal adjacent tiles
  // until no more adjacent empty tiles are found
  const searchNearbyTiles = (row, col, board) => {
    console.log('searching tiles from', row, col);

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
    const visitedTiles = [];

    queue.push([row, col]);

    // loop queue until all tiles have been exhausted
    while (queue.length > 0) {
      const [currRow, currCol] = queue.shift();

      // skip loop if tile is invalid, already visited, or flagged
      if (
        currRow < 0 ||
        currRow >= board.length ||
        currCol < 0 ||
        currCol >= board[0].length ||
        visitedTiles.includes(`${currRow}:${currCol}`) ||
        board[currRow][currCol].state === 'f'
      ) {
        continue;
      }

      // encode visited tiles so we can quickly check for inclusion
      visitedTiles.push(`${currRow}:${currCol}`);

      if (board[currRow][currCol].value === 0) {
        for (const [rowOffset, colOffset] of directions) {
          const nextRow = currRow + rowOffset;
          const nextCol = currCol + colOffset;
          queue.push([nextRow, nextCol]);
        }
      }
    }

    // update board states using visitedTiles
    setBoard(prev => {
      const updatedBoard = [...prev];

      visitedTiles.forEach(tile => {
        const tileRow = Number(tile.slice(0, tile.indexOf(':')));
        const tileCol = Number(tile.slice(tile.indexOf(':') + 1));

        updatedBoard[tileRow][tileCol].state = 1;
      });

      return [...updatedBoard];
    });
  };

  // triggered on game over, reveals all mines on board
  const revealAllMines = () => {
    setBoard(prev => {
      const updatedBoard = [...prev];

      for (let row = 0; row < updatedBoard.length; row++) {
        for (let col = 0; col < updatedBoard[0].length; col++) {
          const currentTile = updatedBoard[row][col];

          if (currentTile.value === 'x') {
            if (currentTile.state !== 'f') {
              updatedBoard[row][col].state = 1;
            }
          }
        }
      }

      return updatedBoard;
    });
  };

  // generates new game board with a given (width, height, mineCount)
  // and sets the game state to active
  const generateNewBoard = (width, height, mineCount) => {
    setBoardWidth(width);
    setBoardHeight(height);
    setBoardMineCount(mineCount);
    setBoard(generateMinesweeperBoard(width, height, mineCount));
    setGameState('playing');
  };

  // generates new board state without updating width, height, or mine count
  const resetBoard = () => {
    setBoard(generateMinesweeperBoard(boardWidth, boardHeight, boardMineCount));
    setGameState('playing');
  };

  // checks if all tiles are flipped and all mines are flagged
  // then triggers game win
  const checkWin = () => {
    let flaggedMines = 0;
    let flippedTiles = 0;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const currentTile = board[row][col];

        if (currentTile.state !== 0) {
          flippedTiles++;
        }

        if (currentTile.value === 'x' && currentTile.state === 'f') {
          flaggedMines++;
        }
      }
    }

    if (
      flaggedMines === boardMineCount &&
      flippedTiles === boardWidth * boardHeight
    ) {
      setGameState('win');
      console.log('game win');
    }
  };

  // returns the tile value at [row, col]
  const getTile = (row, col) => {
    // catches issues with out of sync tile updates
    if (row < boardHeight && col < boardWidth) {
      return board[row][col];
    }

    return null;
  };

  // reveals the tile at [row, col]
  const selectTile = (row, col) => {
    // skip flagged tiles
    if (board[row][col].state === 'f') {
      return;
    }

    // look for empty section of board if tile is empty
    if (board[row][col].value === 0) {
      searchNearbyTiles(row, col, board);
      return;
    }

    // reveal a single tile
    setBoard(prev => {
      const updatedBoard = [...prev];
      updatedBoard[row][col].state = 1;
      return updatedBoard;
    });

    // check for mine
    // if mine, trigger game loss
    // if no mine, check for game win
    if (board[row][col].value === 'x') {
      console.log('game over');
      setGameState('lose');
      revealAllMines();
    } else {
      checkWin();
    }
  };

  // toggle flag state for a tile
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

    checkWin();
  };

  const globalStateValue = {
    board,
    getTile,
    flagTile,
    selectTile,
    gameState,
    boardWidth,
    boardHeight,
    // boardScale,
    boardMineCount,
    generateNewBoard,
    resetBoard,
  };

  return (
    <GlobalContext.Provider value={globalStateValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
