import { Flower, TileType } from "../../constants";
import { Player } from "./constants";

const popFlowers = (player: Player): Array<TileType> => {
  // move flowers from onHands to flowers
  // return count of flowers
  const allFlowers: Array<TileType> = Object.values(Flower);
  const flowers = allFlowers.filter((itm) => player.onHands.includes(itm));

  player.flowers = [...player.flowers, ...(flowers as Array<Flower>)].sort();
  player.onHands = player.onHands.filter((itm) => !allFlowers.includes(itm));

  return flowers;
};

export default popFlowers;
