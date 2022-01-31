import * as constants from "../constants";

const getThirteenOrphansScore = (
  tiles: Array<constants.TileType>
): constants.ScoreTuple => {
  const copy = [...tiles].sort();

  // check if all of the following has at least one in hand
  const thirteen = [
    constants.Bamboo.One,
    constants.Bamboo.One,
    constants.Character.Nine,
    constants.Character.Nine,
    constants.Dot.One,
    constants.Dot.Nine,
    constants.Dragon.Green,
    constants.Dragon.Red,
    constants.Dragon.White,
    constants.Wind.East,
    constants.Wind.South,
    constants.Wind.West,
    constants.Wind.North,
  ];

  // ensure 13 pieces are all found
  const allFound = thirteen.reduce(
    (acc, tile) => acc && !!copy.find((itm) => itm === tile),
    true
  );
  if (!allFound) return [0, ""];

  // look for eyes
  // from previous check, all thirteen piece are found
  // copy is sorted, therefore, if we found any two pieces
  // that are the same, the pair must be the eyes
  for (let idx = 0; idx < copy.length - 1; idx++) {
    if (copy[idx] === copy[idx + 1]) return constants.TileScore.ThirteenOrphans;
  }

  // it is not a thirteen orphans set
  return [0, ""];
};

export default getThirteenOrphansScore;
