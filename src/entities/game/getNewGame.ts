import { Flower, Wind } from "../../constants";

import { Game, Players } from "./constants";
import getInitialTiles from "./getInitialTiles";

const getNewGame = (players: Players): Game => {
  const gameWind = Wind.East;
  const winds = [Wind.East, Wind.South, Wind.West, Wind.North];
  const flowers = [
    [Flower.Spring, Flower.Plum],
    [Flower.Summer, Flower.Orchid],
    [Flower.Autumn, Flower.Chrysanthemum],
    [Flower.Winter, Flower.Bamboo],
  ];

  players.map((player, idx) => {
    player.gameWinds = [gameWind, winds[idx]];
    player.gameFlowers = flowers[idx];
    player.flowers = [];
    player.onHands = [];
    player.committed = [];
  });

  return {
    players,
    onTable: [],
    walls: getInitialTiles(),
    wind: gameWind,
    brookerIndex: 0,
    currIndex: 0,
    running: true,
  };
};

export default getNewGame;
