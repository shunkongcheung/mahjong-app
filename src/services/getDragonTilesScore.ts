import * as constants from "../constants";
import getIsTileValidCombination from "./getIsTileValidCombination";

const getDragonTilesScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const iCopy = [...tiles].sort();

  const dragons: Array<constants.TileType> = Object.values(constants.Dragon);

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
    let isEyed = dragons.includes(toRemove);

    // remove two items of current pair from copy
    for (let jdx = 0; jdx < 2; jdx++) {
      const removeIdx = copy.findIndex((itm) => itm === toRemove);
      copy.splice(removeIdx, 1);
    }

    // check dragons are all there
    const isDragons = dragons.reduce((acc, dragon) => {
      // if already wrong
      if (!acc) return false;

      // it is already set as eye
      if (dragon === toRemove) return true;

      // find index of current dragon
      const dragonIdx = copy.findIndex((itm) => itm === dragon);

      // check if first index is found and whether its in bound
      if (dragonIdx < 0 || dragonIdx + 2 >= copy.length) return false;

      // return whether a triplet is formed
      return (
        copy[dragonIdx] === copy[dragonIdx + 1] &&
        copy[dragonIdx] === copy[dragonIdx + 2]
      );
    }, true);

    // not a dragon tile with current eyes
    if (!isDragons) continue;

    // check if it is successful
    if (getIsTileValidCombination(copy))
      return isEyed
        ? constants.TileScore.SmallDragons
        : constants.TileScore.GreatDragons;
  }

  // tried all eyes and still failed
  return [0, ""];
};

export default getDragonTilesScore;
