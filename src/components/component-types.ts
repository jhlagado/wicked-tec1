interface CPUMessage {
    buffer: Iterable<number>;
    display: Iterable<number>;
    wavelength: any;
}


interface KeyEvent {
    code: any;
    shiftKey: any;
    ctrlKey: any;
    preventDefault: () => void;
    key: any;
}

