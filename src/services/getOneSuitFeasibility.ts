import { Bamboo, Character, Dot, TileType } from "../constants";
import getSpecificTileSetFeasibility from "./getSpecificTileSetFeasibility";

// if its empty string, it is checking for AllHonors
type Suit = "bamboo" | "character" | "dot";

const getOneSuitFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>,
  suit: Suit
) => {
  // check if any suit is committed, if yes, it is totally infeasible
  const isCommittedOtherSuit = committed.reduce((acc, iTiles) => {
    if (!acc) return false;

    // otherwise, check if committed starts with the required suit
    return !iTiles[0].startsWith(suit);
  }, false);

  if (isCommittedOtherSuit) return -100;

  // look for tile
  let tileSet: Array<TileType> = Object.values(Bamboo);
  if (suit === "character") tileSet = Object.values(Character);
  if (suit === "dot") tileSet = Object.values(Dot);

  const difficulty = 0.5;

  return getSpecificTileSetFeasibility(iOnHands, remains, tileSet, difficulty);
};

export default getOneSuitFeasibility;
