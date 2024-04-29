import { AudioWorkletProcessor, registerProcessor, AudioParamDescriptor } from "../utils/types/webaudioapi"

const DEFAULT_FREQUENCY = 2;

/**
 * The inputs of the processor are :
 * - [0] the reset port, send a pulse here to reset the internal clock.
 * The outputs of the processor are :
 * - [0] the clock at the frequency indicated by the user
 * - [1] a clock with a frequency halved from the 0 port
 * - [2] a clock with a frequency divided by four from the 0 port
 * The parameters of the processor are :
 * - [frequency] the number of impulses the clock will have per seconds.
 */
class ClockProcessor extends AudioWorkletProcessor {
  
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "frequency",
        defaultValue: DEFAULT_FREQUENCY,
        minValue: 0.01,
        maxValue: 10000,
        automationRate: 'a-rate'
      }
    ]
  }

  private lastPulse: number;
  private currentFrame: number;
  private frequency: number;
  private sampleRate: number;

  constructor(...args) {
    super(...args);
    this.lastPulse = 0;
    this.currentFrame = 0;  
    this.frequency = DEFAULT_FREQUENCY;
    this.sampleRate = 48000;
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    // @ts-ignore
    this.sampleRate = sampleRate;

    for (let i = 0; i < outputs[0][0].length; ++i) {
      if (this.triggered(inputs, 0, 0, i)) {
        this.currentFrame = 0;
        this.lastPulse = 0;
      }

      this.frequency = parameters["frequency"][0];
      outputs[0][0][i] = this.value;
      this.currentFrame += 1;
    }

    return true;
  }

  triggered(inputs, position, channel, index) {
    if (inputs.length <= position) return false;
    if (inputs[position].length <= channel) return false;
    return inputs[position][channel][index] === 1;
  }

  get value() {
    const nextPulse = this.lastPulse + (this.sampleRate / this.frequency);
    if (this.currentFrame >= nextPulse) {
      this.lastPulse = nextPulse;
      return 1;
    }
    return 0;
  }
}

registerProcessor("clock", ClockProcessor);