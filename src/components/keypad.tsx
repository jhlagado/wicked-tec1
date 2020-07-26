import * as React from 'react';
import styled from 'styled-components';
import { KeyButton } from './key-button';
import { Stylable, EventFunc, Dict } from '../types';

const getKeyText = (key: string) => {
  if (key === '@') {
    return 'AD';
  }
  if (key === 'G') {
    return 'GO';
  }
  return key;
};

const keyTranslation: Dict<any> = {
  '@': 'Tab',
  G: 'Enter',
};

interface KeypadProps extends Stylable {
  translate: string;
  onClick: EventFunc;
}

const BaseKeypad = ({ translate, onClick, className }: KeypadProps) => {
  return (
    <div className={`${className} keypad-classic`}>
      {Array(5 * 4)
        .fill(0)
        .map((_item, index) => {
          const key = translate[index];
          const x = index % 5;
          const y = Math.floor(index / 5);
          const code = key in keyTranslation ? keyTranslation[key] : key;
          return (
            <KeyButton
              key={index}
              code={code}
              text={getKeyText(key)}
              left={438 + 31 * x}
              top={239 + 30.5 * y}
              onClick={onClick}
            />
          );
        })}
    </div>
  );
};

export const Keypad = styled(BaseKeypad)``;
