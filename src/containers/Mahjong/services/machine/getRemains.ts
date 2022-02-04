import { Player } from "../player";
import { Game } from "../game";

const getRemains = (player: Player, game: Game) => {
  let remains = [...game.walls];
  game.players.map((gamePlayer) => {
    if (gamePlayer !== player) remains = [...remains, ...gamePlayer.onHands];
  });
  return remains;
};

export default getRemains;
