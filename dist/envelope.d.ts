declare const MAX_THRESHOLD = 0.5;
declare const MIN_THRESHOLD: number;
declare function log(message: string): void;
declare enum State {
    DEFAULT = "DEFAULT",
    TRIGGERED = "TRIGGERED",
    RELEASED = "RELEASED"
}
declare class Frame {
    private _value;
    constructor(value: number);
    get state(): State;
    get value(): number;
}
type audioBuffer = Float32Array[][];
declare class EnvelopeProcessor extends AudioWorkletProcessor {
    private previous;
    process(inputs: audioBuffer, outputs: audioBuffer, _: any): boolean;
}
