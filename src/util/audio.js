var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false;

let audioCtx;
let source1;
let active = false;

function init() {
    audioCtx = new AudioContext();
    if (source1) source1.stop();
    source1 = audioCtx.createOscillator();
    source1.type = 'square';
    source1.frequency.value = 440;
    source1.connect(audioCtx.destination);
    source1.start();
}

export function audioValue(value) {
    if (value != null && active) {
        source1.frequency.setValueAtTime(value, audioCtx.currentTime);
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

export function audioPlay(state) {
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

export function audioToggle() {
    if (active)
        audioPause();
    else
        audioPlay();
}