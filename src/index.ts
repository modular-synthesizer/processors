import { EnvelopeProcessor } from "./processors/envelope";
import { PulseProcessor } from "./processors/pulse";
import { registerProcessor } from "./utils/types/webaudioapi";

registerProcessor("pulse", PulseProcessor);