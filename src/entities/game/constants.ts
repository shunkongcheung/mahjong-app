import { TileType, Wind } from "../../constants";

import { Player } from "../player";

export type Deck = Array<TileType>;

export const PLAYER_COUNT = 4;

export type Players = [Player, Player, Player, Player];

export interface Game {
  players: Players;
  onTable: Array<{ tile: TileType; by: number }>;
  walls: Deck;
  wind: Wind;
  brookerIndex: number;
  currIndex: number;
  running: boolean;
}
