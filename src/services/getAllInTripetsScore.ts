import * as constants from "../constants";

import getIsSuited from "./getIsSuited";

const getAllInTripetsScore = (
  tiles: Array<constants.TileType>,
  committed: Array<Array<constants.TileType>>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  // look for all honor
  let isAllHonor = iCopy.reduce((acc, curr) => acc && !getIsSuited(curr), true);

  // look for orphans only
  let isOrphansOnly = iCopy.reduce((acc, curr) => {
    if (!acc) return false;
    const currNum = Number(curr.split(".")[1]);
    return currNum === 1 || currNum === 9;
  }, true);

  // check all committed
  const isCommittedInTriplets = committed.reduce((acc, tiles) => {
    if (!acc) return false;

    // check that its all in triplets
    for (let idx = 1; idx < tiles.length; idx++)
      if (tiles[idx] !== tiles[0]) return false;

    // check for isAllHonor and isOrphansOnly
    if (getIsSuited(tiles[0])) isAllHonor = false;

    const currNum = Number(tiles[0].split(".")[1]);
    if (currNum !== 1 && currNum == 9) isOrphansOnly = false;

    return true;
  }, true);

  if (!isCommittedInTriplets) return [0, ""];

  // get all pairs, they are potential eys
  const paired: Array<constants.TileType> = [];
  for (let idx = 0; idx < iCopy.length - 1; idx++) {
    if (iCopy[idx] === iCopy[idx + 1]) paired.push(iCopy[idx]);
  }

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

    // check if it is failed
    let failed = false;

    // for all items, try to form a chow
    while (copy.length > 2 && !failed) {
      let curr = copy[0];

      // check if the next and second next is the same
      if (curr === copy[1] && curr === copy[2]) {
        copy.splice(0, 3);
      } else {
        failed = true;
      }
    }

    // check if it is successful
    if (!failed) {
      if (isAllHonor) return constants.TileScore.AllHonorTiles;
      if (isOrphansOnly) return constants.TileScore.Orphans;
      return constants.TileScore.AllInTriplets;
    }
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getAllInTripetsScore;
