import { Dict } from './types';

const PLUS = 16;
const MINUS = 17;
const GO = 18;
const AD = 19;

export const keyCodes: Dict<any> = {
  Tab: AD,
  Enter: GO,
  '+': PLUS,
  '-': MINUS,
};

export const layouts: Dict<string> = {
  CLASSIC: '@37BFG26AE-159D+048C',
  MODERN: '@CDEFG89AB-4567+0123',
  JELIC: '@789AG456B-123C+0FED',
};

export const jelicMapping =
  '/:A *:B -:C +:D Enter:E .:F ArrowRight:+ ArrowLeft:- ArrowUp:Tab ArrowDown:Enter ';
