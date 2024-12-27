import { AudioParamDescriptor } from "../utils/types/webaudioapi"

enum SequencerMode {
  RANDOM, STANDARD
}

const modes = [
  SequencerMode.STANDARD,
  SequencerMode.RANDOM,
];

/**
 * The inputs of the processor are :
 * - [0] the clock port, each pulse sent here triggers the next step.
 * - [1] the reset port, send a pulse here to reset the internal clock.
 * - [2] the run port. When nothing is connected, the sequencer runs, if something is connected, the sequencer runs
 *       only if the connected noe emits a signal of 1, stops running if it doesn't.
 * The outputs of the processor are :
 * - [0-7] the outputs of the different steps of the sequencer
 * The parameters of the processor are :
 * - [steps] the number of steps before resetting the count.
 */
// @ts-ignore
export class SequencerProcessor extends AudioWorkletProcessor {

  private step: number = 0;

  public readonly port: MessagePort;

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const steps = parameters["steps"][0] - 1;

    for (let i = 0; i < 128; ++i) {
      const clockSignal = this.triggered(inputs, 0, 0, i);
      const resetSignal = this.triggered(inputs, 1, 0, i);
      // When nothing is connected to the third input, the run signal is considered ON.
      const runSignal = this.parse(inputs, 2, 0, i, 1);

      if (resetSignal) this.step = 0;

      if (clockSignal && runSignal === 1) {
        this.step = this.computeNextStep(parameters, i);
      }

      outputs[this.step][0][i] = runSignal;
    }
    return true;
  }

  computeNextStep(parameters: Record<string, Float32Array>, i: number) {
    const steps = parameters["mode"][0];
    const mode = modes[Math.round(parameters["mode"][0])];
    if (mode === SequencerMode.STANDARD) {
      return (this.step >= steps) ? 0 : (this.step + 1);
    }
    else if (mode === SequencerMode.RANDOM) {
      return Math.floor(Math.random() * steps);
    }
  }

  parse(inputs, position, channel, index, defaultValue = 0) {
    if (inputs.length <= position) return defaultValue;
    if (inputs[position].length <= channel) return defaultValue;
    return inputs[position][channel][index];
  }

  triggered(inputs, position, channel, index, defaultValue: number = 0) {
    return this.parse(inputs, position, channel, index, defaultValue) === 1
  }
  
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "steps",
        defaultValue: 8,
        minValue: 2,
        maxValue: 8,
        automationRate: "k-rate"
      },
      {
        name: 'mode',
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: 'k-rate'
      },
    ]
  }
}