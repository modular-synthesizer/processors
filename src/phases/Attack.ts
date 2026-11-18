import { frames } from "../utils/functions/framesComputations";
import { Decay } from "./Decay";
import { Phase } from "./Phase";

export class Attack extends Phase {
  public get duration(): number {
    return frames(this.processor.param('attack'), this.sampleRate);
  }

  public override compute(_index = 0): number {
    if (this.elapsed >= this.duration) return 0;
    return this.elapsed / this.duration;
  }

  public checkState(): void {
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Decay(this.processor));
    }
  }
}