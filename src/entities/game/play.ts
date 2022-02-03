import {
  ConditionScore,
  GameEvent,
  GameEventAction,
  ScoreTuple,
} from "../../constants";
import {
  formCommit,
  pickTiles,
  Player,
  popTile,
  shouldTakeTile,
  TakeTileResult,
} from "../player";

import checkFlowers from "./checkFlowers";
import compensate from "./compensate";
import obtain from "./obtain";
import { Game, PLAYER_COUNT } from "./constants";
import { getTileScore } from "../../services";

const MIN_SCORE = 3;

const checkWinner = (
  game: Game,
  player: Player,
  playerIdx: number,
  conditionScores: Array<ScoreTuple>
) => {
  // check if this user has won
  const scores = getTileScore(
    player.onHands,
    player.committed,
    player.flowers,
    player.gameWinds,
    conditionScores
  );
  const total = scores.reduce((acc, score) => acc + score[0], 0);
  if (total > MIN_SCORE) {
    game.running = false;
    game.winnerIdx = playerIdx;
    game.winnerScores = scores;
    return true;
  }
  return false;
};

const play = async (
  game: Game,
  isFirstRound?: boolean
): Promise<Array<GameEvent>> => {
  const events: Array<GameEvent> = [];

  // current player
  const player = game.players[game.currIndex];

  // check that the wall ended, check at front
  // so that the player from last round would
  // still have to pop a tile
  if (!game.walls.length) {
    checkWinner(game, player, game.currIndex, [
      ConditionScore.WindByLastCatch,
      ConditionScore.SelfPick,
    ]);
    game.running = false;
  }

  // check for heaven
  if (isFirstRound) {
    const winner = checkWinner(game, player, game.currIndex, [
      ConditionScore.Heaven,
    ]);
    if (winner) game.running = false;
  }

  if (!game.running) return [];

  // ask him to throw a tile
  const tile = await popTile(player, game);
  events.push({ action: GameEventAction.Pop, tile, playerIdx: game.currIndex });

  // check if anyone would win from this tile
  for (let idx = 0; idx < 4; idx++) {
    if (idx === game.currIndex) continue;
    const player = game.players[idx];
    const onHands = [...player.onHands, tile];
    const winner = checkWinner(
      game,
      { ...player, onHands },
      game.currIndex,
      isFirstRound ? [ConditionScore.Earth] : []
    );

    if (winner) return [];
  }

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
    const pickPlayer = game.players[game.currIndex];
    pickTiles(pickPlayer, obtained);
    events.push({
      action: GameEventAction.Pick,
      tile: obtained,
      playerIdx: game.currIndex,
    });
    checkWinner(game, pickPlayer, game.currIndex, [ConditionScore.SelfPick]);
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

      // check for robbing kong
      for (let idx = 0; idx < 4; idx++) {
        if (idx === game.currIndex) continue;

        const player = game.players[idx];
        const onHands = [...player.onHands, tile];
        checkWinner(game, { ...player, onHands }, game.currIndex, [
          ConditionScore.RobbingKong,
        ]);
      }
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
  let flowerRound = 0;
  while (hasFlower) {
    const flowers = checkFlowers(game, game.currIndex);
    hasFlower = flowers.length > 0;
    if (hasFlower) {
      flowers.map((tile) =>
        events.push({
          action: GameEventAction.Flower,
          tile,
          playerIdx: game.currIndex,
        })
      );
      flowerRound++;

      // check for winning by kong
      const player = game.players[game.currIndex];
      checkWinner(
        game,
        player,
        game.currIndex,
        flowerRound > 1
          ? [
              ConditionScore.WindByKong,
              ConditionScore.WindByDoubleKong,
              ConditionScore.SelfPick,
            ]
          : [ConditionScore.WindByKong, ConditionScore.SelfPick]
      );
    }
  }

  return events;
};

export default play;
