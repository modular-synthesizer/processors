import type { IClonable } from "./interfaces/IClonable";
import type { ITriggerable } from "./interfaces/ITriggerable";

export enum State {
  DEFAULT = "DEFAULT",
  TRIGGERED = "TRIGGERED",
  RELEASED = "RELEASED"
}

export type Thresholds = {
  trigger: number,
  release: number,
}

export class Frame implements IClonable<Frame>, ITriggerable {
  public readonly value: number;
  public readonly thresholds: Thresholds;
  /** État du gate sur l'échantillon précédent. */
  public readonly previousGate: boolean;
  /** État du gate sur cet échantillon (hystérésis entre les deux seuils). */
  public readonly gate: boolean;

  public constructor(value: number, thresholds: Thresholds, previousGate = false) {
    this.value = value;
    this.thresholds = thresholds;
    this.previousGate = previousGate;
    this.gate = this.state === State.TRIGGERED ? true
              : this.state === State.RELEASED ? false
              : previousGate;
  }

  public get state(): State {
    if (this.value > this.thresholds.trigger) return State.TRIGGERED;
    if (this.value < this.thresholds.release) return State.RELEASED;
    return State.DEFAULT;
  }

  public get rising(): boolean {
    return this.gate && !this.previousGate;
  }

  public get falling(): boolean {
    return !this.gate && this.previousGate;
  }

  public clone(): Frame {
    return new Frame(this.value, this.thresholds, this.previousGate);
  }
}