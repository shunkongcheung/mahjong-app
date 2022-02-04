import React, { ReactNode, useMemo } from "react";
import styled from "styled-components";

import { Button } from "../../components";

import EventItem from "./EventItem";
import PlayerRow from "./PlayerRow";
import WinnerInfo from "./WinnerInfo";
import { getI18N, PLAYER_COUNT } from "./services";
import useMahjong from "./useMahjong";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Section = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;

  width: ${({ width }) => (width ? width : "100%")};
  height: 100%;

  outline: 1px solid ${({ theme }) => theme.colors.primary[500]}; ;
`;

const CtrlBtn = styled(Button)`
  width: 100%;
  border-radius: 0px;
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const InfoItem = styled.div`
  text-align: center;
  margin-right: 10px;
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  overflow-y: auto;
  height: 100%;
`;

const Mahjong: React.FC = () => {
  const { game, events, move, newRound } = useMahjong();

  const renderedPlayerRow = useMemo(() => {
    let rows: Array<ReactNode> = [];
    const onTableReverse = [...game.onTable].reverse();
    for (
      let idx = game.brookerIndex;
      idx < game.brookerIndex + PLAYER_COUNT;
      idx++
    ) {
      const playerIdx = idx % PLAYER_COUNT;
      rows.push(
        <PlayerRow
          isCurrIndex={playerIdx === game.currIndex}
          key={`PlayerRow-${playerIdx}`}
          {...game.players[playerIdx]}
          onTable={onTableReverse
            .filter((itm) => itm.by === playerIdx)
            .map(({ tile }) => tile)}
        />
      );
    }
    return rows;
  }, [game]);

  return (
    <Container>
      <Row>
        <Section width="300px">
          <InfoItem>
            {getI18N(game.wind)}圈
            {getI18N(game.players[game.brookerIndex].gameWinds[1])}局
          </InfoItem>
          <InfoItem>尚餘牌數: {game.walls.length}</InfoItem>
          {game.running ? (
            <CtrlBtn onClick={move} varient="normal">
              下一步
            </CtrlBtn>
          ) : (
            <>
              <CtrlBtn onClick={newRound} varient="normal">
                下一局
              </CtrlBtn>
              <WinnerInfo
                playerIdx={game.winnerIdx}
                winnerScores={game.winnerScores}
              />
            </>
          )}
          <EventList>
            {events.map((event, idx) => (
              <EventItem key={`EventItem-${idx}`} {...event} />
            ))}
          </EventList>
        </Section>
        <Section>{renderedPlayerRow}</Section>
      </Row>
    </Container>
  );
};

export default Mahjong;
