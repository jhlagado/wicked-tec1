import * as React from 'react';
import styled from 'styled-components';
import { Keypad } from '../../components/keypad';
import { KeyButton } from '../../components/key-button';
import { DigitPane } from '../../components/digit-pane';
import tec1Image from '../../../assets/TEC-1x.jpg';
import { Stylable, EventFunc } from '../../types';

interface MainProps extends Stylable {
  layout: string;
  display: any[];
  shiftLocked: boolean;
  handleCode: EventFunc;
}

const BaseMain = ({
  layout,
  display,
  shiftLocked,
  handleCode,
  className,
}: MainProps) => {
  return (
    <div className={`${className} tec1-main`}>
      <div className="digit-pane">
        <DigitPane display={display} />
      </div>
      <Keypad onClick={handleCode} translate={layout} />
      <KeyButton
        code={'Escape'}
        text={'R'}
        left={349}
        top={301}
        onClick={handleCode}
      />
      <KeyButton
        code={'ShiftLock'}
        text={'SH'}
        locked={shiftLocked}
        left={386}
        top={333}
        onClick={handleCode}
      />
    </div>
  );
};
export const Main = styled(BaseMain)`
  width: 600px;
  height: 375px;
  background-image: url(${tec1Image});
  background-size: 100% 100%;
  position: relative;

  .digit-pane {
    direction: rtl;
    padding: 0px 20px;
    position: relative;
    top: 74.4%;
    right: 42.6%;
  }
`;
