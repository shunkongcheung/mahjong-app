import {
  ConditionScore,
  Dragon,
  Flower,
  ScoreTuple,
  TileScore,
  TileType,
  Wind,
} from "../../constants";

import getAllInTripetsScore from "./getAllInTripetsScore";
import getCommonHandScore from "./getCommanHandScore";
import getDragonTilesScore from "./getDragonTilesScore";
import getThirteenOrphansScore from "./getThirteenOrphansScore";
import getOneMixSuitScore from "./getOneMixSuitScore";
import getWindTilesScore from "./getWindTilesScore";
import getAllKongsScore from "./getAllKongsScore";
import getChickHandScore from "./getChickHandScore";

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
  onHand: Array<TileType>,
  committed: Array<Array<TileType>>,
  flowers: Array<TileType>,
  winds: Array<Wind>,
  conditionScores: Array<ScoreTuple>
): Array<ScoreTuple> => {
  const checkers = [
    getAllInTripetsScore,
    getAllKongsScore,
    getCommonHandScore,
    getDragonTilesScore,
    getThirteenOrphansScore,
    getOneMixSuitScore,
    getWindTilesScore,
  ];

  const hands = checkers
    .map((checker) => checker(onHand, committed))
    .filter((itm) => itm[0] > 0);

  // if its not a valid tiles, just return from here
  if (!hands.length && !getChickHandScore(onHand, committed)) return hands;

  // get full set of tiles
  let tiles = [...onHand];
  committed.map((commmittedTiles) => (tiles = [...tiles, ...commmittedTiles]));
  tiles.sort();

  // if its winning from wall
  if (!committed.length) hands.push(ConditionScore.WindFromWall);

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
  // check if flowers are useful
  const position =
    Number(winds[1].split(".")[1]) - Number(Wind.East.split(".")[1]);

  const seasonName = `${Flower.Spring.split(".")[0]}.${
    Number(Flower.Spring.split(".")[1]) + position
  }`;
  if (flowers.includes(seasonName as any)) hands.push(ConditionScore.Flower);

  const flowerName = `${Flower.Plum.split(".")[0]}.${
    Number(Flower.Spring.split(".")[1]) + position
  }`;
  if (flowers.includes(flowerName as any)) hands.push(ConditionScore.Flower);

  // add conditions
  for (let idx = 0; idx < conditionScores.length; idx++)
    hands.push(conditionScores[idx]);

  return hands.filter((itm) => itm[0] > 0);
};

export default getTileScore;
