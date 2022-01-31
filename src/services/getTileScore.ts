import { ScoreTuple, TileType } from "../constants";

import getThirteenOrphansScore from "./getThirteenOrphansScore";

const getTileScore = (tiles: Array<TileType>): Array<ScoreTuple> => {
  const checkers = [getThirteenOrphansScore];

  const hands = checkers.map((checker) => checker(tiles));
  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
