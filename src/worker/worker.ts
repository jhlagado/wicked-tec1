
import { Z80 } from './z80';
// @ts-ignore: Module '"nrf-intel-hex"' has no default export
import MemoryMap from 'nrf-intel-hex';

let running = false;
let active = true;
let speed = 30;

let cycles = 0;
const buffer = new ArrayBuffer(0xFFFF)
const memory = new Uint8Array(buffer).fill(0xFF);
const inPorts = Array(256).fill(0xFF);
const outPorts = Array(256).fill(0xFF);

const cpu = Z80({
    mem_read: (addr:number) => memory[addr],
    mem_write: (addr:number, value:number) => memory[addr] = value,
    io_read: (port:number) => {
        return inPorts[port & 0xFF];
    },
    io_write: (port:number, value:number) => {
        const port1 = port & 0xFF;
        outPorts[port1] = value;
        updateDisplay();
        postOutPorts(port1, value);
    },
});


const display = Array(6).fill(0);

self.onmessage = event => {
    if (event.data.type === 'INIT') {
        // updateMemory(ROM);
        cpu.reset();
        running = true;
        run();
    }
    else if (event.data.type === 'PAUSE') {
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
    else if (event.data.type === 'RESUME') {
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
    else if (event.data.type === 'SET_KEY_VALUE') {
        const { code, pressed } = event.data;
        inPorts[0] = code;
        const bit6 = 0b01000000;
        const bit6mask = ~bit6;
        inPorts[3] = inPorts[3] & bit6mask | (!pressed ? bit6 : 0);
    }
    else if (event.data.type === 'SET_SPEED') {
        speed = Number(event.data.value)/100;
        console.log('set speed', speed);
    }
    else if (event.data.type === 'NMI') {
        cpu.interrupt(true, 0);
    }
    else if (event.data.type === 'UPDATE_MEMORY') {
        updateMemory(event.data.value);
        cpu.reset();
    }
    else if (event.data.type === 'READ_MEMORY') {
        readMemory(event.data.from, event.data.size);
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

function* runGen () {
    while (true){
        for (let i = 0; i < 1000; i++) {
            try {
                const count = cpu.run_instruction();
                cycles += count;
            }
            catch(e) {
                const pc = cpu.getPC();
                const mem = memory[cpu.getPC()] || 0;
                    console.log(`Illegal operation at ${
                    pc.toString(16)}: ${mem.toString(16)
                }`);
                cpu.reset();
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
    const delay = Math.floor((1 - Number(speed)) * 30);
    if (running) {
        pending = true;
        setTimeout(function(){
            pending = false;
            run();
        }, delay)
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

let speaker = 1;
let wavelength = 0;
function postOutPorts(port:number, value:number) {
    const buffer = getPortsBuffer();
    const display = getDisplayBuffer();

    if (port === 1) {
        const speaker1 = value >> 7;
        if (speaker1 === 1 && speaker === 0) {
            wavelength = cycles;
            cycles = 0;
        }
        speaker = speaker1;
    }
    if (cycles > 10000) wavelength = 0;

    self.postMessage({
        type: 'POST_OUTPORTS',
        buffer,
        display,
        speaker,
        wavelength,
        pc: cpu.getPC(),
    // @ts-ignore: Type 'ArrayBuffer' is not assignable to type 'string' bug in type definition
    }, [buffer, display]);
}

function updateMemory(rom:string) {
    const blocks = MemoryMap.fromHex(rom);
    for (let address of blocks.keys()) {
        const block = blocks.get(address);
        for (let i = 0; i < block.length; i++) {
            memory[i + address] = block[i];
        }
    }
}

function readMemory(from:number, size:number) {
    let buffer = new ArrayBuffer(size);
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < size; i++) {
        bytes[i] = memory[i + from]
    }
    self.postMessage({
        type: 'POST_MEMORY',
        from,
        size,
        buffer,
    // @ts-ignore: Type 'ArrayBuffer' is not assignable to type 'string' bug in type definition
    }, [buffer]);
}
