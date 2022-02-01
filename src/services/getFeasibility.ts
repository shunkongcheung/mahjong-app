import { TileType } from "../constants";

import getThirteenOrphansFeasibility from "./getThirteenOrphansFeasibility";
import getTripletsFeasibility from "./getTripletsFeasibility";

const getFeasibility = (
  onHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const thirteenOrphans = getThirteenOrphansFeasibility(
    onHands,
    committed,
    remains
  );
  const triplets = getTripletsFeasibility(onHands, committed, remains);
  return { thirteenOrphans, triplets };
};

export default getFeasibility;
