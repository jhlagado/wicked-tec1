import * as React from 'react';
import styled from 'styled-components';
import { Stylable } from '../../types';

interface HeaderProps extends Stylable {
  worker: any;
}

const roms = {
  'MON-1': () => import('../../roms/MON-1'),
  'MON-1A': () => import('../../roms/MON-1A'),
  'MON-1B': () => import('../../roms/MON-1B'),
  'MON-2': () => import('../../roms/MON-2'),
  'JMON': () => import('../../roms/JMON'),
};

const BaseHeader = ({ worker, className }: HeaderProps) => {

  const [rom, setRom] = React.useState('');

  const handleUpload = (event: any) => {
    const { files } = event.target;
    if (files == null || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () =>
      worker.postMessage({ type: 'UPDATE_MEMORY', value: reader.result });
    reader.readAsText(file);
    setRom('');
  };

  const handleChangeROM = async (event: any) => {
    // we need to use import(literal_path) for
    // parcel to correctly bundle for lazy loading
    const { value } = event.target;
    const name = value as keyof typeof roms;
    if (name) {
      setRom(name);
      const func = roms[name];
      const result = await func();
      worker.postMessage({ type: 'UPDATE_MEMORY', value: result.ROM })
    }
  };

  const handleDownload = () => {
    const pfrom = window.prompt('Start address (hex)', '0800');
    const psize = window.prompt('Size (hex)', '1000');
    if (pfrom != null && psize != null) {
      const from = parseInt(pfrom, 16);
      const size = parseInt(psize, 16);
      worker.postMessage({ type: 'READ_MEMORY', from, size });
    }
  };

  return (
    <div className={`${className} tec1-header`}>
      <div>
        <label htmlFor="file-upload">HEX</label>
        <input
          id="file-upload"
          type="file"
          accept=".hex"
          onChange={handleUpload}
        />
      </div>
      <div>
        <label htmlFor="rom-select">ROM</label>
        <select id="rom-select" value={rom} onChange={handleChangeROM}>
          <option value="">Select</option>
          {Object.keys(roms).map(key =>
            <option key={key}>{key}</option>)
          }
        </select>
      </div>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};
export const Header = styled(BaseHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3px;

  label {
    margin-right: 0.25em;
  }
`;
