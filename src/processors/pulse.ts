/**
 * The outputs of the processor are :
 * - [0] the main output for the pulses triggered by the user.
 * The events of the processor are :
 * - [pulse] to trigger a pulse.
 */
// @ts-ignore
export class PulseProcessor extends AudioWorkletProcessor {
  nextValue = 0;

  public readonly port: MessagePort;

  constructor(...args) {
    super(...args);
    this.port.onmessage = ({ data }) => {
      if (data === "pulse") this.nextValue = 1;
    }
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    for (let i = 0; i < outputs[0][0].length; ++i) {
      outputs[0][0][i] = this.nextValue;
      this.nextValue = 0;
    }

    return true;
  }
}