import { TileType } from "../constants";
import { getInitialTiles } from "../services";

class Deck {
  private _deck: Array<TileType>;

  constructor(isRandom = true) {
    this._deck = getInitialTiles(isRandom);
  }

  get length(): number {
    return this._deck.length;
  }

  obtain(count = 1, skip = 0): Array<TileType> {
    const obtained = this._deck.splice(skip, count);
    return obtained;
  }

  compensate(): TileType {
    // from flower / from Kongs
    return this._deck.pop() as TileType;
  }
}

export default Deck;
