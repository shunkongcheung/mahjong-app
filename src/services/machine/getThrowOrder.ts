import { Bamboo, Character, Dot, TileType } from "../../constants";
import shuffle from "../shuffle";
import getIsSuited from "../getIsSuited";

const bamboos: Array<TileType> = Object.values(Bamboo);
const characters: Array<TileType> = Object.values(Character);
const dots: Array<TileType> = Object.values(Dot);

const sortTiles = (tiles: Array<TileType>, isByPairOnly = false) => {
  // if there are pairs, they should be further
  // or else,  the further its away from center, the earlier to throw
  tiles.sort((a, b) => {
    const [_, aNum] = a.split(".");
    const [__, bNum] = b.split(".");
    const aDist = Math.abs(Number(aNum) - 5);
    const bDist = Math.abs(Number(bNum) - 5);

    const aHasPair = tiles.filter((itm) => itm === a).length > 1;
    const bHasPair = tiles.filter((itm) => itm === b).length > 1;

    if (aHasPair !== bHasPair) {
      return aHasPair ? 1 : -1;
    }
    if (isByPairOnly) return 0;

    if (aDist > bDist) return -1;
    if (aDist < bDist) return 1;
    return 0;
  });
};

const sortSuits = (suits: Array<Array<TileType>>) => {
  suits.sort((suitA, suitB) => {
    if (suitA.length < suitB.length) return -1;
    if (suitA.length > suitB.length) return 1;
    return 0;
  });
};

const getThrowOrder = (tiles: Array<TileType>) => {
  // throw the suit that has the least on hand
  // as they are likely the least useful
  const onHandBamboos = tiles.filter((itm) => bamboos.includes(itm));
  const onHandCharacters = tiles.filter((itm) => characters.includes(itm));
  const onHandDots = tiles.filter((itm) => dots.includes(itm));
  const honors = tiles.filter((itm) => !getIsSuited(itm));

  // shuffle tiles, so that result is not too deterministic
  shuffle(onHandBamboos);
  shuffle(onHandCharacters);
  shuffle(onHandDots);
  shuffle(honors);

  // throw tile that is furthest from middle (e.g. 1 or 9)
  // as they could be risky to thirteenOrphans
  // they are less likely to form chow
  sortTiles(onHandBamboos);
  sortTiles(onHandCharacters);
  sortTiles(onHandDots);
  sortTiles(honors, true);

  const suits = [onHandBamboos, onHandCharacters, onHandDots];
  shuffle(suits);
  sortSuits(suits);

  // reconstruct order
  let results: Array<TileType> = [];
  for (let idx = 0; idx < suits.length; idx++)
    results = [...results, ...suits[idx]];

  // throw honors the latest as they are quite useful
  results = [...results, ...honors];

  return results;
};

export default getThrowOrder;
