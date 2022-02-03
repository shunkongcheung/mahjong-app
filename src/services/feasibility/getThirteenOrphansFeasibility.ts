import {
  Bamboo,
  Character,
  Dot,
  Dragon,
  Wind,
  TileType,
} from "../../constants";
import { Difficulty } from "./constants";
import getSpecificTileSetFeasibility from "./getSpecificTileSetFeasibility";

const getThirteenOrphansFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  // check if any committed, cant play thirteen orphans if committed
  if (committed.length) return -100;

  const tileSet: Array<TileType> = [
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
  ];

  // check if any of the tile above has none left
  const isDead = tileSet.reduce((acc, tile) => {
    if (acc) return true;

    const isOnHand = iOnHands.findIndex((itm) => itm === tile) >= 0;
    const isRemains = remains.findIndex((itm) => itm === tile) >= 0;

    return !isOnHand && !isRemains;
  }, false);

  if (isDead) return -100;

  return getSpecificTileSetFeasibility(
    iOnHands,
    remains,
    tileSet,
    Difficulty.ThirteenOrphans,
    [0.8, 0.4, 0, 0]
  );
};

export default getThirteenOrphansFeasibility;
