import { GameEvent, GameEventAction } from "../../constants";
import {
  formCommit,
  pickTiles,
  popTile,
  shouldTakeTile,
  TakeTileResult,
} from "../player";

import checkFlowers from "./checkFlowers";
import compensate from "./compensate";
import obtain from "./obtain";
import { Game, PLAYER_COUNT } from "./constants";

const play = async (game: Game): Promise<Array<GameEvent>> => {
  const events: Array<GameEvent> = [];

  // check that the wall ended, check at front
  // so that the player from last round would
  // still have to pop a tile
  if (!game.walls.length) game.running = false;

  // current player
  const player = game.players[game.currIndex];

  // ask him to throw a tile
  const tile = await popTile(player, game);
  events.push({ action: GameEventAction.Pop, tile, playerIdx: game.currIndex });

  // check if anyone wants the tile
  const result: Array<TakeTileResult> = await Promise.all(
    game.players.map((player, idx) =>
      idx === game.currIndex
        ? { action: GameEventAction.NoAction, tiles: [] }
        : shouldTakeTile(
            player,
            game,
            tile,
            idx === (game.currIndex + 1) % PLAYER_COUNT
          )
    )
  );

  // get highest priority
  const highestAction = result.reduce((acc, itm) => {
    return acc < itm.action ? itm.action : acc;
  }, GameEventAction.NoAction);

  if (highestAction === GameEventAction.NoAction) {
    // if no one wants it
    game.onTable.push({ tile, by: game.currIndex });

    // increment to next player
    game.currIndex = (game.currIndex + 1) % PLAYER_COUNT;

    // give this player a new tile before recurring
    const obtained = obtain(game.walls)[0];
    pickTiles(game.players[game.currIndex], obtained);
    events.push({
      action: GameEventAction.Pick,
      tile: obtained,
      playerIdx: game.currIndex,
    });
  } else {
    // someone wanted the tile
    const playerIdx = result.findIndex((itm) => itm.action === highestAction);
    const takeResult = result[playerIdx];
    const takenPlayer = game.players[playerIdx];

    // give this to this player and force a commit
    pickTiles(takenPlayer, tile);
    formCommit(takenPlayer, takeResult.tiles);

    // set current player index to player index,
    // so he would have to throw a tile
    game.currIndex = playerIdx;

    // compensate for this player if its Kong
    if (highestAction === GameEventAction.Kong) {
      // compensate
      pickTiles(takenPlayer, compensate(game.walls));
    }

    // game is done
    if (highestAction === GameEventAction.Win) {
      game.running = false;
    }

    events.push({ action: highestAction, tile, playerIdx: game.currIndex });
  }

  // check if currentIndex player (after increment)
  // has flowers after:
  // 1. obtaining normally from wall
  // 2. got a compensate from Kong
  let hasFlower = true;
  while (hasFlower) {
    const flowers = checkFlowers(game, game.currIndex);
    hasFlower = flowers.length > 0;
    if (hasFlower)
      flowers.map((tile) =>
        events.push({
          action: GameEventAction.Flower,
          tile,
          playerIdx: game.currIndex,
        })
      );
  }

  return events;
};

export default play;
