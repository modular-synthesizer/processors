import { frames } from "../utils/functions/framesComputations";
import { Attack } from "./Attack";
import NullPhase from "./NullPhase";
import { Phase } from "./Phase";

export default class Release extends Phase {

  public get duration(): number {
    return frames(this.processor.param('release'), this.sampleRate);
  }

  checkState(): void {
    if (this.processor.rising) {
      this.processor.setPhase(new Attack(this.processor, this.processor.from))
    }
    else if (this.elapsed >= this.duration) {
      this.processor.setPhase(new NullPhase(this.processor, this.processor.from));
    }
  }
  
  public override compute(_index = 0): number {
    const progress = Math.min(this.elapsed / this.duration, 1);
    return this.from * (1 - progress);
  }
}