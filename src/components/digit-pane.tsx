import * as React from 'react';
import styled from 'styled-components';
import { Digit } from './digit';
import { Stylable } from '../types';

interface DigitPaneProps extends Stylable {
  display: number[];
}

const BaseDigitPane = ({ display, className }: DigitPaneProps) => (
  <div className={`${className} seven-seg-display`}>
    {display.map((segs: number, index: number) => (
      <Digit
        key={index}
        marginLeft={index === 1 ? '4.9%' : ''}
        segments={segs}
      ></Digit>
    ))}
  </div>
);

export const DigitPane = styled(BaseDigitPane)`
  white-space: nowrap;
`;
