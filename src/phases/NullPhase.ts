import { State } from "../utils/frame";
import { Attack } from "./Attack";
import { Phase } from "./Phase";

export default class NullPhase extends Phase {

  public override compute(_index = 0): number {
    return 0;
  }

  public checkState(): void {
    if (this.processor.state === State.TRIGGERED) {
      this.processor.setPhase(new Attack(this.processor, this.sampleRate));
    }
  }
}