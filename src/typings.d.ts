declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.svg';

declare module 'wicked-elements' {}

declare module 'nrf-intel-hex' {
    function fromHex(rom:string):Blocks;

    type Blocks = {
        keys(): number[];
        get(key:number): number[];
    }
}