import { TileType } from "../constants";
import getTripletsFeasibility from "./getTripletsFeasibility";

const getFeasibility = (
  onHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const triplets = getTripletsFeasibility(onHands, committed, remains);
  return { triplets };
};

export default getFeasibility;
