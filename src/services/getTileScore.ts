import { ScoreTuple, TileType } from "../constants";

import getAllInTripets from "./getAllInTripets";
import getCommonHandScore from "./getCommanHandScore";
import getThirteenOrphansScore from "./getThirteenOrphansScore";

const getTileScore = (tiles: Array<TileType>): Array<ScoreTuple> => {
  const checkers = [
    getAllInTripets,
    getCommonHandScore,
    getThirteenOrphansScore,
  ];

  const hands = checkers.map((checker) => checker(tiles));
  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
