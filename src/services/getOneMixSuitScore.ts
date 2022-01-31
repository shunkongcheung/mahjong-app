import * as constants from "../constants";

import getIsSuited from "./getIsSuited";

const getIsSuitHelper = (tiles: Array<constants.TileType>): boolean => {
  // has to be at least 3 tiles
  if (!tiles.length) return true;
  if (tiles.length < 3) return false;

  // sort the tiles in place
  tiles.sort();

  let curr = tiles[0];

  // try forming triplets
  if (curr === tiles[1] && curr === tiles[2]) {
    const copy = [...tiles];
    copy.splice(0, 3);
    if (getIsSuitHelper(copy)) return true;
  }

  // try forming chow
  const [currSuit, currIdx] = curr.split(".");
  const secondIdx = tiles.findIndex(
    (itm) => itm === `${currSuit}.${Number(currIdx) + 1}`
  );
  const thirdIdx = tiles.findIndex(
    (itm) => itm === `${currSuit}.${Number(currIdx) + 2}`
  );
  const copy = [...tiles];
  if (secondIdx >= 0 || thirdIdx >= 0) {
    // remove this three items
    // note: has to remove in decending order such that the index is correct
    copy.splice(thirdIdx, 1);
    copy.splice(secondIdx, 1);
    copy.splice(0, 1);
    return getIsSuitHelper(copy);
  }

  return false;
};

const getOneMixSuitScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

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
    if (getIsSuitHelper(copy))
      return isMixed
        ? constants.TileScore.MixedOneSuit
        : constants.TileScore.AllOneSuit;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getOneMixSuitScore;
