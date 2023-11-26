import { useContext, useEffect, useRef, useState } from 'react';

import useWindowDimensions from '../hooks/useWindowDimensions';

import styled from 'styled-components';

import Game from './Game';
import GlobalContext from '../store/GlobalContext';

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

  align-items: center;
  justify-content: center;

  h1 {
    font-size: 48pt;
    margin: 0px 0px 0px 15px;
    min-width: 400px;
  }
`;

const Settings = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
`;

const SettingsGroup = styled.div`
  width: max-content;
  min-width: 120px;

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

  .win {
    background-color: green;
    color: white;
    border-radius: 10px;
    line-height: 3;
    margin: 8px 0px;
  }

  .lose {
    background-color: #cc4444;
    color: white;
    border-radius: 10px;
    line-height: 3;
    margin: 8px 0px;
  }
`;

const GameContainer = styled.div`
  flex: 1;
  background-color: lightgray;

  display: flex;
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
  const {
    boardWidth,
    boardHeight,
    boardMineCount,
    generateNewBoard,
    resetBoard,
    gameState,
  } = useContext(GlobalContext);

  const widthRef = useRef();
  const heightRef = useRef();
  const mineCountRef = useRef();

  const HEADERHEIGHTINPX = 250;

  const TILESIZEINPX = 20;
  const TILESCALE = 1;

  const minBoardWidth = 5;
  const maxBoardWidth = Math.floor(width / (TILESIZEINPX * TILESCALE)) - 1;

  const minBoardHeight = 5;
  const maxBoardHeight =
    Math.floor((height - HEADERHEIGHTINPX) / (TILESIZEINPX * TILESCALE)) - 1;

  const maxMineCount = Math.floor(maxBoardWidth * maxBoardHeight * 0.9);

  // triggers a new board in context using input params
  const handleUpdateGame = e => {
    e.preventDefault();

    const newWidth = Number(widthRef.current.value);
    const newHeight = Number(heightRef.current.value);
    const newMineCount = Number(mineCountRef.current.value);
    generateNewBoard(newWidth, newHeight, newMineCount);
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
          <SettingsGroup $color={'lightcoral'}>
            {gameState === 'win' && <p className="win">You win!</p>}
            {gameState === 'lose' && <p className="lose">You lose!</p>}
            <button onClick={handleResetBoard}>Reset</button>
          </SettingsGroup>
          <SettingsGroup $color={'lightblue'}>
            <form onSubmit={handleUpdateGame}>
              <div>
                <label htmlFor="width">Width: </label>
                <input
                  ref={widthRef}
                  type="number"
                  name="width"
                  min={minBoardWidth}
                  max={maxBoardWidth}
                  defaultValue={boardWidth}
                />
              </div>
              <div>
                <label htmlFor="height">Height: </label>
                <input
                  ref={heightRef}
                  type="number"
                  name="height"
                  min={minBoardHeight}
                  max={maxBoardHeight}
                  defaultValue={boardHeight}
                />
              </div>
              <div>
                <label htmlFor="mines">Mines: </label>
                <input
                  ref={mineCountRef}
                  type="number"
                  name="mines"
                  min={1}
                  max={maxMineCount}
                  defaultValue={boardMineCount}
                />
              </div>
              <button type="submit">Update</button>
            </form>
          </SettingsGroup>
          <SettingsGroup>
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
