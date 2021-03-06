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
  Spring = "flower.1",
  Summer = "flower.2",
  Autumn = "flower.3",
  Winter = "flower.4",
  Plum = "flower.5",
  Orchid = "flower.6",
  Chrysanthemum = "flower.7",
  Bamboo = "flower.8",
}

export type TileType = Bamboo | Character | Dot | Wind | Dragon | Flower;

// scoring values and name
export type ScoreTuple = [number, string];

interface Score {
  [x: string]: ScoreTuple;
}

// scores just by looking at tiles
export const TileScore: Score = {
  CommonHand: [1, "平糊"],
  AllInTriplets: [3, "對對糊"],
  MixedOneSuit: [3, "混一色"],
  AllOneSuit: [7, "清一色"],
  AllHonorTiles: [10, "字一色"],
  SmallDragons: [5, "小三元"],
  GreatDragons: [8, "大三元"],
  SmallWinds: [6, "小四喜"], // shall be added with mixed one suit / all honors
  GreatWinds: [10, "大四喜"],
  ThirteenOrphans: [13, "十三么"],
  AllKongs: [18, "十八羅漢"],
  Orphans: [10, "么九"],
};

// conditional scores based on the way the player is winning
export const ConditionScore: Score = {
  SelfPick: [1, "自摸"],
  WindFromWall: [1, "門前清"],
  RobbingKong: [1, "搶槓"],
  WindByLastCatch: [1, "海底撈月"],
  WinByKong: [1, "槓上開花"], // shall be adding with 1 by SelfPick
  WinByDoubleKong: [8, "槓上槓"], // shall be adding with 1 by SelfPick
  Heaven: [40, "天糊"],
  Earth: [20, "地糊"],
  Flower: [1, "花"],
  Dragon: [1, "番子"],
  Wind: [1, "風"],
};

export enum GameEventAction {
  Kong = "gameEvent.6.kong",
  Triplet = "gameEvent.5.triplet",
  Chow = "gameEvent.4.chow",
  Flower = "gameEvent.3.flower",
  Pick = "gameEvent.2.pick",
  Pop = "gameEvent.1.pop",
  NoAction = "gameEvent.0.noAction",
}

export interface GameEvent {
  playerIdx: number;
  tile: TileType;
  action: GameEventAction;
}
