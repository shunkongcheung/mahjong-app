import { TileType } from "../constants";

const getSpecificTileSetFeasibility = (
  iOnHands: Array<TileType>,
  remains: Array<TileType>,
  tileSet: Array<TileType>, // difficulty to retrieve from remains
  difficulty: number
) => {
  const feasibility = tileSet.reduce((acc, tile) => {
    if (acc === -100) return acc;

    const found = !!iOnHands.find((itm) => itm === tile);
    if (found) return acc + 1;

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
