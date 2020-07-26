import * as React from 'react';
import styled from 'styled-components';
import MemoryMap from 'nrf-intel-hex';
import {
  audioInit,
  audioPlay,
  audioValue,
  isAudioInitialised,
} from '../../util/audio';
import { layouts, keyCodes, jelicMapping } from '../../constants';
import { Stylable, Dict } from '../../types';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import {
  isHidden,
  addVisibilityListener,
  removeVisiblityListener,
} from '../../util/page-visibility';
import { ROM as Mon1BRom } from './MON-1B';

const anchor = document.createElement('a');

const getTecHexKey = (code: string) => {
  if (code.length !== 1) return null;
  const hex = parseInt(code, 16);
  return isNaN(hex) ? null : hex;
};

const getTecKey = (
  code: string,
  shiftLocked: boolean,
  mappingObj: Dict<any>
) => {
  const code1 = code in mappingObj ? mappingObj[code] : code;
  let tecKey = getTecHexKey(code1);
  if (tecKey == null) {
    if (!(code1 in keyCodes)) {
      return false;
    }
    tecKey = keyCodes[code1];
  }
  const bit5 = 0b00100000;
  const mask = ~bit5;
  let tecKey1 = tecKey & mask;
  if (!shiftLocked) {
    tecKey1 |= bit5;
  }
  return tecKey1;
};

const BaseTec1 = ({ className }: Stylable) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [display, setDisplay] = React.useState(Array(6).fill(0));
  const [shiftLocked, setShiftLocked] = React.useState(false);
  const [worker, setWorker] = React.useState<Worker>();
  const [layout, setLayout] = React.useState(
    localStorage.getItem('layout') || layouts.CLASSIC
  );
  const [mapping, setMapping] = React.useState(
    localStorage.getItem('mapping') || ''
  );
  const [mappingObj, setMappingObj] = React.useState();

  const [hidden, setHidden] = React.useState(false);

  const postWorkerMessage = (message: any) => {
    if (worker) {
      worker.postMessage(message);
    }
  };

  const handleVisibility = () => {
    setHidden(isHidden());
  };

  const handleChangeLayout = (newLayout: string) => {
    const newLayout1 = (newLayout || '').trim().toUpperCase();
    if (!newLayout1) {
      setLayout(layouts.CLASSIC);
    } else if (newLayout1 in layouts) {
      setLayout(layouts[newLayout1]);
    } else {
      setLayout(newLayout1);
    }
    localStorage.setItem('layout', newLayout1);
  };

  const handleMappingButton = (newMapping: string) => {
    let newMapping1 = newMapping || '';
    if (newMapping1.toUpperCase() === 'JELIC') {
      newMapping1 = jelicMapping;
    }
    setMapping(newMapping1);
    localStorage.setItem('mapping', newMapping1);
  };

  const handleCode = (code: string) => {
    if (!isAudioInitialised()) {
      audioInit();
    }
    if (code === 'Escape') {
      postWorkerMessage({ type: 'RESET' });
      return true;
    }
    if (code === 'ShiftLock') {
      setShiftLocked(!shiftLocked);
      return true;
    }
    if (code === 'Shift') {
      return false;
    }
    const tecKey = getTecKey(code, shiftLocked, mappingObj);
    postWorkerMessage({ type: 'SET_INPUT_VALUE', port: 0, value: tecKey });
    postWorkerMessage({
      type: 'SET_KEY_VALUE',
      code: tecKey,
      pressed: !shiftLocked,
    });
    postWorkerMessage({ type: 'NMI' });
    return true;
  };

  const receiveMessage = (event: { data: any }) => {
    if (event.data.type === 'POST_DISPLAY') {
      setDisplay([...new Uint8Array(event.data.display)]);
    } else if (event.data.type === 'POST_WAVELENGTH') {
      const { wavelength } = event.data;
      const frequency = wavelength ? 500000 / wavelength : 0;
      audioValue(frequency);
    } else if (event.data.type === 'POST_ALL_MEMORY') {
      const { memory } = event.data;
      localStorage.setItem('memory', memory);
    } else if (event.data.type === 'POST_MEMORY') {
      const { from, buffer } = event.data;
      const memMap = new MemoryMap();
      const bytes = new Uint8Array(buffer);
      memMap.set(from, bytes);

      anchor.download = `TEC-1-${new Date().getTime()}.hex`;
      const hexString = memMap.asHexString();
      anchor.href = URL.createObjectURL(
        new Blob([hexString], { type: 'application/octet-stream' })
      );
      anchor.dataset.downloadurl = [
        'text/plain',
        anchor.download,
        anchor.href,
      ].join(':');
      anchor.click();
    }
  };

  React.useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
    addVisibilityListener(handleVisibility);
    const newWorker = new Worker('../../worker/worker.ts');
    setWorker(newWorker);
    newWorker.onmessage = receiveMessage;
    newWorker.postMessage({ type: 'INIT' });
    let memory = localStorage.getItem('memory') || '';
    if (!memory) {
      memory = Mon1BRom;
    }
    newWorker.postMessage({ type: 'UPDATE_MEMORY', value: memory });
    return () => {
      if (newWorker) {
        newWorker.terminate();
      }
      removeVisiblityListener(handleVisibility);
    };
  }, []);

  React.useEffect(() => {
    const pairs = (mapping || '').trim().split(' ');
    const entries = pairs
      .map((pair) => pair.split(':'))
      .filter((entry) => entry.length === 2);
    const newMappingObj = Object.fromEntries(entries);
    setMappingObj(newMappingObj);
  }, [mapping]);

  React.useEffect(() => {
    if (isAudioInitialised()) {
      audioPlay(!hidden);
    }
    postWorkerMessage({ type: 'HIDDEN', value: hidden });
  }, [worker, hidden]);

  const reactKeyDown = (event: any) => {
    const { key } = event;
    if (event.key === 'Shift') {
      setShiftLocked(true);
    }
    handleCode(key.length === 1 ? key.toUpperCase() : key);
  };

  const reactKeyUp = (event: any) => {
    if (event.key === 'Shift') {
      setShiftLocked(false);
    }
  };

  return (
    <div
      className={`${className} tec1-app`}
      tabIndex={0}
      onKeyDown={reactKeyDown}
      onKeyUp={reactKeyUp}
      ref={ref}
    >
      {worker && <Header worker={worker} />}
      <Main
        layout={layout}
        display={display}
        shiftLocked={shiftLocked}
        handleCode={handleCode}
      />
      {worker && (
        <Footer
          worker={worker}
          layout={layout}
          mapping={mapping}
          onChangeLayout={handleChangeLayout}
          onChangeMapping={handleMappingButton}
        />
      )}
    </div>
  );
};

export const Tec1 = styled(BaseTec1)`
  outline: none;
  margin: 20px;
  margin-right: auto;
  margin-left: auto;
  display: inline-block;
  position: relative;
`;
