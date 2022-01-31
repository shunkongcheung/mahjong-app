import * as constants from "../constants";

import getIsSuited from "./getIsSuited";

const getCommonHandScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  const isAllHonor = iCopy.reduce(
    (acc, curr) => acc && !getIsSuited(curr),
    true
  );

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
    if (!failed)
      return isAllHonor
        ? constants.TileScore.AllHonorTiles
        : constants.TileScore.AllInTriplets;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getCommonHandScore;
