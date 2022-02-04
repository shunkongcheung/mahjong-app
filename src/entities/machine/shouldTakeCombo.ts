import { formCommit, pickTiles, Player } from "../player";

import { TileType } from "../../constants";
import { getFeasibility } from "../../services";
import { Game } from "../game";

import getBestBet from "./getBestBet";
import getRemains from "./getRemains";
import getPlayerCopy from "./getPlayerCopy";

const shouldTakeCombo = async (
  _player: Player,
  game: Game,
  tile: TileType,
  combo: Array<TileType>
): Promise<[boolean, number]> => {
  const remains = getRemains(_player, game);
  const player = getPlayerCopy(_player);

  // original feasibility
  const oldFeas = getFeasibility(player.onHands, player.committed, remains);
  const bestBet = getBestBet(oldFeas);

  // assume committed
  pickTiles(player, tile);
  formCommit(player, combo);

  // new feasibility
  const feas = getFeasibility(player.onHands, player.committed, remains);

  // @ts-ignore
  const newValue = feas[bestBet[0]];

  console.log("take", _player.gameWinds[1], [bestBet[0], newValue], {
    oldFeas,
    feas,
    bestBet,
  });

  return [newValue > bestBet[1], Math.max(newValue, bestBet[1])];
};

export default shouldTakeCombo;
