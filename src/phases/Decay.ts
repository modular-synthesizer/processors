import { frames } from "../utils/functions/framesComputations";
import { State } from "../utils/frame";
import Sustain from "./Sustain";
import { Phase } from "./Phase";
import Release from "./Release";

export class Decay extends Phase {
  public get duration(): number {
    return frames(this.processor.param('decay'), this.sampleRate);
  }

  public get sustain(): number {
    return this.processor.param('sustain') / 100;
  }

  public override compute(_index = 0): number {
    const delta: number = this.sustain;
    const ratio = (1 - this.sustain) * ((this.duration - Math.min(this.elapsed, this.duration)) / this.duration);

    return delta + ratio;
  }

  public checkState(): void {
    if (this.processor.state === State.RELEASED) {
      this.processor.setPhase(new Release(this.processor, this.processor.from));
      return;
    }
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Sustain(this.processor, this.processor.from));
    }
  }
}