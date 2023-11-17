import styled from 'styled-components';

import tileImg from '../assets/tile.jpg';
import { useContext } from 'react';
import GlobalContext from '../store/GlobalContext';

const TileStyle = styled.td`
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
  const { getCellValue } = useContext(GlobalContext);

  const SIZE = tileSize * scale;
  // const value = getCellValue(row, column);

  const handleClick = e => {
    e.preventDefault();

    console.log(value);
  };

  return (
    <TileStyle $size={SIZE} onClick={handleClick}>
      <img src={tileImg} />
    </TileStyle>
  );
}

export default Tile;
