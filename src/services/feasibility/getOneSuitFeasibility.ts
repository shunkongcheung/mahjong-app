import { Bamboo, Character, Dot, TileType } from "../../constants";
import { Difficulty } from "./constants";
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
    if (acc) return true;

    // otherwise, check if committed starts with the required suit
    return !iTiles[0].startsWith(suit);
  }, false);

  if (isCommittedOtherSuit) return -100;

  // look for tile
  let tileSet: Array<TileType> = Object.values(Bamboo);
  if (suit === "character") tileSet = Object.values(Character);
  if (suit === "dot") tileSet = Object.values(Dot);
  tileSet.sort();

  const countScore = getSpecificTileSetFeasibility(
    iOnHands,
    remains,
    tileSet,
    Difficulty.AllHonorTiles
  );

  // get all tiles that is in the wanted suit
  const suitTiles = iOnHands.filter((itm) => tileSet.includes(itm));

  // look for pairs
  const pairScore = tileSet.reduce(
    (acc, curr) =>
      acc + (suitTiles.filter((itm) => itm === curr).length > 1 ? 1 : 0),
    0
  );

  // check for continuity, the more continuous, the easier to get a chow
  const continuousSets: Array<Array<TileType>> = [[]];
  tileSet.map((tile) => {
    const tileIdx = suitTiles.findIndex((itm) => itm === tile);
    if (tileIdx < 0) return;

    const lastSet = continuousSets[continuousSets.length - 1];
    if (!lastSet.length) {
      lastSet.push(tile);
      return;
    }
    const lastTile = lastSet[lastSet.length - 1];
    const [lastType, lastNum] = lastTile.split(".");

    if (tile === `${lastType}.${Number(lastNum) + 1}`) lastSet.push(tile);
    else continuousSets.push([tile]);
  });
  // the more continuous set, the more sparse, the worse
  const continuityScore = continuousSets.length * -1;

  // pairScore and continuityScore is divided based on the fact that there are nine tiles in one suit
  // these two score should not affect comparision between one suit probablity to
  // other tiles combination (e.g. triplets, all honor etc)
  // it should only affect on choosing which chow combination to take
  return countScore + pairScore / 9 + continuityScore / 4;
};

export default getOneSuitFeasibility;
