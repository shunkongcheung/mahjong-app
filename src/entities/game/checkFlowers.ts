import { popFlowers, pickTiles } from "../player";

import compensate from "./compensate";
import { Game } from "./constants";

const checkFlowers = (game: Game, idx: number) => {
  const player = game.players[idx];

  // pop player.onHand flower(s) to players.flowers
  const flowers = popFlowers(player);

  // for however number of flower, compensate
  for (let jdx = 0; jdx < flowers.length; jdx++)
    pickTiles(player, compensate(game.walls));

  return flowers;
};

export default checkFlowers;
