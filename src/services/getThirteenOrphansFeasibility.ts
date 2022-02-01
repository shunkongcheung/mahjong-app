import { Bamboo, Character, Dot, Dragon, Wind, TileType } from "../constants";
import getSpecificTileSetFeasibility from "./getSpecificTileSetFeasibility";

const getThirteenOrphansFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  // check if any committed, cant play thirteen orphans if committed
  if (committed.length) return -100;

  const thirteenOrphansSet = [
    Bamboo.One,
    Bamboo.Nine,
    Character.One,
    Character.Nine,
    Dot.One,
    Dot.Nine,
    Dragon.Red,
    Dragon.Green,
    Dragon.White,
    Wind.East,
    Wind.South,
    Wind.West,
    Wind.North,
  ].sort();

  const getTileFromRemainsDifficulty = 0.3;

  return getSpecificTileSetFeasibility(
    iOnHands,
    remains,
    thirteenOrphansSet,
    getTileFromRemainsDifficulty
  );
};

export default getThirteenOrphansFeasibility;
