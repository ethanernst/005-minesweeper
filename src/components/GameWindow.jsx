import useWindowDimensions from '../hooks/useWindowDimensions';

import styled from 'styled-components';

import Game from './Game';
import { useState } from 'react';

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

  align-items: center;
  justify-content: start;

  h1 {
    font-size: 48pt;
    margin: 5px;
  }
`;

const Settings = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SettingsContent = styled.div`
  flex: 1;

  display: flex;
`;

const SettingsContentGroup = styled.div`
  flex: 1;
  width: 300px;
  text-align: center;
`;

const GameContainer = styled.div`
  flex: 1;
  background-color: lightgray;

  display: flex;
  justify-content: center;
  align-items: center;
`;

function GameWindow() {
  const { height, width } = useWindowDimensions();

  const HEADERHEIGHTINPX = 250;

  const TILESIZEINPX = 20;
  const TILESCALE = 1;

  const minBoardWidth = 5;
  const maxBoardWidth = Math.floor(width / (TILESIZEINPX * TILESCALE));
  const [boardWidth, setBoardWidth] = useState(Math.floor(maxBoardWidth / 2));

  const minBoardHeight = 5;
  const maxBoardHeight = Math.floor(
    (height - HEADERHEIGHTINPX) / (TILESIZEINPX * TILESCALE)
  );
  const [boardHeight, setBoardHeight] = useState(
    Math.floor(maxBoardHeight / 2)
  );

  const minMineCount = 5;
  const maxMineCount = Math.floor(boardWidth * boardHeight * 0.8);
  const [boardMineCount, setBoardMineCount] = useState(
    Math.floor(boardWidth * boardHeight * 0.25)
  );

  const handleUpdateBoardWidth = e => {
    e.preventDefault();

    let newValue = e.target.value;
    if (newValue > maxBoardWidth) {
      newValue = maxBoardWidth;
    }

    if (newValue < minBoardWidth) {
      newValue = minBoardWidth;
    }

    setBoardWidth(newValue);
  };

  const handleUpdateBoardHeight = e => {
    e.preventDefault();

    let newValue = e.target.value;
    if (newValue > maxBoardHeight) {
      newValue = maxBoardHeight;
    }

    if (newValue < minBoardHeight) {
      newValue = minBoardHeight;
    }

    setBoardHeight(newValue);
  };

  const handleUpdateBoardMineCount = e => {
    e.preventDefault();

    let newValue = e.target.value;
    if (newValue > maxMineCount) {
      newValue = maxMineCount;
    }

    if (newValue < minMineCount) {
      newValue = minMineCount;
    }

    setBoardMineCount(newValue);
  };

  return (
    <Container>
      <Header $height={HEADERHEIGHTINPX}>
        <h1>minesweeper</h1>
        <Settings>
          <h2>Settings</h2>
          <SettingsContent>
            <SettingsContentGroup>
              <h3>Game</h3>
              <p>New game</p>
              <p>Reset</p>
            </SettingsContentGroup>
            <SettingsContentGroup>
              <h3>Board Size</h3>
              <label htmlFor="width">Width: </label>
              <input
                type="number"
                name="width"
                min={minBoardWidth}
                max={maxBoardWidth}
                onChange={handleUpdateBoardWidth}
                value={boardWidth}
              />
              <label htmlFor="height">Height: </label>
              <input
                type="number"
                name="height"
                min={minBoardHeight}
                max={maxBoardHeight}
                value={boardHeight}
                onChange={handleUpdateBoardHeight}
              />
              <label htmlFor="mines">Mines: </label>
              <input
                type="number"
                name="mines"
                min={minMineCount}
                max={maxMineCount}
                value={boardMineCount}
                onChange={handleUpdateBoardMineCount}
              />
            </SettingsContentGroup>
            <SettingsContentGroup>
              <h3>Game Window</h3>
              <p>
                width: {width}px ({maxBoardWidth} tiles max)
              </p>
              <p>
                height: {height}px ({maxBoardHeight} tiles max)
              </p>
              <p>mine count: {boardMineCount}</p>
            </SettingsContentGroup>
          </SettingsContent>
        </Settings>
      </Header>
      <GameContainer>
        <Game
          width={boardWidth}
          height={boardHeight}
          scale={TILESCALE}
          tileSize={TILESIZEINPX}
        />
      </GameContainer>
    </Container>
  );
}

export default GameWindow;
