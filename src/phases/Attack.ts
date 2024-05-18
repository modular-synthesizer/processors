import { log } from "../utils/functions/log";
import { Phase } from "./Phase";

export class Attack extends Phase {
  public get duration(): number {
    const attackTime: number =  this.processor.param('attack');
    return (this.sampleRate / 1000) * attackTime;
  }

  public compute(): number {
    if (this.elapsed === this.duration) {
      log("stop attack");
    }
    if (this.elapsed > this.duration) {
      return 0
    }
    log(this.elapsed / this.duration + "");
    return this.elapsed / this.duration;
  }
}