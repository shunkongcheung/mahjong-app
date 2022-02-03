import { Player } from "../player";

const getPlayerCopy = (player: Player): Player =>
  JSON.parse(JSON.stringify(player)) as Player;

export default getPlayerCopy;
