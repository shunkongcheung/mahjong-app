import type { NextPage } from "next";
import styled from "styled-components";

import { Tile } from "../../components";
import * as constants from "../../constants";

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TileDemo: NextPage = () => {
  return (
    <main>
      <Row>
        <Tile type={constants.Dot.One} width={70} />
        <Tile type={constants.Dot.Two} width={70} />
        <Tile type={constants.Dot.Three} width={70} />
        <Tile type={constants.Dot.Four} width={70} />
        <Tile type={constants.Dot.Five} width={70} />
        <Tile type={constants.Dot.Six} width={70} />
        <Tile type={constants.Dot.Seven} width={70} />
        <Tile type={constants.Dot.Eight} width={70} />
        <Tile type={constants.Dot.Nine} width={70} />
      </Row>
      <Row>
        <Tile type={constants.Character.One} width={70} />
        <Tile type={constants.Character.Two} width={70} />
        <Tile type={constants.Character.Three} width={70} />
        <Tile type={constants.Character.Four} width={70} />
        <Tile type={constants.Character.Five} width={70} />
        <Tile type={constants.Character.Six} width={70} />
        <Tile type={constants.Character.Seven} width={70} />
        <Tile type={constants.Character.Eight} width={70} />
        <Tile type={constants.Character.Nine} width={70} />
      </Row>
      <Row>
        <Tile type={constants.Bamboo.One} width={70} />
        <Tile type={constants.Bamboo.Two} width={70} />
        <Tile type={constants.Bamboo.Three} width={70} />
        <Tile type={constants.Bamboo.Four} width={70} />
        <Tile type={constants.Bamboo.Five} width={70} />
        <Tile type={constants.Bamboo.Six} width={70} />
        <Tile type={constants.Bamboo.Seven} width={70} />
        <Tile type={constants.Bamboo.Eight} width={70} />
        <Tile type={constants.Bamboo.Nine} width={70} />
      </Row>
      <Row>
        <Tile type={constants.Season.East} width={70} />
        <Tile type={constants.Season.South} width={70} />
        <Tile type={constants.Season.West} width={70} />
        <Tile type={constants.Season.North} width={70} />
        <Tile type={constants.Flower.East} width={70} />
        <Tile type={constants.Flower.South} width={70} />
        <Tile type={constants.Flower.West} width={70} />
        <Tile type={constants.Flower.North} width={70} />
      </Row>

      <Row>
        <Tile type={constants.Dragon.Red} width={70} />
        <Tile type={constants.Dragon.Green} width={70} />
        <Tile type={constants.Dragon.White} width={70} />
        <Tile type={constants.Wind.East} width={70} />
        <Tile type={constants.Wind.South} width={70} />
        <Tile type={constants.Wind.West} width={70} />
        <Tile type={constants.Wind.North} width={70} />
      </Row>
    </main>
  );
};

export default TileDemo;
