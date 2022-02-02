import Player, {
  formCommit,
  pickTiles,
  popFlowers,
  popTile,
  shouldTakeTile,
  TakeTileResult,
} from "./Player";
import Deck, { compensate, obtain } from "./Deck";
import {
  Flower,
  GameEvent,
  GameEventAction,
  TileType,
  Wind,
} from "../constants";
import { getInitialTiles } from "../services";

const PLAYER_COUNT = 4;
type Players = [Player, Player, Player, Player];

interface Game {
  players: Players;
  onTable: Array<{ tile: TileType; by: number }>;
  walls: Deck;
  wind: Wind;
  brookerIndex: number;
  currIndex: number;
  running: boolean;
}

export const getNewGame = (players: Players): Game => {
  const gameWind = Wind.East;
  const winds = [Wind.East, Wind.South, Wind.West, Wind.North];
  const flowers = [
    [Flower.Spring, Flower.Plum],
    [Flower.Summer, Flower.Orchid],
    [Flower.Autumn, Flower.Chrysanthemum],
    [Flower.Winter, Flower.Bamboo],
  ];

  players.map((player, idx) => {
    player.gameWinds = [gameWind, winds[idx]];
    player.gameFlowers = flowers[idx];
    player.flowers = [];
    player.onHands = [];
    player.committed = [];
  });

  return {
    players,
    onTable: [],
    walls: getInitialTiles(),
    wind: gameWind,
    brookerIndex: 0,
    currIndex: 0,
    running: true,
  };
};

export const regenerate = (game: Game) => {
  // generate new deck
  game.walls = getInitialTiles();

  // restart game state
  game.currIndex = 0;
  game.running = true;

  // reorder players
  const first = game.players.splice(0, 1);
  game.players = [...game.players, ...first] as Players;
  game.brookerIndex = (PLAYER_COUNT + game.brookerIndex - 1) % PLAYER_COUNT;

  // increment wind if finish a round
  const winds = [Wind.East, Wind.South, Wind.West, Wind.North];
  if (game.brookerIndex === 0) {
    const currWindIndex = winds.findIndex((itm) => itm === game.wind);
    const nextWindIndex = (currWindIndex + 1) % winds.length;
    game.wind = winds[nextWindIndex];
  }

  const flowers = [
    [Flower.Spring, Flower.Plum],
    [Flower.Summer, Flower.Orchid],
    [Flower.Autumn, Flower.Chrysanthemum],
    [Flower.Winter, Flower.Bamboo],
  ];

  game.players.map((player, idx) => {
    player.gameWinds = [game.wind, winds[idx]];
    player.gameFlowers = flowers[idx];
    player.flowers = [];
    player.onHands = [];
    player.committed = [];
  });
};

export const distribute = (game: Game) => {
  // player pickup initial tiles
  for (let idx = 0; idx < 3; idx++)
    for (let jdx = 0; jdx < PLAYER_COUNT; jdx++) {
      const TILE_SIZE = 4;
      const tiles = obtain(game.walls, TILE_SIZE);
      pickTiles(game.players[jdx], ...tiles);
    }

  // player pick up last tiles
  pickTiles(
    game.players[0],
    ...obtain(game.walls),
    ...obtain(game.walls, 1, 3)
  );
  for (let idx = 1; idx < PLAYER_COUNT; idx++)
    pickTiles(game.players[idx], ...obtain(game.walls));

  // compensate flowers
  let done = false;
  while (!done) {
    done = true;
    // for each player, compensate flowers on hand
    for (let idx = 0; idx < PLAYER_COUNT; idx++) {
      // if compensated, player might obtain more flowers
      // set done to false to run a recheck
      if (checkFlowers(game, idx)) done = false;
    }
  }
};

const checkFlowers = (game: Game, idx: number) => {
  const player = game.players[idx];

  // pop player.onHand flower(s) to players.flowers
  const flowerCount = popFlowers(player);

  // for however number of flower, compensate
  for (let jdx = 0; jdx < flowerCount; jdx++)
    pickTiles(player, compensate(game.walls));

  return flowerCount > 0;
};

export const play = async (game: Game): Promise<Array<GameEvent>> => {
  const events: Array<GameEvent> = [];

  // check that the wall ended, check at front
  // so that the player from last round would
  // still have to pop a tile
  if (!game.walls.length) game.running = false;

  // current player
  const player = game.players[game.currIndex];

  // ask him to throw a tile
  const tile = await popTile(player);
  events.push({ action: GameEventAction.Pop, tile, playerIdx: game.currIndex });

  // check if anyone wants the tile
  const result: Array<TakeTileResult> = await Promise.all(
    game.players.map((player, idx) =>
      idx === game.currIndex
        ? { action: GameEventAction.NoAction, tiles: [] }
        : shouldTakeTile(
            player,
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
    hasFlower = checkFlowers(game, game.currIndex);
    if (hasFlower)
      events.push({ action: "flower", tile: "", playerIdx: game.currIndex });
  }

  return events;
};

export default Game;
