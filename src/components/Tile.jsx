import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import GlobalContext from '../store/GlobalContext';

// tile images
import tileEmpty from '../assets/tiles/tile.jpg';
import tile0 from '../assets/tiles/0.png';
import tile1 from '../assets/tiles/1.png';
import tile2 from '../assets/tiles/2.png';
import tile3 from '../assets/tiles/3.png';
import tile4 from '../assets/tiles/4.png';
import tile5 from '../assets/tiles/5.png';
import tile6 from '../assets/tiles/6.png';
import tile7 from '../assets/tiles/7.png';
import tile8 from '../assets/tiles/8.png';
import tileX from '../assets/tiles/x.png';
import tileF from '../assets/tiles/f.png';
import tileW from '../assets/tiles/w.png';

const imageUrls = {
  0: tile0,
  1: tile1,
  2: tile2,
  3: tile3,
  4: tile4,
  5: tile5,
  6: tile6,
  7: tile7,
  8: tile8,
  x: tileX,
  f: tileF,
  w: tileW,
  default: tileEmpty,
};

const TileContainer = styled.td`
  margin: 0px;
  padding: 0px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  img {
    display: block;
    margin: 0px;
    padding: 0px;
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    pointer-events: none;
  }
`;

function Tile({ tileSize, scale, row, column }) {
  const { getTile, selectTile, flagTile, gameState } =
    useContext(GlobalContext);

  // independant state, updated by effect when board updates
  const [tileState, setTileState] = useState('default');
  const tileValue = getTile(row, column)?.value;

  // calculate scaled tile size
  const SIZE = tileSize * scale;

  // set image url
  const imageUrl = imageUrls[tileState] || imageUrls.default;

  // trigger tile action in context
  const handleClick = e => {
    e.preventDefault();

    // disable input if win or lose
    if (gameState !== 'playing') {
      return;
    }

    // left click
    if (e.nativeEvent.button === 0) {
      selectTile(row, column);
    }

    // right click
    if (e.nativeEvent.button === 2) {
      flagTile(row, column);
    }
  };

  // updates tile when board updates or game ends, helps catch errors
  useEffect(() => {
    const tile = getTile(row, column);
    // tile ==> { state, value }

    // invalid / out of sync tile state
    // happens when reducing board size
    // ingore null value until unmounted by Game component
    if (!tile) {
      return;
    }

    // not revealed
    if (!tile.state) {
      setTileState('default');
      return;
    }

    // reveal incorrectly flagged tiles on game end
    if (gameState === 'lose' && tile.state === 'f' && tile.value !== 'x') {
      setTileState('w');
      return;
    }

    // flagged
    if (tile.state === 'f') {
      setTileState('f');
      return;
    }

    // revealed
    setTileState(tile.value);
  }, [getTile, gameState]);

  return (
    <TileContainer
      $size={SIZE}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      <img src={imageUrl} />
    </TileContainer>
  );
}

export default Tile;
