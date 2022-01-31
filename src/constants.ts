// tile types
export enum Bamboo {
  One = "bamboo.1",
  Two = "bamboo.2",
  Three = "bamboo.3",
  Four = "bamboo.4",
  Five = "bamboo.5",
  Six = "bamboo.6",
  Seven = "bamboo.7",
  Eight = "bamboo.8",
  Nine = "bamboo.9",
}

export enum Character {
  One = "character.1",
  Two = "character.2",
  Three = "character.3",
  Four = "character.4",
  Five = "character.5",
  Six = "character.6",
  Seven = "character.7",
  Eight = "character.8",
  Nine = "character.9",
}

export enum Dot {
  One = "dot.1",
  Two = "dot.2",
  Three = "dot.3",
  Four = "dot.4",
  Five = "dot.5",
  Six = "dot.6",
  Seven = "dot.7",
  Eight = "dot.8",
  Nine = "dot.9",
}

export enum Wind {
  East = "wind.4",
  South = "wind.5",
  West = "wind.6",
  North = "wind.7",
}

export enum Dragon {
  Red = "dragon.1",
  Green = "dragon.2",
  White = "dragon.3",
}

export enum Flower {
  East = "flower.1",
  South = "flower.2",
  West = "flower.3",
  North = "flower.4",
}

export enum Season {
  East = "season.5",
  South = "season.6",
  West = "season.7",
  North = "season.8",
}

export type TileType =
  | Bamboo
  | Character
  | Dot
  | Wind
  | Dragon
  | Flower
  | Season;

// game status
export interface Player {
  isStarter: boolean;
  flowers: Array<Flower | Season>;
  onHand: Array<TileType>;
  committed: Array<Array<TileType>>;
}

export interface Game {
  wind: Wind;
  turn: Player;
  players: Array<Player>;
  remaining: Array<TileType>;
  onTable: Array<TileType>;
}
