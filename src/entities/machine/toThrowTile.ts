import { Player } from "../player";
import { getFeasibility } from "../../services";
import { Game } from "../game";

import getRemains from "./getRemains";
import getPlayerCopy from "./getPlayerCopy";
import getBestBet from "./getBestBet";
import getThrowOrder from "./getThrowOrder";

const toThrowTile = async (_player: Player, game: Game) => {
  const remains = getRemains(_player, game);

  // original feasibility
  const oldFeas = getFeasibility(_player.onHands, _player.committed, remains);
  const curBest = getBestBet(oldFeas);

  let currBestScore = -1;
  let currBestTile = _player.onHands[0];

  const reorder = getThrowOrder(_player.onHands);

  for (let idx = 0; idx < reorder.length; idx++) {
    const player = getPlayerCopy(_player);
    const tile = reorder[idx];

    // assume committed
    const tileIdx = player.onHands.findIndex((itm) => itm === tile);
    player.onHands.splice(tileIdx, 1);

    // new feasibility
    const feas = getFeasibility(player.onHands, player.committed, remains);

    //@ts-ignore
    const newFeas = feas[curBest[0]];

    if (newFeas > currBestScore) {
      currBestScore = newFeas;
      currBestTile = tile;
    }
  }

  console.log("throw", _player.gameWinds[1], curBest, currBestTile, {
    oldFeas,
    currBestScore,
  });
  return currBestTile;
};

export default toThrowTile;
