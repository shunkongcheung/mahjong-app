import { Deck } from "./constants";

const obtain = (deck: Deck, count = 1, skip = 0): Deck => {
  const obtained = deck.splice(skip, count);
  return obtained;
};

export default obtain;
