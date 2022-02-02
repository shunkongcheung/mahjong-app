import { TileType } from "../../constants";
import { Player } from "./constants";

const popTile = async (player: Player): Promise<TileType> => {
  const tile = await player.toThrowTile(player);

  const idx = player.onHands.findIndex((itm) => itm === tile);
  player.onHands.splice(idx, 1);

  return tile;
};

export default popTile;
