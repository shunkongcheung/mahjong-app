import { TileType } from "../constants";
import getTripletsFeasibility from "./getTripletsFeasibility";

const getFeasibility = (
  onHands: Array<TileType>,
  committed: Array<Array<TileType>>
) => {
  return {
    triplets: getTripletsFeasibility(onHands, committed),
  };
};

export default getFeasibility;
