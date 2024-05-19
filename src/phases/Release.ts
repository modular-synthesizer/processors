import { EnvelopeProcessor } from "../processors/envelope";
import { State } from "../utils/frame";
import { log } from "../utils/functions/log";
import { Attack } from "./Attack";
import NullPhase from "./NullPhase";
import { Phase } from "./Phase";

export default class Release extends Phase {

  public constructor(processor: EnvelopeProcessor, sampleRate: number) {
    super(processor, sampleRate);
    log("Creating the release and triggering it");
  }

  public get duration(): number {
    const releaseTime: number =  this.processor.param('release');
    return (this.sampleRate / 1000) * releaseTime;
  }

  checkState(): void {
    if (this.processor.justTriggered) {
      this.processor.setPhase(new Attack(this.processor, this.sampleRate))
    }
    else if (this.elapsed >= this.duration) {
      this.processor.setPhase(new NullPhase(this.processor));
    }
  }

  public get sustain(): number {
    if (this.processor.state === State.TRIGGERED) this.processor.param('sustain') / 100;
    return 0;
  }
  
  compute(): number {
    return this.sustain * (1 - (this.elapsed / this.duration));
  }
  
}