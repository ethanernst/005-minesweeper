import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import GlobalContext from '../store/GlobalContext';

// tile images
import tileEmpty from '../assets/tile.jpg';
import tile0 from '../assets/0.png';
import tile1 from '../assets/1.png';
import tile2 from '../assets/2.png';
import tile3 from '../assets/3.png';
import tile4 from '../assets/4.png';
import tile5 from '../assets/5.png';
import tile6 from '../assets/6.png';
import tile7 from '../assets/7.png';
import tile8 from '../assets/8.png';
import tileX from '../assets/x.png';
import tileF from '../assets/f.png';
import tileW from '../assets/w.png';

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
  const { getTile, selectTile, flagTile, gameActive } =
    useContext(GlobalContext);

  // independant state for this tile, set to initial state value
  const [tileValue, setTileValue] = useState(getTile(row, column));

  // calculate scaled tile size
  const SIZE = tileSize * scale;

  // set image url
  const imageUrl = imageUrls[tileValue] || imageUrls.default;

  // trigger tile action in context
  const handleClick = e => {
    e.preventDefault();

    // disable input if game over
    if (!gameActive) {
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
      setTileValue('default');
      return;
    }

    // reveal incorrectly flagged tiles on game end
    if (!gameActive && tile.state === 'f' && tile.value !== 'x') {
      setTileValue('w');
      return;
    }

    // flagged
    if (tile.state === 'f') {
      setTileValue('f');
      return;
    }

    // revealed
    setTileValue(tile.value);
  }, [getTile, gameActive]);

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
