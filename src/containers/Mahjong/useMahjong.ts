import { useCallback, useEffect, useState } from "react";
import {
  Game,
  Player,
  distribute,
  regenerate,
  getNewGame,
  getMachine,
  play,
} from "./services";
import { GameEvent } from "./constants";

const getGameCopy = (_game: Game) => {
  const game = JSON.parse(JSON.stringify(_game)) as Game;
  game.players.map((player, idx) => {
    player.shouldTakeCombo = _game.players[idx].shouldTakeCombo;
    player.toThrowTile = _game.players[idx].toThrowTile;
  });
  return game;
};

const STORAGE_NAME = "game-storage";
const DEFAULT_PLAYERS: [Player, Player, Player, Player] = [
  getMachine(),
  getMachine(),
  getMachine(),
  getMachine(),
];

const useMahjong = () => {
  const [game, setGame] = useState<Game>(getNewGame(DEFAULT_PLAYERS));
  const [events, setEvents] = useState<Array<GameEvent>>([]);

  const load = useCallback(() => {
    const _game = JSON.parse(localStorage.getItem(STORAGE_NAME) as string);

    const { events, ...game } = _game as any;

    game.players.map((player: Player) => {
      player.toThrowTile = DEFAULT_PLAYERS[0].toThrowTile;
      player.shouldTakeCombo = DEFAULT_PLAYERS[0].shouldTakeCombo;
    });
    setGame(game);
    setEvents(events);
  }, [setEvents, setGame]);

  const save = useCallback((game: Game, events: Array<GameEvent>) => {
    const prevVal = localStorage.getItem(STORAGE_NAME);

    localStorage.setItem(STORAGE_NAME, JSON.stringify({ ...game, events }));
    if (!prevVal) return;

    const prevName = `${STORAGE_NAME}_${new Date().toISOString()}`;
    localStorage.setItem(prevName, prevVal);

    let prevKeys: Array<string> = [];
    for (let idx = 0; idx < localStorage.length; idx++) {
      const currKey = localStorage.key(idx);
      if (
        currKey &&
        currKey.startsWith(STORAGE_NAME) &&
        currKey !== STORAGE_NAME
      )
        prevKeys.push(currKey);
    }
    if (prevKeys.length > 5) {
      prevKeys.sort();
      for (let idx = 0; idx < prevKeys.length - 5; idx++)
        localStorage.removeItem(prevKeys[0]);
    }
  }, []);

  const move = useCallback(async () => {
    const copy = getGameCopy(game);
    const events = await play(copy);
    setGame(copy);
    events.reverse();
    setEvents((o) => {
      const nEvents = [...events, ...o];
      save(copy, nEvents);
      return nEvents;
    });
  }, [game, setEvents, save, setGame]);

  const newGame = useCallback(() => {
    const _game = getNewGame(DEFAULT_PLAYERS);
    const copy = getGameCopy(_game);

    distribute(copy);
    save(copy, []);
    setGame(copy);
    setEvents([]);
  }, [setEvents, save, setGame]);

  const newRound = useCallback(() => {
    const copy = getGameCopy(game);
    regenerate(copy);
    distribute(copy);
    save(copy, []);
    setGame(copy);
    setEvents([]);
  }, [game, setEvents, save, setGame]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  return { events, game, load, move, newRound, newGame };
};

export default useMahjong;
