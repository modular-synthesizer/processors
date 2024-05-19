import { IClonable } from "./interfaces/IClonable";

interface ITriggerable {
  get triggered(): boolean;
  get released(): boolean;
}

export enum State {
  DEFAULT = "DEFAULT",
  TRIGGERED = "TRIGGERED",
  RELEASED = "RELEASED"
}

export type Thresholds = {
  trigger: number,
  release: number,
}

export class Frame implements IClonable<Frame> {
  public readonly thresholds: Thresholds;

  public readonly value: number;

  public constructor(value: number, thresholds: Thresholds, previous?: Frame) {
    this.value = value;
    this.thresholds = thresholds;
  }
  
  public get state(): State {
    if (this.value > this.thresholds.trigger) return State.TRIGGERED;
    if (this.value < this.thresholds.release) return State.RELEASED;
    return State.DEFAULT;
  }

  public clone(): Frame {
    return new Frame(this.value, this.thresholds);
  }
}