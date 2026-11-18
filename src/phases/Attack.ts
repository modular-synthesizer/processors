import { frames } from "../utils/functions/framesComputations";
import { Decay } from "./Decay";
import { Phase } from "./Phase";
import Release from "./Release";

export class Attack extends Phase {
  public get duration(): number {
    return frames(this.processor.param('attack'), this.sampleRate);
  }

  public override compute(_index = 0): number {
    const progress = Math.min(this.elapsed / this.duration, 1);
    return this.from + (1 - this.from) * progress;
  }

  public checkState(): void {
    if (this.processor.falling) {
      this.processor.setPhase(new Release(this.processor, this.processor.from));
      return;
    }
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Decay(this.processor, this.processor.from));
    }
  }
}