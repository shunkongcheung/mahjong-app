import { NextPage } from "next";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { Tile } from "../../components";
import * as constants from "../../constants";
import {
  getFeasibility,
  getInitialGame,
  getInitialTiles,
  getTileScore,
} from "../../services";

interface DemoSetProps {
  set: Array<{
    name: string;
    options: Array<{ name: string; call: () => any }>;
  }>;
}

const Container = styled.div``;

const Divider = styled.div`
  background: #ccc;
  width: 100%;
  height: 2px;
  margin: 10px 0;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DemoSet: React.FC<DemoSetProps> = ({ set }) => (
  <select>
    {set.map(({ name, options }, idx) => (
      <optgroup label={name} key={`${name}-${idx}`}>
        {options.map(({ name, call }, jdx) => (
          <option
            value={name}
            key={`${name}-${idx}-${jdx}`}
            onClick={() => console.log(call())}
          >
            {name}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
);

const ServicesDemo: NextPage = () => {
  const [tiles, setTiles] = useState<Array<constants.TileType>>([]);
  const [committed, setCommitted] = useState<Array<Array<constants.TileType>>>(
    []
  );
  const [remains, setRemains] = useState(getInitialTiles());

  const handleAddTile = useCallback(
    (tile: constants.TileType) => {
      setTiles((o) => {
        if (o.length >= 14) return o;
        return [...o, tile].sort();
      });
    },
    [setTiles]
  );

  const handleRemoveTile = useCallback(
    (idx: number) => {
      setTiles((o) => {
        const temp = [...o];
        temp.splice(idx, 1);
        return [...temp].sort();
      });
    },
    [setTiles]
  );

  const handleCommit = useCallback(() => {
    setCommitted((o) => {
      return [tiles, ...o];
    });
    setTiles([]);
  }, [setCommitted, setTiles, tiles]);

  const handleRemoveCommit = useCallback(
    (idx: number) => {
      setCommitted((o) => {
        const temp = [...o];
        temp.splice(idx, 1);
        return [...temp].sort();
      });
    },
    [setCommitted]
  );

  return (
    <Container>
      <DemoSet
        set={[
          {
            name: "Initial Tiles",
            options: [
              {
                name: "ordered tiles",
                call: () => getInitialTiles(false),
              },
              {
                name: "random tiles",
                call: () => getInitialTiles(),
              },
            ],
          },
          {
            name: "Game State",
            options: [
              {
                name: "initial game",
                call: () => getInitialGame(),
              },
            ],
          },
          {
            name: "Tile Score",
            options: [
              {
                name: "Score",
                call: () =>
                  getTileScore(tiles, committed, [
                    constants.Wind.East,
                    constants.Wind.West,
                  ]),
              },
            ],
          },
          {
            name: "Game play",
            options: [
              {
                name: "Generate Random game",
                call: () => {
                  // reset game
                  const game = getInitialGame();

                  // get remains (from player 0 perspective)
                  // as far as his concern, there are tiles out on the wall
                  // and on players' hand, anything not on his hand / onTable
                  // are remains
                  let remains = [...game.walls];
                  for (let idx = 1; idx < 4; idx++)
                    remains = [...remains, ...game.players[idx].onHands];
                  setRemains(remains);
                  setTiles(game.players[0].onHands);
                  console.log(game);
                },
              },
              {
                name: "Feasibility",
                call: () => getFeasibility(tiles, committed, remains),
              },
            ],
          },
        ]}
      />
      <Divider />
      {committed.map((tiles, idx) => (
        <Row key={`Row-${idx}`}>
          <button onClick={() => handleRemoveCommit(idx)}>remove</button>
          {tiles.map((tile, jdx) => (
            <Tile
              type={tile}
              width={70}
              key={`CommitedTile-${idx}-${tile}-${jdx}`}
            />
          ))}
        </Row>
      ))}
      <Row>
        <button onClick={handleCommit}>commit</button>
        {tiles.map((tile, idx) => (
          <div
            onMouseDown={() => handleRemoveTile(idx)}
            key={`Tile-${tile}-${idx}`}
          >
            <Tile type={tile} width={70} />
          </div>
        ))}
      </Row>
      <Divider />
      <Row>
        {[
          constants.Dot.One,
          constants.Dot.Two,
          constants.Dot.Three,
          constants.Dot.Four,
          constants.Dot.Five,
          constants.Dot.Six,
          constants.Dot.Seven,
          constants.Dot.Eight,
          constants.Dot.Nine,
        ].map((tile, idx) => (
          <div
            onClick={() => handleAddTile(tile)}
            key={`TileSet-${tile}-${idx}`}
          >
            <Tile type={tile} width={70} />
          </div>
        ))}
      </Row>
      <Row>
        {[
          constants.Character.One,
          constants.Character.Two,
          constants.Character.Three,
          constants.Character.Four,
          constants.Character.Five,
          constants.Character.Six,
          constants.Character.Seven,
          constants.Character.Eight,
          constants.Character.Nine,
        ].map((tile, idx) => (
          <div
            onClick={() => handleAddTile(tile)}
            key={`TileSet-${tile}-${idx}`}
          >
            <Tile type={tile} width={70} />
          </div>
        ))}
      </Row>
      <Row>
        {[
          constants.Bamboo.One,
          constants.Bamboo.Two,
          constants.Bamboo.Three,
          constants.Bamboo.Four,
          constants.Bamboo.Five,
          constants.Bamboo.Six,
          constants.Bamboo.Seven,
          constants.Bamboo.Eight,
          constants.Bamboo.Nine,
        ].map((tile, idx) => (
          <div
            onClick={() => handleAddTile(tile)}
            key={`TileSet-${tile}-${idx}`}
          >
            <Tile type={tile} width={70} />
          </div>
        ))}
      </Row>
      <Row>
        {[
          constants.Dragon.Red,
          constants.Dragon.Green,
          constants.Dragon.White,
          constants.Wind.East,
          constants.Wind.South,
          constants.Wind.West,
          constants.Wind.North,
        ].map((tile, idx) => (
          <div
            onClick={() => handleAddTile(tile)}
            key={`TileSet-${tile}-${idx}`}
          >
            <Tile type={tile} width={70} />
          </div>
        ))}
      </Row>
    </Container>
  );
};

export default ServicesDemo;
