import { frames } from "../utils/functions/framesComputations";
import { State } from "../utils/frame";
import Sustain from "./Sustain";
import { Phase } from "./Phase";
import NullPhase from "./NullPhase";

export class Decay extends Phase {
  public get duration(): number {
    return frames(this.processor.param('decay'), this.sampleRate);
  }

  public get sustain(): number {
    return this.processor.param('sustain') / 100;
  }

  public override compute(_index = 0): number {
    if (this.elapsed >= this.duration) return 0;
    
    const delta: number = this.sustain;
    const ratio: number = (1 - this.sustain) * ((this.duration - this.elapsed) / this.duration);
    return delta + ratio;
  }

  public checkState(): void {
    if (this.elapsed >= this.duration) {
      if (this.processor.state === State.TRIGGERED) {
        this.processor.setPhase(new Sustain(this.processor));
      }
      else {
        this.processor.setPhase(new NullPhase(this.processor));
      }
    }
  }
}