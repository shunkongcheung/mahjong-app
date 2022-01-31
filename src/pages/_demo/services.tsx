import { NextPage } from "next";
import React from "react";
import styled from "styled-components";

import { getInitialTiles } from "../../services";

interface DemoSetProps {
  set: Array<{ name: string; call: () => any }>;
}

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary[400]};
  border: 0;
  border-radius: 5px;
  padding: 10px 20px;
  color: white;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const DemoSet: React.FC<DemoSetProps> = ({ set }) => (
  <Row>
    {set.map(({ name, call }, idx) => (
      <Button key={`${name}-${idx}`} onClick={() => console.log(call())}>
        {name}
      </Button>
    ))}
  </Row>
);

const ServicesDemo: NextPage = () => {
  return (
    <Container>
      <DemoSet
        set={[
          {
            name: "Initial Tiles",
            call: () => getInitialTiles(false),
          },
          {
            name: "Initial Tiles (random)",
            call: () => getInitialTiles(),
          },
        ]}
      />
    </Container>
  );
};

export default ServicesDemo;
