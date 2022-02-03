import { TileType } from "../../constants";

import getAllHonorTilesFeasibility from "./getAllHonorTilesFeasibility";
import getDragonsFeasibility from "./getDragonsFeasibility";
import getOneSuitFeasibility from "./getOneSuitFeasibility";
import getThirteenOrphansFeasibility from "./getThirteenOrphansFeasibility";
import getTripletsFeasibility from "./getTripletsFeasibility";

interface Result {
  allHonorTiles: number;
  bamboo: number;
  character: number;
  dot: number;
  dragonTiles: number;
  thirteenOrphans: number;
  triplets: number;
}

type ResultKey = keyof Result;

const getFeasibility = (
  onHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const committedScore = committed.length * 3 * 1.5;

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

  const result = {
    allHonorTiles,
    bamboo,
    character,
    dot,
    dragonTiles,
    thirteenOrphans,
    triplets,
  };

  // score should be better for committedScore
  Object.keys(result).map(
    (key) => (result[key as ResultKey] += committedScore)
  );

  return result;
};

export default getFeasibility;
