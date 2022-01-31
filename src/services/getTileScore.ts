import {
  ConditionScore,
  Dragon,
  ScoreTuple,
  TileScore,
  TileType,
  Wind,
} from "../constants";

import getAllInTripets from "./getAllInTripets";
import getCommonHandScore from "./getCommanHandScore";
import getDragonTilesScore from "./getDragonTilesScore";
import getThirteenOrphansScore from "./getThirteenOrphansScore";
import getOneMixSuitScore from "./getOneMixSuitScore";
import getWindTilesScore from "./getWindTilesScore";
import getAllKongsScore from "./getAllKongsScore";

const getSpecialScoreHelper = (
  tiles: Array<TileType>,
  specialTiles: Array<TileType>,
  scoreTuple: ScoreTuple
): ScoreTuple => {
  const score = specialTiles.reduce((acc, tile) => {
    const tileIdx = tiles.findIndex((itm) => itm === tile);
    if (tileIdx < 0 || tileIdx + 2 >= tiles.length) return acc;
    const isTuplet =
      tiles[tileIdx] === tiles[tileIdx + 1] &&
      tiles[tileIdx] === tiles[tileIdx + 2];
    return acc + (isTuplet ? scoreTuple[0] : 0);
  }, 0);
  return [score, scoreTuple[1]];
};

const getTileScore = (
  tiles: Array<TileType>,
  winds: Array<Wind>
): Array<ScoreTuple> => {
  const checkers = [
    getAllInTripets,
    getAllKongsScore,
    getCommonHandScore,
    getDragonTilesScore,
    getThirteenOrphansScore,
    getOneMixSuitScore,
    getWindTilesScore,
  ];

  const hands = checkers.map((checker) => checker(tiles));

  // add dragons
  const dragons = Object.values(Dragon);
  hands.push(getSpecialScoreHelper(tiles, dragons, ConditionScore.Dragon));

  // add winds
  const isWindTiles =
    hands.findIndex(
      (itm) =>
        itm[1] === TileScore.SmallWinds[1] || itm[1] === TileScore.GreatWinds[1]
    ) > 0;

  // only add wind score if it is not wind tiles
  if (!isWindTiles) {
    hands.push(getSpecialScoreHelper(tiles, winds, ConditionScore.Wind));
  }

  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
