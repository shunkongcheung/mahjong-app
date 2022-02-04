import React from "react";
import styled from "styled-components";

import { ScoreTuple } from "./constants";

interface WinnerInfoProps {
  playerIdx: number;
  winnerScores: Array<ScoreTuple>;
}

const Container = styled.div`
  padding: 10px 0;
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const WinnerName = styled.h3`
  text-align: center;
  margin: 0;
`;

const WinnerScoreContainer = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const WinnerScoreItem = styled.li`
  text-align: center;
`;

const WinnerInfo: React.FC<WinnerInfoProps> = ({ playerIdx, winnerScores }) => {
  return (
    <Container>
      <WinnerName>{playerIdx + 1}號玩家勝</WinnerName>
      <WinnerScoreContainer>
        {winnerScores.map(([score, desc], idx) => (
          <WinnerScoreItem key={`WinnerScoreItem-${idx}`}>
            {`${desc} ${score} 番`}
          </WinnerScoreItem>
        ))}
      </WinnerScoreContainer>
    </Container>
  );
};
export default WinnerInfo;
