import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import Tile from './Tile';
import GlobalContext from '../store/GlobalContext';

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
  border-collapse: collapse;
  table-layout: fixed;
`;

function Game({ scale, tileSize }) {
  const { boardWidth, boardHeight } = useContext(GlobalContext);
  const [boardJsx, setBoardJsx] = useState([]);

  // generate game board
  useEffect(() => {
    console.log('displaying board');
    const boardJsx = [];

    for (let row = 0; row < boardHeight; row++) {
      const boardColumn = [];
      for (let column = 0; column < boardWidth; column++) {
        boardColumn.push(
          <Tile
            key={`${row}:${column}`}
            tileSize={tileSize}
            scale={scale}
            row={row}
            column={column}
          />
        );
      }
      boardJsx.push(<tr key={row}>{boardColumn}</tr>);
    }

    setBoardJsx(boardJsx);
  }, [boardWidth, boardHeight]);

  // console.log(board);
  // console.log(boardJsx);

  return (
    <Container
      $width={boardWidth}
      $height={boardHeight}
      $scale={scale}
      $tileSize={tileSize}
    >
      <tbody>{boardJsx}</tbody>
    </Container>
  );
}

export default Game;
