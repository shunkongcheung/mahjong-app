import { TileType } from "../constants";

import getAllHonorTilesFeasibility from "./getAllHonorTilesFeasibility";
import getDragonsFeasibility from "./getDragonsFeasibility";
import getOneSuitFeasibility from "./getOneSuitFeasibility";
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

  const bamboo = getOneSuitFeasibility(onHands, committed, remains, "bamboo");
  const character = getOneSuitFeasibility(
    onHands,
    committed,
    remains,
    "character"
  );
  const dot = getOneSuitFeasibility(onHands, committed, remains, "dot");
  const dragonTiles = getDragonsFeasibility(onHands, committed, remains);
  const thirteenOrphans = getThirteenOrphansFeasibility(
    onHands,
    committed,
    remains
  );
  const triplets = getTripletsFeasibility(onHands, committed, remains);

  return {
    allHonorTiles,
    bamboo,
    character,
    dot,
    dragonTiles,
    thirteenOrphans,
    triplets,
  };
};

export default getFeasibility;
