import React from "react";
import styled from "styled-components";
import { GameEvent } from "./constants";
import { getI18N } from "./services";

const Container = styled.li`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
`;

const InfoItem = styled.div`
  margin-right: 10px;
`;

const EventItem: React.FC<GameEvent> = ({ playerIdx, tile, action }) => (
  <Container>
    <InfoItem>{playerIdx + 1}號玩家</InfoItem>
    <InfoItem>{getI18N(tile)}</InfoItem>
    <InfoItem>{getI18N(action)}</InfoItem>
  </Container>
);

export default EventItem;
