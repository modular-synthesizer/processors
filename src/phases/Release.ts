import { State } from "../utils/frame";
import { Attack } from "./Attack";
import NullPhase from "./NullPhase";
import { Phase } from "./Phase";

export default class Release extends Phase {

  public get duration(): number {
    const releaseTime: number =  this.processor.param('release');
    return (this.sampleRate / 1000) * releaseTime;
  }

  checkState(): void {
    if (this.processor.state === State.TRIGGERED) {
      this.processor.setPhase(new Attack(this.processor, this.sampleRate))
    }
    else if (this.elapsed >= this.duration) {
      this.processor.setPhase(new NullPhase(this.processor));
    }
  }

  public get sustain(): number {
    return this.processor.param('sustain') / 100;
  }
  
  public override compute(_index: number = 0): number {
    return this.sustain * (1 - (this.elapsed / this.duration));
  }
  
}