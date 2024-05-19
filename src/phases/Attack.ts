import { EnvelopeProcessor } from "../processors/envelope";
import { log } from "../utils/functions/log";
import { Decay } from "./Decay";
import { Phase } from "./Phase";

export class Attack extends Phase {

  public constructor(processor: EnvelopeProcessor, sampleRate: number) {
    super(processor, sampleRate);
    log("Creating the attack and triggering it");
  }
  
  public get duration(): number {
    const attackTime: number =  this.processor.param('attack');
    return (this.sampleRate / 1000) * attackTime;
  }

  public compute(): number {
    if (this.elapsed >= this.duration) return 0;
    return this.elapsed / this.duration;
  }

  public checkState(): void {
    if (this.elapsed >= this.duration) {
      this.processor.setPhase(new Decay(this.processor, this.sampleRate));
    }
  }
}