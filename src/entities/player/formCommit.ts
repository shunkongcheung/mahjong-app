import { TileType } from "../../constants";
import { Player } from "./constants";

const formCommit = (player: Player, tiles: Array<TileType>) => {
  // validate all tiles can be found from
  let temp: Array<TileType> = [];

  let success = tiles.reduce((acc: boolean, tile: TileType) => {
    if (!acc) return false;

    // find item from onHands
    const index = player.onHands.findIndex((itm) => itm === tile);
    if (index < 0) return false;

    // temporarily store the ejected tile
    player.onHands.splice(index, 1);
    temp.push(tile);

    return true;
  }, true);

  if (!success) {
    if (tiles.length === 4 && !success) {
      // if its a kong, check if triplet already exists
      let kongSuccess = player.committed.reduce((acc, commit) => {
        if (acc) return acc;

        // was a triplet
        if (commit[0] === tiles[0] && commit[1] === tiles[0]) {
          commit.push(tiles[0]);
          return true;
        }
        return false;
      }, false);
      success = kongSuccess;
    }

    if (!success) {
      // if not successful, add back ejected tiles
      player.onHands = player.onHands.concat(temp).sort();
      throw Error(`Invalid committing tiles: ${tiles.join(", ")}`);
    }
  } else {
    // tiles were ejected, just need to add it to committed
    player.committed.push([...tiles].sort());
  }
};

export default formCommit;
