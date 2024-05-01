import { log } from '../utils/functions/log'

const MAX_THRESHOLD = 0.5
const MIN_THRESHOLD = - MAX_THRESHOLD

enum State {
  DEFAULT = "DEFAULT",
  TRIGGERED = "TRIGGERED",
  RELEASED = "RELEASED"
}

class Frame {

  private _value: number;

  constructor(value: number) {
    this._value = value;
  }
  
  public get state(): State {
    if (this._value > MAX_THRESHOLD) return State.TRIGGERED;
    if (this._value < MIN_THRESHOLD) return State.RELEASED;
    return State.DEFAULT;
  }

  public get value(): number {
    return this._value;
  }
}

// @ts-ignore
export class EnvelopeProcessor extends AudioWorkletProcessor {

  private previous: Frame = new Frame(Number.MIN_VALUE);

  process (inputs: Float32Array[][], outputs: Float32Array[][], _: any) {
    for (let i: number = 0; i < 128 ; ++i) {
      const current = new Frame(inputs[0][0][i]);
      if (this.previous.state !== current.state && current.state !== State.DEFAULT) {
        log(`New state : ${current.state}`)
      }
      this.previous = current;
    }
    return true;
  }
}
