import { TileType } from "../constants";

const getTripletsFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>
) => {
  // check if any chow is committed, if yes, it is totally in feasible
  const isCommittedChow = committed.reduce((acc, iTiles) => {
    if (acc) return acc;

    if (iTiles.length !== 3) return false;

    const tiles = [...iTiles].sort();
    const [tileType, tileNum] = tiles[0].split(".");
    for (let idx = 0; idx < iTiles.length; idx++)
      if (tiles[idx] !== `${tileType}.${Number(tileNum) + idx}`) return false;

    return true;
  }, false);

  if (isCommittedChow) return -100;

  // look for pairs / triplets in onHand and calculate feasiblity
  let feasibility = 0;
  let idx = 0;
  const onHands = [...iOnHands].sort();
  while (idx < onHands.length) {
    // find how many items are duplet / triplets
    let jdx = idx;
    while (
      // do not exeed onHands array
      jdx < onHands.length &&
      // look for same tile
      onHands[jdx] === iOnHands[idx] &&
      // quadraplet should have same value as triplets as that only makes a Kong
      jdx < idx + 3
    ) {
      jdx++;
    }

    // add to feasibilty
    if (jdx != idx + 1) feasibility += jdx - idx;

    // increment
    idx = jdx;
  }

  return feasibility;
};

export default getTripletsFeasibility;
