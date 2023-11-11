/**
 * The inputs of the processor are :
 * - [0] the clock port, each pulse sent here triggers the next step.
 * - [1] the reset port, send a pulse here to reset the internal clock.
 * The outputs of the processor are :
 * - [0-7] the outputs of the different steps of the sequencer
 */
class SequencerProcessor extends AudioWorkletProcessor {

  step = 0;

  triggering = false;

  process(inputs, outputs, _parameters) {
    for (let i = 0; i < 128; ++i) {
      if (this.triggered(inputs, 1, 0, i)) {
        this.triggering = true;
        this.step = 0;
      }
      else {
        this.triggering = false;
      }
      outputs[this.step][0][i] = 1;
      if (this.triggered(inputs, 0, 0, i)) {
        this.step = (this.step === 7) ? 0 : (this.step + 1);
      }
    }
    return true;
  }

  triggered(inputs, position, channel, index) {
    if (inputs.length <= position) return false;
    if (inputs[position].length <= channel) return false;
    return inputs[position][channel][index] === 1;
  }
}

registerProcessor("sequencer", SequencerProcessor);