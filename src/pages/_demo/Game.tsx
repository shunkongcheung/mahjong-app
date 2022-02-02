import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { Tile } from "../../components";
import { GameEvent, TileType } from "../../constants";

import Game, {
  distribute,
  regenerate,
  getNewGame,
  play,
} from "../../entities/Game";
import Player from "../../entities/Player";
import { getI18N } from "../../services";

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary[400]};
  border: 0;
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  margin-right: 10px;

  transition: background 0.2s linear;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.primary[500]};
    outline: 2px solid ${({ theme }) => theme.colors.primary[200]};
  }
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const InfoItem = styled.div`
  margin-right: 10px;
`;

const Row = styled.div<{ isSimple?: boolean }>`
  width: 100%;
  display: flex;
  ${({ isSimple = false }) =>
    isSimple
      ? "padding: 0 15px;"
      : "border-bottom: 1px solid #ccc; padding: 10px 0; justify-content: space-evenly;"}
`;

const Section = styled.div<{ width: number }>`
  width: ${({ width }) => width}%;
  overflow-y: auto;
  height: 100%;
`;

const getPlayer = (): Player => ({
  gameWinds: [],
  gameFlowers: [],

  flowers: [],
  onHands: [],
  committed: [],

  async shouldTakeCombo(_: Player, __: Array<TileType>) {
    return true;
  },
  async toThrowTile(player: Player) {
    return player.onHands[0];
  },
});

const defaultPlayers = [getPlayer(), getPlayer(), getPlayer(), getPlayer()];

const getCopy = (_game: Game) => {
  const game = JSON.parse(JSON.stringify(_game)) as Game;
  game.players.map((player, idx) => {
    player.shouldTakeCombo = _game.players[idx].shouldTakeCombo;
    player.toThrowTile = _game.players[idx].toThrowTile;
  });
  return game;
};

const GameEventRow: React.FC<GameEvent> = ({ playerIdx, tile, action }) => (
  <Row>
    <InfoItem>{playerIdx}</InfoItem>
    <InfoItem>{getI18N(tile)}</InfoItem>
    <InfoItem>{getI18N(action)}</InfoItem>
  </Row>
);

const PlayerRow: React.FC<Player> = ({ onHands, flowers, committed }) => (
  <Row>
    <Row isSimple>
      {onHands.map((tile, idx) => (
        <Tile
          key={`PlayerTile-OnHands-${idx}-${tile}`}
          type={tile}
          width={40}
        />
      ))}
    </Row>
    <Row isSimple>
      {flowers.map((tile, idx) => (
        <Tile
          key={`PlayerTile-Flowers-${idx}-${tile}`}
          type={tile}
          width={40}
        />
      ))}
    </Row>
    {committed.map((tiles, idx) => (
      <Row isSimple key={`PlayerTile-Committed-${idx}`}>
        {tiles.map((tile, tdx) => (
          <Tile
            key={`PlayerTile-Committed-${idx}-${tdx}-${tile}`}
            type={tile}
            width={40}
          />
        ))}
      </Row>
    ))}
  </Row>
);

const GameDemo: NextPage = () => {
  const [game, setGame] = useState<Game>(getNewGame(defaultPlayers as any));
  const [events, setEvents] = useState<Array<GameEvent>>([]);

  const newGame = useCallback(() => {
    const _game = getNewGame(defaultPlayers as any);
    const copy = getCopy(_game);

    distribute(copy);
    setGame(copy);
    setEvents([]);
  }, [setEvents, setGame]);

  const newRound = useCallback(() => {
    const copy = getCopy(game);
    regenerate(copy);
    distribute(copy);
    setGame(copy);
    setEvents([]);
  }, [game, setEvents, setGame]);

  const move = useCallback(async () => {
    const copy = getCopy(game);
    const events = await play(copy);
    setGame(copy);
    events.reverse();
    setEvents((o) => [...events, ...o]);
  }, [game, setEvents, setGame]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  return (
    <Container>
      <Section width={70}>
        <Row>
          <Button onClick={newGame}>New Game</Button>
          <Button onClick={newRound}>New Round</Button>
          <Button onClick={move}>move</Button>
        </Row>
        <Row>
          <InfoItem>
            {getI18N(game.wind)}圈
            {getI18N(game.players[game.brookerIndex].gameWinds[1])}局
          </InfoItem>
          <InfoItem>尚餘牌數: {game.walls.length}</InfoItem>
        </Row>
        {game.players.map((player, idx) => (
          <PlayerRow key={`PlayerRow-${idx}`} {...player} />
        ))}
      </Section>
      <Section width={30}>
        {events.map((event, idx) => (
          <GameEventRow key={`GameEventRow-${idx}`} {...event} />
        ))}
      </Section>
    </Container>
  );
};

export default GameDemo;
