import { useEffect, useState } from 'react';

import styled from 'styled-components';

import Tile from './Tile';

const Container = styled.table.attrs(
  ({ $width, $height, $scale, $tileSize }) => ({
    style: {
      width: `${$width * $scale * $tileSize}px`,
      height: `${$height * $scale * $tileSize}px`,
    },
  })
)`
  background-color: transparent;
  border: 4px dashed black;
  gap: 0px;
`;

function Game({ width, height, scale, tileSize }) {
  const [boardState, setBoardState] = useState([]);
  const [boardJsx, setBoardJsx] = useState([]);

  // update board when width / height changes
  useEffect(() => {
    const newState = [];
    for (let row = 0; row < height; row++) {
      const column = [];
      for (let columns = 0; columns < width; columns++) {
        column.push(0);
      }
      newState.push(column);
    }

    setBoardState(newState);
  }, [width, height, scale, tileSize]);

  // generate game board
  useEffect(() => {
    if (!boardState) {
      return;
    }

    console.log('displaying board');

    const board = [];

    for (let row = 0; row < height; row++) {
      const boardColumn = [];
      for (let column = 0; column < width; column++) {
        boardColumn.push(
          <Tile
            key={`${row}:${column}`}
            id={`${row}:${column}`}
            // value={boardState[row][column]}
            tileSize={tileSize}
            scale={scale}
          />
        );
      }
      board.push(<tr key={row}>{boardColumn}</tr>);
    }

    setBoardJsx(board);
  }, [boardState]);

  console.log(boardState);
  console.log(boardJsx);

  return (
    <Container
      $width={width}
      $height={height}
      $scale={scale}
      $tileSize={tileSize}
    >
      <tbody>{boardJsx}</tbody>
    </Container>
  );
}

export default Game;
