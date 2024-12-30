import { State } from "../utils/frame";
import { Phase } from "./Phase";
import Release from "./Release"

export default class Sustain extends Phase {
  
  checkState(): void {
    if (this.processor.state === State.RELEASED) {
      this.processor.setPhase(new Release(this.processor, this.sampleRate));
    }
  }

  public override compute(index: number = 0): number {
    return this.processor.param("sustain", index) / 100;
  }

}