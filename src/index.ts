import { ClockProcessor } from "./processors/clock";
import { EnvelopeProcessor } from "./processors/envelope";
import { GateProcessor } from "./processors/gate";
import { PulseProcessor } from "./processors/pulse";
import { SequencerProcessor } from "./processors/sequencer";

const processors = {
  pulse: PulseProcessor,
  clock: ClockProcessor,
  sequencer: SequencerProcessor,
  adsr: EnvelopeProcessor,
  trig2gate: GateProcessor
}

for(let k in processors) {
  // @ts-ignore
  registerProcessor(k, processors[k]);
}