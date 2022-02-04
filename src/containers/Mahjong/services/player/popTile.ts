import { TileType } from "../../constants";
import { Game } from "../game";
import { Player } from "./constants";

const popTile = async (player: Player, game: Game): Promise<TileType> => {
  const tile = await player.toThrowTile(player, game);

  const idx = player.onHands.findIndex((itm) => itm === tile);
  player.onHands.splice(idx, 1);

  return tile;
};

export default popTile;
