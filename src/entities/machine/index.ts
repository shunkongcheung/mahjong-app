import { Player } from "../player";

import shouldTakeCombo from "./shouldTakeCombo";
import toThrowTile from "./toThrowTile";

const getNormalMachine = (): Player => ({
  gameWinds: [],
  gameFlowers: [],

  flowers: [],
  onHands: [],
  committed: [],

  shouldTakeCombo,
  toThrowTile,
});

export default getNormalMachine;
