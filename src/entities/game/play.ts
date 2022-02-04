import {
  ConditionScore,
  GameEvent,
  GameEventAction,
  ScoreTuple,
  TileType,
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
    // TODO:
    // maybe ask user if he wants to win with this tile

    game.running = false;
    game.winnerIdx = playerIdx;
    game.winnerScores = scores;
    return true;
  }
  return false;
};

const compensateProcedure = (game: Game, events: Array<GameEvent>) => {
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
              ConditionScore.WinByKong,
              ConditionScore.WinByDoubleKong,
              ConditionScore.SelfPick,
            ]
          : [ConditionScore.WinByKong, ConditionScore.SelfPick]
      );
    }
  }
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
      ConditionScore.WinByLastCatch,
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

  // check for kongs
  // and do the same thing to check for winner and stuff
  let playerKongTile: TileType | "" = "";
  let playerUniqueSet = player.onHands.filter(
    (itm, idx) => player.onHands.indexOf(itm) === idx
  );
  for (let idx = 0; idx < playerUniqueSet.length && !playerKongTile; idx++) {
    const tile = playerUniqueSet[idx];

    const hasFour = player.onHands.filter((itm) => itm === tile).length === 4;
    const tripletExists =
      player.committed.filter((itm) => itm[0] === tile && itm[1] === tile)
        .length > 0;

    if (hasFour || tripletExists) {
      // check if user wants to kong this tile
      const kong = [tile, tile, tile, tile];
      const take = await player.shouldTakeCombo(player, game, tile, kong);
      if (take) {
        formCommit(player, kong);
        playerKongTile = tile;
        events.push({
          action: GameEventAction.Kong,
          tile,
          playerIdx: game.currIndex,
        });
      }
    }
  }

  if (!!playerKongTile) {
    // check for robbing kong
    for (let idx = game.currIndex; idx < game.currIndex + PLAYER_COUNT; idx++) {
      const playerIdx = idx % PLAYER_COUNT;

      const player = game.players[playerIdx];
      const onHands = [...player.onHands, playerKongTile];
      checkWinner(game, { ...player, onHands }, playerIdx, [
        ConditionScore.RobbingKong,
      ]);
    }
    // compensate
    pickTiles(player, compensate(game.walls));
  }

  if (!game.running) return [];

  if (!!playerKongTile) {
    compensateProcedure(game, events);
  }

  // ask him to throw a tile
  const tile = await popTile(player, game);
  events.push({ action: GameEventAction.Pop, tile, playerIdx: game.currIndex });

  // check if anyone would win from this tile
  for (let idx = game.currIndex; idx < game.currIndex + PLAYER_COUNT; idx++) {
    const playerIdx = idx % PLAYER_COUNT;
    const player = game.players[playerIdx];
    const onHands = [...player.onHands, tile];
    const winner = checkWinner(
      game,
      { ...player, onHands },
      playerIdx,
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
      // check for robbing kong
      for (
        let idx = game.currIndex;
        idx < game.currIndex + PLAYER_COUNT;
        idx++
      ) {
        const playerIdx = idx % PLAYER_COUNT;

        const player = game.players[playerIdx];
        const onHands = [...player.onHands, tile];
        checkWinner(game, { ...player, onHands }, playerIdx, [
          ConditionScore.RobbingKong,
        ]);
      }
      // compensate
      pickTiles(takenPlayer, compensate(game.walls));
    }

    events.push({ action: highestAction, tile, playerIdx: game.currIndex });
  }

  compensateProcedure(game, events);
  return events;
};

export default play;
