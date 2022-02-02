import { Flower, TileType } from "../constants";

export enum TakePriority {
  Win = 4,
  Kong = 3,
  Triplet = 2,
  Chow = 1,
  NotTake = 0,
}

export interface TakeTileResult {
  tiles: Array<TileType>;
  priority: TakePriority;
}

class Player {
  private _flowers: Array<Flower>;
  private _onHands: Array<TileType>;
  private _committed: Array<Array<TileType>>;

  constructor() {
    this._flowers = [];
    this._onHands = [];
    this._committed = [];
  }

  get flowers() {
    return [...this._flowers];
  }
  get onHands() {
    return [...this._onHands];
  }
  get committed() {
    return [...this._committed];
  }

  popFlowers() {
    // move flowers from onHands to flowers
    // return count of flowers

    const allFlowers: Array<TileType> = Object.values(Flower);

    const flowers = allFlowers.filter((itm) => this._onHands.includes(itm));

    this._flowers = [...this._flowers, ...(flowers as Array<Flower>)];

    this._onHands = this._onHands.filter((itm) => !allFlowers.includes(itm));

    return flowers.length;
  }

  pickTiles(...tiles: Array<TileType>) {
    this._onHands = [...this._onHands, ...tiles].sort();
  }

  async popTile(): Promise<TileType> {
    const tile = await this.toThrowTile();

    const idx = this._onHands.findIndex((itm) => itm === tile);
    this._onHands.splice(idx, 1);

    return tile;
  }

  formCommit(tiles: Array<TileType>) {
    // validate all tiles can be found from
    let temp: Array<TileType> = [];

    const success = tiles.reduce((acc: boolean, tile: TileType) => {
      if (!acc) return false;

      // find item from onHands
      const index = this._onHands.findIndex((itm) => itm === tile);
      if (index < 0) return false;

      // temporarily store the ejected tile
      this._onHands.splice(index, 1);
      temp.push(tile);

      return true;
    }, true);

    if (!success) {
      // if not successful, add back ejected tiles
      this._onHands = this._onHands.concat(temp).sort();
      return false;
    }

    // tiles were ejected, just need to add it to committed
    this._committed.push([...tiles].sort());
    return true;
  }

  getPossibleTriplet(tile: TileType): Array<TileType> {
    const count = this._onHands.filter((itm) => itm === tile).length;
    return count >= 2 ? [tile, tile, tile] : [];
  }

  getPossibleKong(tile: TileType): Array<TileType> {
    const count = this._onHands.filter((itm) => itm === tile).length;
    return count > 3 ? [tile, tile, tile, tile] : [];
  }

  getPossibleChows(tile: TileType): Array<Array<TileType>> {
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
        const index = this._onHands.findIndex((itm) => itm === tileName);
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
  }

  // play the game
  async shouldTakeTile(
    tile: TileType,
    isChowable: boolean
  ): Promise<TakeTileResult> {
    let possibleCombo: Array<TakeTileResult> = [];

    const kong = this.getPossibleKong(tile);
    if (kong.length)
      possibleCombo.push({ priority: TakePriority.Kong, tiles: kong });

    const triplets = this.getPossibleKong(tile);
    if (triplets.length)
      possibleCombo.push({ priority: TakePriority.Triplet, tiles: triplets });

    if (isChowable) {
      const chows = this.getPossibleChows(tile);
      chows.map((tiles) => {
        possibleCombo.push({ priority: TakePriority.Chow, tiles });
      });
    }

    const want = await Promise.all(
      possibleCombo.map(async (result) => this.shouldTakeCombo(result.tiles))
    );

    for (let idx = 0; idx < want.length; idx++)
      if (want[idx]) return possibleCombo[idx];

    return { priority: TakePriority.NotTake, tiles: [] };
  }

  // Note: functions to be override
  async shouldTakeCombo(tiles: Array<TileType>): Promise<boolean> {
    // to be implemented
    return false;
  }
  async toThrowTile(): Promise<TileType> {
    // to be implemented
    return this.onHands[0];
  }
}

export default Player;
