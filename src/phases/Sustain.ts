import { Phase } from "./Phase";
import Release from "./Release"

export default class Sustain extends Phase {
  
  checkState(): void {
    if (this.processor.falling) {
      this.processor.setPhase(new Release(this.processor, this.processor.from));
    }
  }

  public override compute(index = 0): number {
    return this.sustainLevel(index)
  }

}