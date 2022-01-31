import { ScoreTuple, TileType } from "../constants";

import getAllInTripets from "./getAllInTripets";
import getCommonHandScore from "./getCommanHandScore";
import getThirteenOrphansScore from "./getThirteenOrphansScore";
import getOneMixSuitScore from "./getOneMixSuitScore";
import getSmallGreatDragonsScore from "./getSmallGreatDragonsScore";

const getTileScore = (tiles: Array<TileType>): Array<ScoreTuple> => {
  const checkers = [
    getAllInTripets,
    getCommonHandScore,
    getThirteenOrphansScore,
    getOneMixSuitScore,
    getSmallGreatDragonsScore,
  ];

  const hands = checkers.map((checker) => checker(tiles));

  // add winds, add dragons

  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
