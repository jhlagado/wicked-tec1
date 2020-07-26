import MemoryMap from 'nrf-intel-hex';
import { throttle } from '../util/tools';
import { execute, reset, interrupt, init } from './z80';

const sixtyfourK = 0x10000;

let running = false;
const active = true;
let speed = 30;
let smooth = true;

let cycles = 0;
const memory = new Uint8Array(new ArrayBuffer(sixtyfourK)).fill(0xff);
const inPorts = Array(256).fill(0xff);
const outPorts = Array(256).fill(0xff);
const display = Array(6).fill(0);
let speaker = 1;
let wavelength = 0;

const cpu = init();

const postAllMemory = throttle(
  () => {
    const memMap = new MemoryMap();
    const bytes = new Uint8Array(memory);
    memMap.set(0, bytes);
    const hexString = memMap.asHexString();

    (self as any).postMessage({
      type: 'POST_ALL_MEMORY',
      memory: hexString,
    });
  },
  5 * 1000,
  true
);

const postDisplay = throttle(() => {
  const displayBuffer = new ArrayBuffer(6);
  const view = new Uint8Array(displayBuffer);
  for (let i = 0; i < 6; i++) {
    view[i] = display[i];
  }
  (self as any).postMessage(
    {
      type: 'POST_DISPLAY',
      display: displayBuffer,
    },
    [displayBuffer]
  );
}, 100);

function ioWrite(port: number, value: number) {
  const port1 = port & 0xff;
  outPorts[port1] = value;
  const digits = outPorts[1];
  const segments = outPorts[2];
  let mask = 0x01;
  for (let i = 0; i < 6; i++) {
    if (digits & mask) {
      display[i] = segments;
    }
    else if (!smooth) {
      display[i] = 0;
    }
    mask <<= 1;
  }
  let wavelengthChanged = false;
  if (port1 === 1) {
    const speaker1 = value >> 7;
    if (speaker1 === 1 && speaker === 0) {
      if (wavelength !== cycles) {
        wavelengthChanged = true;
      }
      wavelength = cycles;
      cycles = 0;
    }
    speaker = speaker1;
  }
  if (cycles > 10000) {
    if (wavelength !== 0) {
      wavelengthChanged = true;
    }
    wavelength = 0;
  }
  if (wavelengthChanged) {
    (self as any).postMessage(
      {
        type: 'POST_WAVELENGTH',
        wavelength,
      },
      []
    );
  }
  postDisplay();
}

const cb = {
  mem_read: (addr: number) => memory[addr],
  mem_write: (addr: number, value: number) => {
    const oldValue = memory[addr];
    memory[addr] = value;
    if (oldValue !== value) {
      postAllMemory();
    }
  },
  io_read: (port: number) => {
    return inPorts[port & 0xff];
  },
  io_write: ioWrite,
};

function* runGen() {
  while (true) {
    for (let i = 0; i < 1000; i++) {
      try {
        const count = execute(cpu, cb);
        cycles += count;
      } catch (e) {
        const pc = cpu.pc;
        const mem = memory[pc] || 0;
        console.error(
          `Illegal operation at ${pc.toString(16)}: ${mem.toString(16)}`
        );
        reset(cpu);
      }
    }
    yield cycles;
  }
}

let pending = false;
const iter = runGen();
function run() {
  if (pending) return;
  if (!running) return;
  iter.next();
  if (running) {
    pending = true;
    const delay = Math.floor((1 - Number(speed)) * 30);
    setTimeout(function () {
      pending = false;
      run();
    }, delay);
  }
}

const resetRun = (doReset: boolean) => {
  if (doReset) {
    reset(cpu);
  }
  running = true;
  run();
};

const doInit = () => {
  console.log('init');
};

const doReset = () => {
  resetRun(true);
};

const doSetInputValue = (event: any) => {
  const { port, value } = event.data;
  inPorts[port] = value;
};

const doSetKeyValue = (event: any) => {
  const { code, pressed } = event.data;
  inPorts[0] = code;
  const bit6 = 0b01000000;
  const bit6mask = ~bit6;
  inPorts[3] = (inPorts[3] & bit6mask) | (!pressed ? bit6 : 0);
};

const doSetSpeed = (event: any) => {
  speed = Number(event.data.value) / 100;
};

const doSetSmooth = (event: any) => {
  smooth = event.data.value === true;
};

const doNMI = () => {
  interrupt(cpu, cb, true, 0);
};

const doUpdateMemory = (event: any) => {
  console.log('memory updated');
  const rom = event.data.value;
  const blocks = MemoryMap.fromHex(rom);
  for (const address of blocks.keys()) {
    const block = blocks.get(address);
    for (let i = 0; i < block.length; i++) {
      memory[i + address] = block[i];
    }
  }
  resetRun(true);
};

const doReadMemory = (event: any) => {
  console.log('read memory');
  const from = event.data.from;
  const size = event.data.size;
  const buffer1 = new ArrayBuffer(size);
  const bytes = new Uint8Array(buffer1);
  for (let i = 0; i < size; i++) {
    bytes[i] = memory[i + from];
  }
  (self as any).postMessage(
    {
      type: 'POST_MEMORY',
      from,
      size,
      buffer: buffer1,
    },
    [buffer1]
  );
};

const doProcessHidden = (event: any) => {
  const hidden = event.data.value;
  if (hidden) {
    running = false;
  } else if (active) {
    resetRun(false);
  } else {
    console.log('not active');
  }
};

self.onmessage = (event: any) => {
  if (event.data.type === 'INIT') {
    doInit();
  } else if (event.data.type === 'RESET') {
    doReset();
  } else if (event.data.type === 'SET_INPUT_VALUE') {
    doSetInputValue(event);
  } else if (event.data.type === 'SET_KEY_VALUE') {
    doSetKeyValue(event);
  } else if (event.data.type === 'SET_SMOOTH') {
    doSetSmooth(event);
  } else if (event.data.type === 'SET_SPEED') {
    doSetSpeed(event);
  } else if (event.data.type === 'NMI') {
    doNMI();
  } else if (event.data.type === 'UPDATE_MEMORY') {
    doUpdateMemory(event);
  } else if (event.data.type === 'READ_MEMORY') {
    doReadMemory(event);
  } else if (event.data.type === 'HIDDEN') {
    doProcessHidden(event);
  }
};