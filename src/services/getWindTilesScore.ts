import * as constants from "../constants";
import getIsTileValidCombination from "./getIsTileValidCombination";

const getWindTilesScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  const winds: Array<constants.TileType> = Object.values(constants.Wind);

  // get all pairs, they are potential eys
  const paired: Array<constants.TileType> = [];
  for (let idx = 0; idx < iCopy.length - 1; idx++)
    if (iCopy[idx] === iCopy[idx + 1]) paired.push(iCopy[idx]);

  // loop all eyes
  for (let idx = 0; idx < paired.length; idx++) {
    // make a new copy for testing
    const copy = [...tiles].sort();
    const toRemove = paired[idx];

    // is eyed
    let isEyed = winds.includes(toRemove);

    // remove two items of current pair from copy
    for (let jdx = 0; jdx < 2; jdx++) {
      const removeIdx = copy.findIndex((itm) => itm === toRemove);
      copy.splice(removeIdx, 1);
    }

    // check winds are all there
    const isWinds = winds.reduce((acc, wind) => {
      // if already wrong
      if (!acc) return false;

      // it is already set as eye
      if (wind === toRemove) return true;

      // find index of current wind
      const windIdx = copy.findIndex((itm) => itm === wind);

      // check if first index is found and whether its in bound
      if (windIdx < 0 || windIdx + 2 >= copy.length) return false;

      // return whether a triplet is formed
      return (
        copy[windIdx] === copy[windIdx + 1] &&
        copy[windIdx] === copy[windIdx + 2]
      );
    }, true);

    // not a wind tile with current eyes
    if (!isWinds) continue;

    // check if it is successful
    if (getIsTileValidCombination(copy))
      return isEyed
        ? constants.TileScore.SmallWinds
        : constants.TileScore.GreatWinds;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getWindTilesScore;
