import { useContext, useRef, useState } from 'react';

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
  const { boardWidth, boardHeight, boardMineCount, generateNewBoard } =
    useContext(GlobalContext);

  const widthRef = useRef();
  const heightRef = useRef();
  const mineCountRef = useRef();

  const HEADERHEIGHTINPX = 250;

  const TILESIZEINPX = 20;
  const TILESCALE = 1;

  const minBoardWidth = 5;
  const maxBoardWidth = Math.floor(width / (TILESIZEINPX * TILESCALE));

  const minBoardHeight = 5;
  const maxBoardHeight = Math.floor(
    (height - HEADERHEIGHTINPX) / (TILESIZEINPX * TILESCALE)
  );

  const handleUpdateGame = e => {
    e.preventDefault();

    const newWidth = widthRef.current.value;
    const newheight = heightRef.current.value;
    const newMineCount = mineCountRef.current.value;
    generateNewBoard(newWidth, newheight, newMineCount);
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
              <form onSubmit={handleUpdateGame}>
                <label htmlFor="width">Width: </label>
                <input
                  ref={widthRef}
                  type="number"
                  name="width"
                  min={minBoardWidth}
                  max={maxBoardWidth}
                  defaultValue={boardWidth}
                />
                <label htmlFor="height">Height: </label>
                <input
                  ref={heightRef}
                  type="number"
                  name="height"
                  min={minBoardHeight}
                  max={maxBoardHeight}
                  defaultValue={boardHeight}
                />
                <label htmlFor="mines">Mines: </label>
                <input
                  ref={mineCountRef}
                  type="number"
                  name="mines"
                  min={1}
                  max={200}
                  defaultValue={boardMineCount}
                />
                <button type="submit">Update</button>
              </form>
            </SettingsContentGroup>
            <SettingsContentGroup>
              <h3>Game Window</h3>
              <p>
                width: {width}px ({maxBoardWidth} tiles max)
              </p>
              <p>
                height: {height - HEADERHEIGHTINPX}px ({maxBoardHeight} tiles
                max)
              </p>
              <p>mine count: {boardMineCount}</p>
            </SettingsContentGroup>
          </SettingsContent>
        </Settings>
      </Header>
      <GameContainer>
        <Game scale={TILESCALE} tileSize={TILESIZEINPX} />
      </GameContainer>
    </Container>
  );
}

export default GameWindow;
