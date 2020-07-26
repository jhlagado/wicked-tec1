import * as React from 'react';
import styled from 'styled-components';
import { Stylable } from '../types';

const getFill = (segments: number, mask: number) =>
  segments & mask ? 'red' : '#320000';

interface DigitProps extends Stylable {
  marginLeft: string;
  segments: number;
}

const BaseDigit = ({ segments, className }: DigitProps) => (
  <div className={`${className} seven-seg`}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 12 20">
      <g className="digit">
        <polygon
          fill={getFill(segments, 0x01)}
          points=" 1, 1  2, 0  8, 0  9, 1  8, 2  2, 2"
        />
        <polygon
          fill={getFill(segments, 0x08)}
          points=" 9, 1 10, 2 10, 8  9, 9  8, 8  8, 2"
        />
        <polygon
          fill={getFill(segments, 0x20)}
          points=" 9, 9 10,10 10,16  9,17  8,16  8,10"
        />
        <polygon
          fill={getFill(segments, 0x80)}
          points=" 9,17  8,18  2,18  1,17  2,16  8,16"
        />
        <polygon
          fill={getFill(segments, 0x40)}
          points=" 1,17  0,16  0,10  1, 9  2,10  2,16"
        />
        <polygon
          fill={getFill(segments, 0x02)}
          points=" 1, 9  0, 8  0, 2  1, 1  2, 2  2, 8"
        />
        <polygon
          fill={getFill(segments, 0x04)}
          points=" 1, 9  2, 8  8, 8  9, 9  8,10  2,10"
        />
        <circle fill={getFill(segments, 0x10)} cx="11" cy="17" r="1" />
      </g>
    </svg>
  </div>
);

export const Digit = styled(BaseDigit)`
  display: inline-block;
  width: 4.34%;
  margin-left: ${(props) => props.marginLeft || '2.3%'};
`;
