import * as constants from "../constants";

import getIsTileValidCombination from "./getIsTileValidCombination";
import getIsSuited from "./getIsSuited";

const getOneMixSuitScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  // must contain at least one suit to be all one suit / mixed suit
  if (!getIsSuited(tiles[0])) return [0, ""];

  // check if it is one suit / mixed suit. if not return false
  let isMixed = false;
  const suitName = iCopy[0].split(".")[0];
  for (let idx = 0; idx < iCopy.length; idx++) {
    const currSuit = iCopy[idx].split(".")[0];
    const isNotSameSuit = currSuit !== suitName;

    // its from other suit
    if (isNotSameSuit && getIsSuited(iCopy[idx])) return [0, ""];

    // not same suit, and it not suited, those are wind or dragon
    if (isNotSameSuit) isMixed = true;
  }

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
    if (getIsTileValidCombination(copy))
      return isMixed
        ? constants.TileScore.MixedOneSuit
        : constants.TileScore.AllOneSuit;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getOneMixSuitScore;
