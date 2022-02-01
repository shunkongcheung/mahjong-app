import { TileType } from "../constants";

import getAllHonorTilesFeasibility from "./getAllHonorTilesFeasibility";
import getThirteenOrphansFeasibility from "./getThirteenOrphansFeasibility";
import getTripletsFeasibility from "./getTripletsFeasibility";

const getFeasibility = (
  onHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const allHonorTiles = getAllHonorTilesFeasibility(
    onHands,
    committed,
    remains
  );
  const thirteenOrphans = getThirteenOrphansFeasibility(
    onHands,
    committed,
    remains
  );
  const triplets = getTripletsFeasibility(onHands, committed, remains);

  return { allHonorTiles, thirteenOrphans, triplets };
};

export default getFeasibility;
