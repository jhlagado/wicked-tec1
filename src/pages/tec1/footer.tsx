import * as React from 'react';
import styled from 'styled-components';
import { Stylable } from '../../types';

interface FooterProps extends Stylable {
  worker: any;
  layout: string;
  mapping: string;
  onChangeLayout: (layout: string) => void;
  onChangeMapping: (mapping: string) => void;
}

const BaseFooter = ({
  worker,
  layout,
  mapping,
  onChangeLayout,
  onChangeMapping,
  className,
}: FooterProps) => {
  const s = localStorage.getItem('smooth');
  const [smooth, setSmooth] = React.useState(true);
  const [speed, setSpeed] = React.useState('50');

  const postSpeed = (newSpeed: string) => {
    setSpeed(newSpeed);
    worker.postMessage({ type: 'SET_SPEED', value: newSpeed });
  };

  const postSmooth = (newSmooth: boolean) => {
    setSmooth(newSmooth);
    worker.postMessage({ type: 'SET_SMOOTH', value: newSmooth });
  };

  React.useEffect(() => {
    const speed0 = localStorage.getItem('speed') || '50';
    const smooth0 = localStorage.getItem('smooth');
    const smooth1 = smooth0 == null ? true : smooth0 === 'true'
    postSpeed(speed0);
    postSmooth(smooth1);
  }, []);

  const handleLayoutButton = () => {
    const newLayout = window.prompt(
      `The keys on the keypad are arranged into rows following this string.
@ is AD, G is GO. Case is ignored.
To restore the original TEC-1 layout clear the text.
`,
      layout
    );
    if (newLayout != null) {
      onChangeLayout(newLayout);
    }
  };

  const handleMappingButton = () => {
    const newMapping = window.prompt(
      `Enter mapping from keyboard to keypad as a string in the form:
k1:k2 k3:k4 k5:k6
Most keys are represented by their values e.g. A, 0, / etc.
Other keys are represented by strings: Enter, ArrowRight etc
see: https://www.w3.org/TR/uievents/#fixed-virtual-key-codes
      `,
      mapping
    );
    if (newMapping != null) {
      onChangeMapping(newMapping);
    }
  };

  const handleChangeSmooth = () => {
    const smooth1 = !smooth;
    localStorage.setItem('smooth', String(smooth1));
    postSmooth(smooth1);
  };

  const handleChangeSpeed = (event: any) => {
    const { value } = event.target;
    localStorage.setItem('speed', String(value));
    postSpeed(value);
  };

  return (
    <div className={`${className} tec1-footer`}>
      <div className={`${className} first-row`}>
        <div>
          <button type="button" onClick={handleLayoutButton}>
            Keypad layout
          </button>
        </div>
        <div>
          <button type="button" onClick={handleMappingButton}>
            Keyboard map
          </button>
        </div>
        <div>
          <input id="smooth" type="checkbox" checked={smooth} onChange={handleChangeSmooth} />
          <label htmlFor="smooth">Smooth</label>
        </div>
        <div>
          <label htmlFor="speed">
            Speed
            <input
              id="speed"
              type="range"
              min="0"
              max="99"
              value={speed || '50'}
              onChange={handleChangeSpeed}
            />
          </label>
        </div>
      </div>
      <p>MON 1 Restart:</p>
      <div className="restarts-panel">
        <div>
          <div>CF (RST 1) INVADERS</div>
          <div>D7 (RST 2) NIM</div>
          <div>DF (RST 3) LUNALANDER</div>
        </div>
        <div>
          <div>EF (RST 5) TUNE 1 Bealach An Doirín</div>
          <div>F7 (RST 6) TUNE 2 Biking up the Strand</div>
        </div>
      </div>
    </div>
  );
};

export const Footer = styled(BaseFooter)`
  .first-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 3px;
  }

  .restarts-panel {
    display: flex;
    justify-content: space-between;
  }
`;
