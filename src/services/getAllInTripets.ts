import * as constants from "../constants";

import getIsSuited from "./getIsSuited";

const getCommonHandScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

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

      // if it is not suited, it is not common handed
      if (!getIsSuited(curr)) {
        failed = true;
      }

      // remove current item
      copy.splice(0, 1);

      // find the other two
      const secondIdx = copy.findIndex((itm) => itm === curr);
      if (secondIdx < 0) {
        failed = true;
        continue;
      }
      copy.splice(secondIdx, 1);

      const thirdIdx = copy.findIndex((itm) => itm === curr);
      if (thirdIdx < 0) {
        failed = true;
        continue;
      }
      copy.splice(thirdIdx, 1);
    }

    // check if it is successful
    if (!failed) return constants.TileScore.AllInTriplets;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getCommonHandScore;
