import { TileType } from "../../constants";

const getSpecificTileSetFeasibility = (
  iOnHands: Array<TileType>,
  remains: Array<TileType>,
  tileSet: Array<TileType>, // difficulty to retrieve from remains
  difficulty: number,
  counter = [1, 1, 1, 1]
) => {
  const feasibility = tileSet.reduce((acc, tile) => {
    if (acc === -100) return acc;

    const count = iOnHands.reduce(
      (acc, itm) => acc + (itm === tile ? 1 : 0),
      0
    );

    for (let idx = 0; idx < count; idx++) acc += counter[idx];

    // maximum should have 4 out there in the remain
    const remainCount = remains.reduce(
      (acc, itm) => acc + (itm === tile ? 1 : 0),
      0
    );
    return acc + difficulty * (remainCount / 4);
  }, 0);

  return feasibility;
};

export default getSpecificTileSetFeasibility;
