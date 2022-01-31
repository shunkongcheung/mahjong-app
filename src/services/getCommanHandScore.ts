import * as constants from "../constants";

import getIsSuited from "./getIsSuited";

const getCommonHandScore = (
  tiles: Array<constants.TileType>,
  committed: Array<Array<constants.TileType>>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  // check the committed
  const isCommittedCommanHand = committed.reduce((acc, iTiles) => {
    if (!acc) return false;

    // possibly a Kong, which make it impossible to be command hand
    if (iTiles.length !== 3) return false;

    const tiles = [...iTiles].sort();

    if (!getIsSuited(tiles[0])) return false;

    const [currSuit, currIdx] = tiles[0].split(".");
    for (let idx = 1; idx < 3; idx++)
      if (tiles[idx] != `${currSuit}.${Number(currIdx) + idx}`) return false;

    return true;
  }, true);
  if (!isCommittedCommanHand) return [0, ""];

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

      // if it is eyes, remove eyes
      const [currSuit, currIdx] = curr.split(".");

      // if it is not suited, it is not common handed
      if (!getIsSuited(curr)) {
        failed = true;
      }

      // find the other two
      const secondIdx = copy.findIndex(
        (itm) => itm === `${currSuit}.${Number(currIdx) + 1}`
      );
      const thirdIdx = copy.findIndex(
        (itm) => itm === `${currSuit}.${Number(currIdx) + 2}`
      );

      // if the other two element are not found
      if (secondIdx < 0 || thirdIdx < 0) {
        failed = true;
      } else {
        // remove this three items
        // note: has to remove in decending order such that the index is correct
        copy.splice(thirdIdx, 1);
        copy.splice(secondIdx, 1);
        copy.splice(0, 1);
      }
    }

    // check if it is successful
    if (!failed) return constants.TileScore.CommonHand;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getCommonHandScore;
