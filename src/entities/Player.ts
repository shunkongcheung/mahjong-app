import { Flower, GameEventAction, TileType, Wind } from "../constants";

interface Player {
  // game meta information
  gameWinds: Array<Wind>;
  gameFlowers: Array<Flower>;

  // tiles that this player owns
  flowers: Array<Flower>;
  onHands: Array<TileType>;
  committed: Array<Array<TileType>>;

  // function that define user decisions
  shouldTakeCombo(player: Player, tiles: Array<TileType>): Promise<boolean>;
  toThrowTile(player: Player): Promise<TileType>;
}

export interface TakeTileResult {
  tiles: Array<TileType>;
  action: GameEventAction;
}

export const popFlowers = (player: Player): number => {
  // move flowers from onHands to flowers
  // return count of flowers
  const allFlowers: Array<TileType> = Object.values(Flower);
  const flowers = allFlowers.filter((itm) => player.onHands.includes(itm));

  player.flowers = [...player.flowers, ...(flowers as Array<Flower>)].sort();
  player.onHands = player.onHands.filter((itm) => !allFlowers.includes(itm));

  return flowers.length;
};

export const pickTiles = (player: Player, ...tiles: Array<TileType>) => {
  player.onHands = [...player.onHands, ...tiles].sort();
};

export const popTile = async (player: Player): Promise<TileType> => {
  const tile = await player.toThrowTile(player);

  const idx = player.onHands.findIndex((itm) => itm === tile);
  player.onHands.splice(idx, 1);

  return tile;
};

export const formCommit = (player: Player, tiles: Array<TileType>) => {
  // validate all tiles can be found from
  let temp: Array<TileType> = [];

  const success = tiles.reduce((acc: boolean, tile: TileType) => {
    if (!acc) return false;

    // find item from onHands
    const index = player.onHands.findIndex((itm) => itm === tile);
    if (index < 0) return false;

    // temporarily store the ejected tile
    player.onHands.splice(index, 1);
    temp.push(tile);

    return true;
  }, true);

  if (!success) {
    // if not successful, add back ejected tiles
    player.onHands = player.onHands.concat(temp).sort();
    throw Error(`Invalid committing tiles: ${tiles.join(", ")}`);
  }

  // tiles were ejected, just need to add it to committed
  player.committed.push([...tiles].sort());
};

const getPossibleTriplet = (
  player: Player,
  tile: TileType
): Array<TileType> => {
  const count = player.onHands.filter((itm) => itm === tile).length;
  return count >= 2 ? [tile, tile, tile] : [];
};

const getPossibleKong = (player: Player, tile: TileType): Array<TileType> => {
  const count = player.onHands.filter((itm) => itm === tile).length;
  return count > 3 ? [tile, tile, tile, tile] : [];
};

const getPossibleChows = (
  player: Player,
  tile: TileType
): Array<Array<TileType>> => {
  let chows: Array<Array<TileType>> = [];
  const [tileType, tileNum] = tile.split(".");
  const start = Math.max(1, Number(tileNum) - 2);
  const end = Math.min(9, start + 3);

  for (let idx = start; idx < end; idx++) {
    let success = true;
    for (let jdx = idx; jdx < idx + 3; jdx++) {
      // check if the required two other tile to form Chow are onHand
      const tileName = `${tileType}.${jdx}`;

      // skip tile to be given
      if (tileName === tile) continue;

      // find if required tile onHand
      const index = player.onHands.findIndex((itm) => itm === tileName);
      if (index < 0) success = false;
    }

    // if successful, can form a chow
    if (success)
      chows.push(
        Array.from({ length: 3 }).map(
          (_, jdx) => `${tileType}.${idx + jdx}` as TileType
        )
      );
  }

  return chows;
};

// play the game
export const shouldTakeTile = async (
  player: Player,
  tile: TileType,
  isChowable: boolean
): Promise<TakeTileResult> => {
  let possibleCombo: Array<TakeTileResult> = [];

  const kong = getPossibleKong(player, tile);
  if (kong.length)
    possibleCombo.push({ action: GameEventAction.Kong, tiles: kong });

  const triplets = getPossibleTriplet(player, tile);
  if (triplets.length)
    possibleCombo.push({ action: GameEventAction.Triplet, tiles: triplets });

  if (isChowable) {
    const chows = getPossibleChows(player, tile);
    chows.map((tiles) => {
      possibleCombo.push({ action: GameEventAction.Chow, tiles });
    });
  }

  const want = await Promise.all(
    possibleCombo.map(async (result) =>
      player.shouldTakeCombo(player, result.tiles)
    )
  );

  for (let idx = 0; idx < want.length; idx++)
    if (want[idx]) return possibleCombo[idx];

  return { action: GameEventAction.NoAction, tiles: [] };
};

// // Note: functions to be override
// const shouldTakeCombo = async (tiles: Array<TileType>): Promise<boolean> => {
//   // to be implemented
//   return false;
// }
// const toThrowTile= async(): Promise<TileType> => {
//   // to be implemented
//   return this.onHands[0];
// }

export default Player;
