import { TileType } from "../../constants";
import { Player } from "./constants";

const pickTiles = (player: Player, ...tiles: Array<TileType>) => {
  player.onHands = [...player.onHands, ...tiles].sort();
};

export default pickTiles;
