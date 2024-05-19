import { EnvelopeProcessor } from "../processors/envelope";
import { log } from "../utils/functions/log";
import { Attack } from "./Attack";
import { Phase } from "./Phase";

export default class NullPhase extends Phase {

  public constructor(processor: EnvelopeProcessor) {
    super(processor);
    log("Returning to null state");
  }

  compute(): number {
    return 0;
  }

  public checkState(): void {
    if (this.processor.justTriggered) {
      this.processor.setPhase(new Attack(this.processor, this.sampleRate));
    }
  }
}