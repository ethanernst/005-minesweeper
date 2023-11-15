import styled from 'styled-components';

const TileStyle = styled.td`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  background-color: skyblue;
`;

function Tile({ tileSize, scale, id, value }) {
  const SIZE = tileSize * scale;

  return <TileStyle $size={SIZE}></TileStyle>;
}

export default Tile;
