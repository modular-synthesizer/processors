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
class SequencerProcessor extends AudioWorkletProcessor {

  step = 0;

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const steps = parameters["steps"][0] - 1;

    for (let i = 0; i < 128; ++i) {
      const clockSignal = this.triggered(inputs, 0, 0, i);
      const resetSignal = this.triggered(inputs, 1, 0, i);
      // When nothing is connected to the third input, the run signal is considered ON.
      const runSignal = this.parse(inputs, 2, 0, i, 1);

      if (resetSignal) this.step = 0;

      if (clockSignal && runSignal === 1) {
        this.step = (this.step >= steps) ? 0 : (this.step + 1);
      }

      outputs[this.step][0][i] = runSignal;
    }
    return true;
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
      }
    ]
  }
}

registerProcessor("sequencer", SequencerProcessor);