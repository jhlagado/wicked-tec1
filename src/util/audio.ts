var AudioContext = (window as any).AudioContext // Default
    || (window as any).webkitAudioContext // Safari and old versions of Chrome
    || false;

let audioCtx: AudioContext;
let source1: OscillatorNode;
let active = false;

function init() {
    audioCtx = new AudioContext();
    if (source1) source1.stop();
    source1 = audioCtx.createOscillator();
    source1.type = 'square';
    source1.frequency.value = 0;
    source1.connect(audioCtx.destination);
    source1.start();
}

export function audioValue(value: number) {
    if (value != null && active) {
        source1.frequency.value = value;
    }
}

export function isAudioPlaying() {
    return active;
}

export function audioInit() {
    if (!audioCtx) {
        init();
    }
    active = true;
}

export function audioPlay(state: boolean) {
    if (!audioCtx) {
        init();
    }
    if (active === state) return;
    if (active) {
        audioCtx.suspend();
        active = false;
    }
    else {
        audioCtx.resume();
        active = true;
    }
}
