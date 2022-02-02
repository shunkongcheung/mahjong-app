import { Flower, Wind } from "../../constants";

import getInitialTiles from "./getInitialTiles";
import { Game, Players, PLAYER_COUNT } from "./constants";

const regenerate = (game: Game) => {
  // generate new deck
  game.walls = getInitialTiles();

  // restart game state
  game.currIndex = 0;
  game.running = true;

  // reorder players
  const first = game.players.splice(0, 1);
  game.players = [...game.players, ...first] as Players;
  game.brookerIndex = (PLAYER_COUNT + game.brookerIndex - 1) % PLAYER_COUNT;

  // increment wind if finish a round
  const winds = [Wind.East, Wind.South, Wind.West, Wind.North];
  if (game.brookerIndex === 0) {
    const currWindIndex = winds.findIndex((itm) => itm === game.wind);
    const nextWindIndex = (currWindIndex + 1) % winds.length;
    game.wind = winds[nextWindIndex];
  }

  const flowers = [
    [Flower.Spring, Flower.Plum],
    [Flower.Summer, Flower.Orchid],
    [Flower.Autumn, Flower.Chrysanthemum],
    [Flower.Winter, Flower.Bamboo],
  ];

  game.players.map((player, idx) => {
    player.gameWinds = [game.wind, winds[idx]];
    player.gameFlowers = flowers[idx];
    player.flowers = [];
    player.onHands = [];
    player.committed = [];
  });
};

export default regenerate;
