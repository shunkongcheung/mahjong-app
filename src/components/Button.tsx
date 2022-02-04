import React, { ReactNode } from "react";
import styled from "styled-components";

type Varient = "primary" | "normal";

interface ButtonProps {
  children: ReactNode;
  onClick: () => any;
  varient?: Varient;
}

const Container = styled.button<{ varient: Varient }>`
  border: 0;
  ${({ theme, varient }) =>
    varient === "primary"
      ? `
  border-radius: 5px;
  color: white;
  background: ${theme.colors.primary[400]};
  `
      : `
  outline: 1px solid ${theme.colors.primary[400]};
  background: white;
  color: ${theme.colors.primary[400]};
  `}

  padding: 5px 10px;
  margin-right: 10px;

  transition: background 0.2s linear;

  &:hover {
    cursor: pointer;
    background: ${({ theme, varient }) =>
      varient === "primary" && theme.colors.primary[500]};
    outline: 2px solid ${({ theme }) => theme.colors.primary[200]};
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  varient = "primary",
}) => {
  return (
    <Container onClick={onClick} varient={varient}>
      {children}
    </Container>
  );
};

export default Button;
