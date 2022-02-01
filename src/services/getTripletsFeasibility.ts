import { TileType } from "../constants";

const getTripletsFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
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
    const diff = jdx - idx;

    if (diff !== 1) {
      let isCountable = diff > 2;

      // if a triplet is not formed, check if there is remainning out there
      if (!isCountable) {
        const count = remains.reduce(
          (acc, tile) => acc + (tile === onHands[idx] ? 1 : 0),
          0
        );

        // if there is remain, a triplet can be formed
        isCountable = count > 0;
      }

      if (isCountable) feasibility += diff;
    }

    // increment
    idx = jdx;
  }

  return feasibility;
};

export default getTripletsFeasibility;
