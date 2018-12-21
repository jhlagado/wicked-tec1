let audioCtx;
let source1;
let active = false;

function init() {
    audioCtx = new AudioContext();
    if (source1) source1.stop();
    source1 = audioCtx.createOscillator();
    source1.type = 'square';
    source1.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
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

export function audioPlay() {
    if (!audioCtx) {
        init();
    }
    audioCtx.resume();
    active = true;
}

export function audioPause() {
    audioCtx.suspend();
    active = false;
}

export function audioToggle() {
    if (active)
        audioPause();
    else
        audioPlay();
}