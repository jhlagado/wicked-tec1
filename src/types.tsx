import { StyledProps } from 'styled-components';

export interface Dict<T> {
  [key: string]: T;
}

export type AnyObj = { [key: string]: any };

export type EventFunc = (event: any) => void;

export type Stylable = StyledProps<{
  className?: string;
  children?: any[];
}>;

export interface Message {
  type: string;
}

export interface MemoryMessage extends Message {
  type: 'POST_MESSAGE';
  from: number;
  size: number;
  buffer: ArrayBuffer;
}

export interface CPUMessage extends Message {
  type: 'POST_OUTPORTS';
  buffer: ArrayBuffer;
  display: ArrayBuffer;
  wavelength: any;
}

export type Thunk = () => void;
