import { Flower, GameEventAction, TileType, Wind } from "../../constants";

export interface Player {
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
