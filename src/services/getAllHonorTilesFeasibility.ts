import { Dragon, Wind, TileType } from "../constants";
import getIsSuited from "./getIsSuited";
import getSpecificTileSetFeasibility from "./getSpecificTileSetFeasibility";

const getAllHonorTilesFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const isCommittedSuit = committed.reduce((acc, tiles) => {
    if (!!acc) return true;
    return getIsSuited(tiles[0]);
  }, false);

  if (isCommittedSuit) return -100;

  const tileSet = [
    Dragon.Red,
    Dragon.Green,
    Dragon.White,
    Wind.East,
    Wind.South,
    Wind.West,
    Wind.North,
  ];

  const difficulty = 0.5;

  return getSpecificTileSetFeasibility(iOnHands, remains, tileSet, difficulty);
};

export default getAllHonorTilesFeasibility;
