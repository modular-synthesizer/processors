import { EnvelopeProcessor } from "../processors/envelope";
import { State } from "../utils/frame";
import { log } from "../utils/functions/log";
import NullPhase from "./NullPhase";
import Sustain from "./Sustain";
import { Phase } from "./Phase";

export class Decay extends Phase {

  public constructor(processor: EnvelopeProcessor, sampleRate: number) {
    super(processor, sampleRate);
    log("Creating the decay and triggering it");
  }

  public get duration(): number {
    const decayTime: number =  this.processor.param('decay');
    return (this.sampleRate / 1000) * decayTime;
  }

  public get sustain(): number {
    if (this.processor.state === State.TRIGGERED) this.processor.param('sustain') / 100;
    return 0;
  }

  public compute(): number {
    if (this.elapsed >= this.duration) return 0;
    
    const delta: number = 1 - this.sustain;
    const ratio: number = - this.elapsed / this.duration;

    return delta + ratio;
  }

  public checkState(): void {
    if (this.elapsed >= this.duration) {
      if (this.processor.state === State.TRIGGERED) {
        this.processor.setPhase(new Sustain(this.processor, this.sampleRate));
      }
      else {
        this.processor.setPhase(new NullPhase(this.processor));
      }
    }
  }
}