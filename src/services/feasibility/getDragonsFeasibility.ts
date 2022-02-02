import { Dragon, TileType } from "../../constants";
import getSpecificTileSetFeasibility from "./getSpecificTileSetFeasibility";

const getDragonsFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  const tileSet: Array<TileType> = [Dragon.Red, Dragon.Green, Dragon.White];

  // if committed over two non dragons meld, a dragons cannot be formed
  const nonDragonsCommittedCount = committed.reduce((acc, tiles) => {
    const isNonDragon = !tileSet.includes(tiles[0]);
    return acc + (isNonDragon ? 1 : 0);
  }, 0);

  if (nonDragonsCommittedCount > 2) return -100;

  const difficulty = 0.5;

  return getSpecificTileSetFeasibility(iOnHands, remains, tileSet, difficulty);
};

export default getDragonsFeasibility;
