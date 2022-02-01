import { Bamboo, Character, Dot, Dragon, Wind, TileType } from "../constants";

const getThirteenOrphansFeasibility = (
  iOnHands: Array<TileType>,
  committed: Array<Array<TileType>>,
  remains: Array<TileType>
) => {
  // check if any committed, cant play thirteen orphans if committed
  if (committed.length) return -100;

  const thirteenOrphansSet = [
    Bamboo.One,
    Bamboo.Nine,
    Character.One,
    Character.Nine,
    Dot.One,
    Dot.Nine,
    Dragon.Red,
    Dragon.Green,
    Dragon.White,
    Wind.East,
    Wind.South,
    Wind.West,
    Wind.North,
  ].sort();

  const feasibility = thirteenOrphansSet.reduce((acc, tile) => {
    if (acc === -100) return acc;

    const found = !!iOnHands.find((itm) => itm === tile);
    if (found) return acc + 1;

    // maximum should have 4 out there in the remain
    const remainCount = remains.reduce(
      (acc, itm) => acc + (itm === tile ? 1 : 0),
      0
    );
    return acc + 0.5 * (remainCount / 4);
  }, 0);

  return feasibility;
};

export default getThirteenOrphansFeasibility;