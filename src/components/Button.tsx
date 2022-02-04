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
  transition: background 0.2s linear;
  `
      : `
  outline: 1px solid ${theme.colors.primary[400]};
  background: white;
  color: ${theme.colors.primary[400]};
  transition: color 0.2s linear;
  `}

  padding: 5px 10px;

  &:hover {
    cursor: pointer;
    background: ${({ theme, varient }) =>
      varient === "primary" && theme.colors.primary[500]};

    color: ${({ theme, varient }) =>
      varient === "normal" && theme.colors.primary[700]};
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
