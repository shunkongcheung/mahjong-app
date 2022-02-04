import styled from "styled-components";

import { Tile } from "../../components";

import { TileType } from "./constants";
import { Player } from "./services";

interface PlayerRowProps extends Player {
  isCurrIndex: boolean;
  onTable: Array<TileType>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[500]};
`;

const CurrIndicator = styled.div`
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
`;

const Section = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
`;

const OnTableContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

const ON_TABLE_TILE_WIDTH = 15;
const ON_HAND_TILE_WIDTH = 30;

const PlayerRow: React.FC<PlayerRowProps> = ({
  isCurrIndex,
  onHands,
  onTable,
  flowers,
  committed,
}) => (
  <Container>
    <Section>
      <CurrIndicator>{isCurrIndex && <>&#9824;</>}</CurrIndicator>
      <Row>
        {onHands.map((tile, idx) => (
          <Tile
            key={`PlayerTile-OnHands-${idx}-${tile}`}
            type={tile}
            width={ON_HAND_TILE_WIDTH}
          />
        ))}
      </Row>
      {committed.map((tiles, idx) => (
        <Row key={`PlayerTile-Committed-${idx}`}>
          {tiles.map((tile, tdx) => (
            <Tile
              key={`PlayerTile-Committed-${idx}-${tdx}-${tile}`}
              type={tile}
              width={ON_HAND_TILE_WIDTH}
            />
          ))}
        </Row>
      ))}
      <Row>
        {flowers.map((tile, idx) => (
          <Tile
            key={`PlayerTile-Flowers-${idx}-${tile}`}
            type={tile}
            width={ON_HAND_TILE_WIDTH}
          />
        ))}
      </Row>
    </Section>
    <Section>
      <OnTableContainer>
        {onTable.map((tile, idx) => (
          <Tile
            key={`PlayerTile-OnTable-${idx}-${tile}`}
            type={tile}
            width={ON_TABLE_TILE_WIDTH}
          />
        ))}
      </OnTableContainer>
    </Section>
  </Container>
);

export default PlayerRow;
