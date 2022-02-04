import React, { ReactNode } from "react";
import styled from "styled-components";

interface ButtonProps {
  children: ReactNode;
  onClick: () => any
}

const Container = styled.button`
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

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <Container onClick={onClick}>{children}</Container>;
};

export default Button;
