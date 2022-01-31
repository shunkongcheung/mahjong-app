import { ScoreTuple, TileType } from "../constants";

import getAllInTripets from "./getAllInTripets";
import getCommonHandScore from "./getCommanHandScore";
import getDragonTilesScore from "./getDragonTilesScore";
import getThirteenOrphansScore from "./getThirteenOrphansScore";
import getOneMixSuitScore from "./getOneMixSuitScore";
import getWindTilesScore from "./getWindTilesScore";

const getTileScore = (tiles: Array<TileType>): Array<ScoreTuple> => {
  const checkers = [
    getAllInTripets,
    getCommonHandScore,
    getDragonTilesScore,
    getThirteenOrphansScore,
    getOneMixSuitScore,
    getWindTilesScore,
  ];

  const hands = checkers.map((checker) => checker(tiles));

  // add winds, add dragons

  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
