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
  const { getTile, selectTile, flagTile } = useContext(GlobalContext);

  const [cellValue, setCellValue] = useState(getTile(row, column));

  // calculate scaled tile size
  const SIZE = tileSize * scale;

  // set image url
  const imageUrl = imageUrls[cellValue] || imageUrls.default;

  // trigger cell action in context
  const handleClick = e => {
    e.preventDefault();

    // left click
    if (e.nativeEvent.button === 0) {
      selectTile(row, column);
    }
    // right click
    if (e.nativeEvent.button === 2) {
      flagTile(row, column);
    }
  };

  // updates cell when board updates
  // tileState values:
  // 0 -> not visited
  // f -> flagged
  // 1 -> visited
  useEffect(() => {
    const { state, value } = getTile(row, column);

    // not visited
    if (!state) {
      setCellValue('default');
      return;
    }

    // flagged
    if (state === 'f') {
      setCellValue('f');
      return;
    }

    setCellValue(value);
  }, [getTile]);

  return (
    <TileContainer
      $imgUrl={imageUrl}
      $size={SIZE}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      <img src={imageUrl} />
    </TileContainer>
  );
}

export default Tile;
