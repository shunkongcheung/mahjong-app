import { TileType } from "../../constants";
import { Deck } from "./constants";

const compensate = (deck: Deck): TileType => {
  const compensate = deck.pop() as TileType;
  return compensate;
};

export default compensate;
