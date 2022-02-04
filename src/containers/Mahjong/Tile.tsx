import React, { useMemo } from "react";
import styled from "styled-components";
import { TileType } from "./constants";

interface TileProps {
  type: TileType;
  width: number | string;
}

const Container = styled.div<{ width: number | string }>`
  position: relative;
  width: ${({ width }) => (typeof width === "string" ? width : `${width}px`)};

  &:after {
    content: " ";
    display: block;
    padding-top: 130%;
  }
`;

const TileImage = styled.div<{ offsetX: number; offsetY: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: url(/mahjong-tiles.jpg) ${({ offsetX }) => 12.5 * offsetX}%
    ${({ offsetY }) => offsetY * 25}% / 1000% 540%;
`;

const Tile: React.FC<TileProps> = ({ width, type }) => {
  const [groupName, position] = type.split(".");
  const offsetX = useMemo(() => Number(position) - 1, [position]);
  const offsetY = useMemo(() => {
    switch (groupName) {
      case "dot":
        return 0;
      case "character":
        return 1;
      case "bamboo":
        return 2;
      case "flower":
        return 3;
      case "dragon":
        return 4;
      case "wind":
        return 4;
      default:
        return 0;
    }
  }, [groupName]);

  return (
    <Container width={width}>
      <TileImage offsetX={offsetX} offsetY={offsetY} />
    </Container>
  );
};

export default Tile;
