import { NextPage } from "next";
import React from "react";
import styled from "styled-components";

import { getInitialGame ,getInitialTiles } from "../../services";

interface DemoSetProps {
  set: Array<{
    name: string;
    options: Array<{ name: string; call: () => any }>;
  }>;
}

const Container = styled.div``;

const Select = styled.select``;

const DemoSet: React.FC<DemoSetProps> = ({ set }) => (
  <Select>
    {set.map(({ name, options }, idx) => (
      <optgroup label={name} key={`${name}-${idx}`}>
        {options.map(({ name, call }, jdx) => (
          <option
            value={name}
            key={`${name}-${idx}-${jdx}`}
            onClick={() => console.log(call())}
          >
            {name}
          </option>
        ))}
      </optgroup>
    ))}
  </Select>
);

const ServicesDemo: NextPage = () => {
  return (
    <Container>
      <DemoSet
        set={[
          {
            name: "Initial Tiles",
            options: [
              {
                name: "ordered tiles",
                call: () => getInitialTiles(false),
              },
              {
                name: "random tiles",
                call: () => getInitialTiles(),
              },
            ],
          },
          {
            name: "Game State",
            options: [
              {
                name: "initial game",
                call: () => getInitialGame(),
              },
            ],
          },
        ]}
      />
    </Container>
  );
};

export default ServicesDemo;
