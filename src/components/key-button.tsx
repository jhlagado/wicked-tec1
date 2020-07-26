import * as React from 'react';
import styled from 'styled-components';
import { EventFunc, Stylable } from '../types';

interface KeyButtonProps extends Stylable {
  code: string;
  locked?: boolean;
  text: string;
  left: number;
  top: number;
  onClick: EventFunc;
}

const BaseKeyButton = ({
  code,
  locked,
  text,
  onClick,
  className,
}: KeyButtonProps) => {
  const handleEvent = () => {
    onClick(code);
  };

  return (
    <div className={`${className} key-button`} onMouseDown={handleEvent}>
      <div className={`${locked ? 'key-button-locked' : ''}`}>{text}</div>
    </div>
  );
};

export const KeyButton = styled(BaseKeyButton)`
  position: absolute;
  color: black;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: bold;
  width: 20px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  user-select: none;

  & > div {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.key-button-locked {
      color: #444;
    }
  }
`;
