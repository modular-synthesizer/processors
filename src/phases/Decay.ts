import { frames } from "../utils/functions/framesComputations";
import Sustain from "./Sustain";
import { Phase } from "./Phase";
import Release from "./Release";

export class Decay extends Phase {
  public get duration(): number {
    return frames(this.processor.param('decay'), this.sampleRate);
  }

  public override compute(index = 0): number {
    const target = this.sustainLevel(index);
    const progress = Math.min(this.elapsed / this.duration, 1);
    return 1 + (target - 1) * progress;
  }

  public checkState(): void {
    if (this.processor.falling) {
      this.processor.setPhase(new Release(this.processor, this.processor.from));
      return;
    }
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Sustain(this.processor, this.processor.from));
    }
  }
}