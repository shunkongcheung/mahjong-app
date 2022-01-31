import getInitialTiles from "./getInitialTiles";

import { Game, Player, TileType, Wind } from "../constants";

const getInitialGame = () => {
  const players: Array<Player> = [
    {
      isStarter: true,
      flowers: [],
      onHand: [],
      committed: [],
    },
    ...Array.from({ length: 3 }).map(() => ({
      isStarter: false,
      flowers: [],
      onHand: [],
      committed: [],
    })),
  ];

  const game: Game = {
    wind: Wind.East,
    turn: players[0],
    players,
    remaining: getInitialTiles(),
    onTable: [],
  };

  // distribute initial set of tiles
  const SET_SIZE = 13;

  // distribute one additional tile to first player
  const round = SET_SIZE * players.length + 1;

  for (let idx = 0; idx < round; idx++) {
    const tile = game.remaining.pop() as TileType;
    players[idx % players.length].onHand.push(tile);
  }

  // order players on hand tiles
  for (let idx = 0; idx < players.length; idx++) {
    players[idx].onHand.sort();
  }

  return game;
};

export default getInitialGame;
