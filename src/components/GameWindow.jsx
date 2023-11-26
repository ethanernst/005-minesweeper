import { useContext, useEffect, useState } from 'react';

import useWindowDimensions from '../hooks/useWindowDimensions';

import styled from 'styled-components';

import Game from './Game';
import GlobalContext from '../store/GlobalContext';

import windowIcon from '../assets/windowIcon.png';

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  background-color: #222222;
  height: ${({ $height }) => $height}px;
  width: 100%;

  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  z-index: 999;

  align-items: center;
  justify-content: center;

  h1 {
    font-size: 48pt;
    margin: 0px 0px 0px 15px;
    min-width: 450px;
  }
`;

const Settings = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`;

const SettingsGroup = styled.div`
  width: max-content;
  min-width: 100px;

  margin: 0px 20px;

  display: flex;
  flex-direction: column;
  text-align: center;

  p {
    line-height: 1;
  }

  input {
    margin: 3px 0px;
  }

  button {
    display: inline-block;
    border: none;
    border-radius: 10px;
    padding: 1rem;
    margin: 10px;

    text-decoration: none;
    background: lightgray;
    color: black;

    font-family: inherit;
    font-size: 1rem;
    text-align: center;

    cursor: pointer;
    transition: background 250ms ease-in-out, transform 150ms ease;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  button:hover {
    background: ${({ $color }) => $color};
  }

  button:active {
    transform: scale(0.99);
  }

  .reset-button {
    margin: 5px;
    padding: 10px;
  }

  .reset-button:hover {
    background: lightcoral;
  }

  .window-button {
    margin: 5px;
    padding: 4px;
  }

  .win {
    background-color: green;
    color: white;
    border-radius: 10px;
    margin: 0px 0px 5px 0px;
    padding: 10px;
  }

  .lose {
    background-color: #cc4444;
    color: white;
    border-radius: 10px;
    margin: 0px 0px 5px 0px;
    padding: 10px;
  }
`;

const GameContainer = styled.div`
  flex: 1;
  background-color: lightgray;

  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;

  // disables selection of the board or any images
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

function GameWindow() {
  const { height, width } = useWindowDimensions();
  const { generateNewBoard, resetBoard, gameState } = useContext(GlobalContext);

  const HEADERHEIGHTINPX = 250;
  const TILESIZEINPX = 20;
  const TILESCALE = 1;

  const minBoardWidth = 5;
  const maxBoardWidth = Math.floor(width / (TILESIZEINPX * TILESCALE)) - 1;
  const optimizedBoardWidth = Math.floor(maxBoardWidth / 2);
  const [boardWidth, setBoardWidth] = useState(optimizedBoardWidth);

  const minBoardHeight = 5;
  const maxBoardHeight =
    Math.floor((height - HEADERHEIGHTINPX) / (TILESIZEINPX * TILESCALE)) - 1;
  const optimizedBoardHeight = Math.floor(maxBoardHeight / 2);
  const [boardHeight, setBoardHeight] = useState(optimizedBoardHeight);

  const maxMineCount = Math.floor(maxBoardWidth * maxBoardHeight * 0.9);
  const currentMaxMineCount = Math.floor(boardWidth * boardHeight * 0.9);
  const optimizedMineCount = Math.floor(
    optimizedBoardWidth * optimizedBoardHeight * 0.1
  );
  const [mineCount, setMineCount] = useState(optimizedMineCount);

  // regenerates the game board to fit the window
  const handleWindowSizing = e => {
    e?.preventDefault();

    // generate max size board if window button right click
    if (e?.nativeEvent.button === 2) {
      const maxBoardSizeOptimizedMineCount = Math.floor(
        maxBoardWidth * maxBoardHeight * 0.1
      );

      generateNewBoard(
        maxBoardWidth,
        maxBoardHeight,
        maxBoardSizeOptimizedMineCount
      );

      setBoardWidth(maxBoardWidth);
      setBoardHeight(maxBoardHeight);
      setMineCount(maxBoardSizeOptimizedMineCount);
      return;
    }

    generateNewBoard(
      optimizedBoardWidth,
      optimizedBoardHeight,
      optimizedMineCount
    );

    // update values to window optimizied board
    setBoardWidth(optimizedBoardWidth);
    setBoardHeight(optimizedBoardHeight);
    setMineCount(optimizedMineCount);
  };

  // runs once immediately on first load to initialize board size
  // and alert user how to use window size button
  useEffect(() => {
    handleWindowSizing();
    alert(
      'Click the window size button (below the reset button) to generate an optimized board, right click to generate a max size board.'
    );
  }, []);

  // triggers a new board in context using input params
  const handleUpdateGame = e => {
    e.preventDefault();

    generateNewBoard(boardWidth, boardHeight, mineCount);
  };

  // resets current board state using current params without regenerating board jsx
  const handleResetBoard = e => {
    e.preventDefault();

    resetBoard();
  };

  return (
    <Container>
      <Header $height={HEADERHEIGHTINPX}>
        <h1>minesweeper</h1>
        <Settings>
          <SettingsGroup $color={'lightblue'}>
            {gameState === 'win' && <p className="win">You win!</p>}
            {gameState === 'lose' && <p className="lose">You lose!</p>}
            <button onClick={handleResetBoard} className="reset-button">
              Reset
            </button>
            <button
              onClick={handleWindowSizing}
              onContextMenu={handleWindowSizing}
              className="window-button"
            >
              <img src={windowIcon} />
            </button>
          </SettingsGroup>
          <SettingsGroup $color={'lightblue'}>
            <form onSubmit={handleUpdateGame}>
              <div>
                <label htmlFor="width">Width: </label>
                <input
                  type="number"
                  name="width"
                  min={minBoardWidth}
                  max={maxBoardWidth}
                  value={boardWidth}
                  onChange={e => setBoardWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="height">Height: </label>
                <input
                  type="number"
                  name="height"
                  min={minBoardHeight}
                  max={maxBoardHeight}
                  value={boardHeight}
                  onChange={e => setBoardHeight(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="mines">Mines: </label>
                <input
                  type="number"
                  name="mines"
                  min={1}
                  max={currentMaxMineCount}
                  value={mineCount}
                  onChange={e => setMineCount(Number(e.target.value))}
                />
              </div>
              <button type="submit">Update</button>
            </form>
          </SettingsGroup>
          <SettingsGroup $color={'lightblue'}>
            <p>Max width: {maxBoardWidth} tiles</p>
            <p>Max height: {maxBoardHeight} tiles</p>
            <p>Max mines: {maxMineCount}</p>
          </SettingsGroup>
        </Settings>
      </Header>
      <GameContainer>
        <Game scale={TILESCALE} tileSize={TILESIZEINPX} />
      </GameContainer>
    </Container>
  );
}

export default GameWindow;
