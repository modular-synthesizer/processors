import type { AudioParamDescriptor } from "../utils/types/webaudioapi";

// @ts-ignore
export class BitcrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: 'reductionFactor',
        defaultValue: 1,
        minValue: 1,
        maxValue: 10e4,
        automationRate: 'k-rate'
      },
      {
        name: 'precision',
        defaultValue: 25,
        minValue: 3,
        maxValue: 1000,
        automationRate: 'k-rate'
      },
      {
        name: 'min',
        defaultValue: 10,
        minValue: 3,
        maxValue: 1000,
        automationRate: 'k-rate'
      },
      {
        name: 'max',
        defaultValue: 10,
        minValue: 3,
        maxValue: 1000,
        automationRate: 'k-rate'
      }
    ]
  }

  // The next frame where the value should be sampled and stored.
  nextTrigger = 0;
  // The current frame, to check if the value should be resampled or not.
  currentFrame = 0;
  // The value with which the output should be set
  value = 0;

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {

    if (inputs[0].length === 0) return true;

    for (let i = 0; i < 128; ++i) {
      // We should trigger the effect, so change the stored value.
      if (this.currentFrame >= this.nextTrigger) {
        this.value = this.clamp(inputs[0][0][i], parameters);
        this.nextTrigger += parameters.reductionFactor[0];
      }

      outputs[0][0][i] = this.value;
      this.currentFrame++;
    }
    return true;
  }

  clamp(value: number, parameters: Record<string, Float32Array>) {
    const min: number = parameters.min[0];
    const precision: number = parameters.precision[0];
    const max: number = parameters.max[0];
    
    const step = (max - min) / (precision - 1);
    return Math.round(value / step) * step;
}
}