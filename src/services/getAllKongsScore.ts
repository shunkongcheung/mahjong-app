import { ScoreTuple, TileScore, TileType } from "../constants";

const getAllKongsScore = (tiles: Array<TileType>): ScoreTuple => {
  const iCopy = [...tiles].sort();

  // get all pairs, they are potential eys
  const paired: Array<TileType> = [];
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

    let failed = false;

    // the rest shall be all kongs
    while (copy.length && !failed) {
      // validate the current 4 tiles form a kong
      const curr = copy[0];
      for (let jdx = 1; jdx < 4; jdx++) {
        if (copy[jdx] !== curr) failed = true;
      }
      copy.splice(0, 4);
    }

    if (!failed) return TileScore.AllKongs;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getAllKongsScore;
