import { GameEventAction, TileType } from "../../constants";
import { Player, TakeTileResult } from "./constants";

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
const shouldTakeTile = async (
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

export default shouldTakeTile;
