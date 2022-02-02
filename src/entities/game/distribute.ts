import { pickTiles } from "../player";

import { Game, PLAYER_COUNT } from "./constants";
import obtain from "./obtain";
import checkFlowers from "./checkFlowers";

const distribute = (game: Game) => {
  // player pickup initial tiles
  for (let idx = 0; idx < 3; idx++)
    for (let jdx = 0; jdx < PLAYER_COUNT; jdx++) {
      const TILE_SIZE = 4;
      const tiles = obtain(game.walls, TILE_SIZE);
      pickTiles(game.players[jdx], ...tiles);
    }

  // player pick up last tiles
  pickTiles(
    game.players[0],
    ...obtain(game.walls),
    ...obtain(game.walls, 1, 3)
  );
  for (let idx = 1; idx < PLAYER_COUNT; idx++)
    pickTiles(game.players[idx], ...obtain(game.walls));

  // compensate flowers
  let done = false;
  while (!done) {
    done = true;
    // for each player, compensate flowers on hand
    for (let idx = 0; idx < PLAYER_COUNT; idx++) {
      // if compensated, player might obtain more flowers
      // set done to false to run a recheck
      if (checkFlowers(game, idx).length > 0) done = false;
    }
  }
};

export default distribute;
