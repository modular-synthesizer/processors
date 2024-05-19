import { EnvelopeProcessor } from "../processors/envelope";
import { State } from "../utils/frame";
import { log } from "../utils/functions/log";
import { Phase } from "./Phase";
import Release from "./Release"

export default class Decay extends Phase {
  public constructor(processor: EnvelopeProcessor, sampleRate: number) {
    super(processor, sampleRate);
    log("Creating the sustain and triggering it");
  }
  checkState(): void {
    if (this.processor.state === State.RELEASED) {
      this.processor.setPhase(new Release(this.processor, this.sampleRate));
    }
  }
  compute(): number {
    return this.processor.param("sustain") / 100;
  }

}