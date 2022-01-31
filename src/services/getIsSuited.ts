import { Bamboo, Character, Dot, TileType } from "../constants";

const getIsSuited = (tile: TileType) => {
  const [tileSuit, _] = tile.split(".");
  const suits = [
    Bamboo.One.split(".")[0],
    Character.One.split(".")[0],
    Dot.One.split(".")[0],
  ];

  return suits.includes(tileSuit);
};

export default getIsSuited;
