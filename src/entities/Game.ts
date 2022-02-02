import Player, { TakePriority, TakeTileResult } from "./Player";
import Deck from "./Deck";
import { GameEvent, TileType, Wind } from "../constants";

const PLAYER_COUNT = 4;
type Players = [Player, Player, Player, Player];

class Game {
  private _players: Players;

  private _walls: Deck;
  private _onTable: Array<{ tile: TileType; by: number }>;

  private _wind: Wind;
  private _brooker: Player;

  private _currIndex: number;
  private _running: boolean;

  constructor(players: Players) {
    this._players = players;

    this._walls = new Deck();
    this._onTable = [];

    this._wind = Wind.East;
    this._brooker = this._players[0];

    this._currIndex = 0;
    this._running = true;
  }

  get wind() {
    return this._wind;
  }
  get brooker() {
    return this._brooker;
  }
  get wallLength() {
    return this._walls.length;
  }
  get currIndex() {
    return this._currIndex;
  }
  get running() {
    return this._running;
  }

  regenerate() {
    // generate new deck
    this._walls = new Deck();

    // restart game state
    this._currIndex = 0;
    this._running = true;

    // reorder players
    const first = this._players.splice(0, 1);
    this._players = [...this._players, ...first] as Players;

    // increment wind if finish a round
    const winds = [Wind.East, Wind.South, Wind.West, Wind.North];
    if (this._players[0] === this._brooker) {
      const currWindIndex = winds.findIndex((itm) => itm === this._wind);
      const nextWindIndex = (currWindIndex + 1) % winds.length;
      this._wind = winds[nextWindIndex];
    }
  }

  distribute() {
    // player pickup initial tiles
    for (let idx = 0; idx < 3; idx++)
      for (let jdx = 0; jdx < PLAYER_COUNT; jdx++) {
        const TILE_SIZE = 4;
        const tiles = this._walls.obtain(TILE_SIZE);
        this._players[jdx].pickTiles(...tiles);
      }

    // player pick up last tiles
    this._players[0].pickTiles(
      ...[...this._walls.obtain(), ...this._walls.obtain(1, 3)]
    );
    for (let idx = 1; idx < PLAYER_COUNT; idx++)
      this._players[idx].pickTiles(...this._walls.obtain());

    // compensate flowers
    let done = false;
    while (!done) {
      done = true;
      // for each player, compensate flowers on hand
      for (let idx = 0; idx < PLAYER_COUNT; idx++) {
        // if compensated, player might obtain more flowers
        // set done to false to run a recheck
        if (this.checkFlowers(idx)) done = false;
      }
    }
  }

  checkFlowers(idx: number) {
    const player = this._players[idx];

    // pop player.onHand flower(s) to players.flowers
    const flowerCount = player.popFlowers();

    // for however number of flower, compensate
    for (let jdx = 0; jdx < flowerCount; jdx++)
      player.pickTiles(this._walls.compensate());

    return flowerCount > 0;
  }

  async play(): Promise<Array<GameEvent>> {
    const events: Array<GameEvent> = [];

    // check that the wall ended, check at front
    // so that the player from last round would
    // still have to pop a tile
    if (!this._walls.length) this._running = false;

    // current player
    const player = this._players[this._currIndex];

    // ask him to throw a tile
    const tile = await player.popTile();
    events.push({ action: "pop", tile, playerIdx: this._currIndex });

    // check if anyone wants the tile
    const result: Array<TakeTileResult> = await Promise.all(
      this._players.map((player, idx) =>
        idx === this._currIndex
          ? { priority: TakePriority.NotTake, tiles: [] }
          : player.shouldTakeTile(
              tile,
              idx === (this._currIndex + 1) % PLAYER_COUNT
            )
      )
    );

    // get highest priority
    const highestPriority = result.reduce((acc, itm) => {
      return acc < itm.priority ? itm.priority : acc;
    }, TakePriority.NotTake);

    if (highestPriority === TakePriority.NotTake) {
      // if no one wants it
      this._onTable.push({ tile, by: this._currIndex });

      // increment to next player
      this._currIndex = (this._currIndex + 1) % PLAYER_COUNT;

      // give this player a new tile before recurring
      this._players[this._currIndex].pickTiles(...this._walls.obtain());
      events.push({ action: "pick", tile: "", playerIdx: this._currIndex });
    } else {
      // someone wanted the tile
      const playerIdx = result.findIndex(
        (itm) => itm.priority === highestPriority
      );
      const takeResult = result[playerIdx];
      const takenPlayer = this._players[playerIdx];

      // give this to this player and force a commit
      takenPlayer.pickTiles(tile);
      takenPlayer.formCommit(takeResult.tiles);

      // set current player index to player index,
      // so he would have to throw a tile
      this._currIndex = playerIdx;

      // compensate for this player if its Kong
      if (highestPriority === TakePriority.Kong) {
        // compensate
        takenPlayer.pickTiles(this._walls.compensate());
        events.push({ action: "kong", tile, playerIdx: this._currIndex });
      }

      // game is done
      if (highestPriority === TakePriority.Win) {
        this._running = false;
        events.push({ action: "win", tile, playerIdx: this._currIndex });
      }

      if (highestPriority === TakePriority.Triplet) {
        events.push({ action: "triplet", tile, playerIdx: this._currIndex });
      }

      if (highestPriority === TakePriority.Chow) {
        events.push({ action: "chow", tile, playerIdx: this._currIndex });
      }
    }

    // check if currentIndex player (after increment)
    // has flowers after:
    // 1. obtaining normally from wall
    // 2. got a compensate from Kong
    let hasFlower = true;
    while (hasFlower) {
      hasFlower = this.checkFlowers(this._currIndex);
      if (hasFlower)
        events.push({ action: "flower", tile: "", playerIdx: this._currIndex });
    }

    return events;
  }
}

export default Game;
