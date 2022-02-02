import { TileType } from "../constants";

type Deck = Array<TileType>;

export const obtain = (deck: Deck, count = 1, skip = 0): Deck => {
  const obtained = deck.splice(skip, count);
  return obtained;
};

export const compensate = (deck: Deck): TileType => {
  const compensate = deck.pop() as TileType;
  return compensate;
};

export default Deck;
