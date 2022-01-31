import { TileType } from "../constants";

const getIsTileValidCombination = (tiles: Array<TileType>): boolean => {
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
    if (getIsTileValidCombination(copy)) return true;
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
    return getIsTileValidCombination(copy);
  }

  return false;
};

export default getIsTileValidCombination;