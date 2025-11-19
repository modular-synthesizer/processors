import { Decay } from "./Decay";
import { Phase } from "./Phase";

export class Attack extends Phase {
  public get duration(): number {
    const attackTime: number =  this.processor.param('attack');
    return (this.sampleRate / 1000) * attackTime;
  }

  public override compute(_index = 0): number {
    if (this.elapsed >= this.duration) return 0;
    return this.elapsed / this.duration;
  }

  public checkState(): void {
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Decay(this.processor, this.sampleRate));
    }
  }
}