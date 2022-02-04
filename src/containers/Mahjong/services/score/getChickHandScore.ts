import * as constants from "../../constants";

import getIsTileValidCombination from "../getIsTileValidCombination";

const getChickHandScore = (
  tiles: Array<constants.TileType>,
  committed: Array<Array<constants.TileType>>
): boolean => {
  // check all committed are valid
  const isCommittedValid = committed.reduce((acc, iTiles) => {
    if (!acc) return false;
    const tiles = [...iTiles].sort();

    // check if its a valid tile
    const isValid = getIsTileValidCombination(tiles, true);

    return isValid;
  }, true);
  if (!isCommittedValid) return false;

  const iCopy = [...tiles].sort();

  // get all pairs, they are potential eys
  const paired: Array<constants.TileType> = [];
  for (let idx = 0; idx < iCopy.length - 1; idx++)
    if (iCopy[idx] === iCopy[idx + 1]) paired.push(iCopy[idx]);

  // loop all eyes
  for (let idx = 0; idx < paired.length; idx++) {
    // make a new copy for testing
    const copy = [...tiles].sort();
    const toRemove = paired[idx];

    // remove two items of current pair from copy
    for (let jdx = 0; jdx < 2; jdx++) {
      const removeIdx = copy.findIndex((itm) => itm === toRemove);
      copy.splice(removeIdx, 1);
    }

    // check if it is successful
    if (getIsTileValidCombination(copy)) return true;
  }

  // tried all eyes and still failed
  return false;
};

export default getChickHandScore;
