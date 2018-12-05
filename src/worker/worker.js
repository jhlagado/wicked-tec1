import { Z80 } from './z80';
import { ROM } from './ROM';
import MemoryMap from 'nrf-intel-hex';

let running = false;
let active = true;
let yieldFlag = false;

const memory = Array(4000).fill(0xFF);
const inPorts = Array(256).fill(0xFF);
const outPorts = Array(256).fill(0xFF);

const cpu = Z80({
    mem_read: (addr) => memory[addr],
    mem_write: (addr, value) => memory[addr] = value,
    io_read: (port) => {
        yieldFlag = true;
        return inPorts[port & 0xFF];
    },
    io_write: (port, value) => {
        yieldFlag = true;
        outPorts[port & 0xFF] = value;
        updateDisplay();
        postOutPorts();
    },
});

const display = Array(6).fill(0);

self.onmessage = event => {
    if (event.data.type === 'INIT') {
        loadROM();
        cpu.reset();
        running = true;
        run();
    }
    if (event.data.type === 'PAUSE') {
        if (active) {
            active = false;
            running = false;
        }
        else {
            active = true;
            running = true;
            run();
        }
    }
    if (event.data.type === 'RESUME') {
    }
    else if (event.data.type === 'RESET') {
        console.log('resetting');
        cpu.reset();
        running = true;
        run();
    }
    else if (event.data.type === 'SET_INPUT_VALUE') {
        const { port, value } = event.data;
        inPorts[port] = value;
    }
    else if (event.data.type === 'NMI') {
        cpu.interrupt(true);
    }
    else if (event.data.type === 'HIDDEN') {
        let hidden = event.data.value;
        if (hidden) {
            running = false;
        }
        else if (active) {
            running = true;
            run();
        }
        else {
            console.log('not active');
        }
    }
};

let pending = false;
function run() {
    if (pending) return;
    for (let i = 0; i < 600 ; i++) {
        if (!running) return;
    // while (!yieldFlag) {
        cpu.run_instruction();
    }
    yieldFlag = false;
    if (running) {
        pending = true;
        setTimeout(function(){
            pending = false;
            run();
        }, 16)
    };
}

function updateDisplay() {
    const digits = outPorts[1];
    const segments = outPorts[2];
    let mask = 0x01;
    for (let i = 0; i < 6; i++) {
        if (digits & mask){
            display[i] = segments;
        }
        mask = mask << 1;
    }
}

function getPortsBuffer(){
    var buffer = new ArrayBuffer(4);
    var view = new Uint8Array(buffer);
    view[0] = outPorts[0];
    view[1] = outPorts[1];
    view[2] = outPorts[2];
    return buffer;
}

function getDisplayBuffer(){
    var buffer = new ArrayBuffer(6);
    var view = new Uint8Array(buffer);
    for (let i = 0; i < 6; i++) {
        view[i] = display[i];
    }
    return buffer;
}

function postOutPorts() {
    const buffer = getPortsBuffer();
    const display = getDisplayBuffer();
    self.postMessage({
        buffer, display
    }, [buffer, display]);
}

function loadROM() {
    const blocks = MemoryMap.fromHex(ROM);

    for (let address of blocks.keys()) {
      const block = blocks.get(address);
      for (let i = address; i < address + block.length; i++) {
        memory[i] = block[i];
      }
    }
  }
