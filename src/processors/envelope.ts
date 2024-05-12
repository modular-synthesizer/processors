import { Frame, State, Thresholds } from '../utils/frame';
import { AudioParamDescriptor } from '../utils/types/webaudioapi';

// @ts-ignore
export class EnvelopeProcessor extends AudioWorkletProcessor {
  
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "attack",
        defaultValue: 50,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      },
      {
        name: "decay",
        defaultValue: 50,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      },
      {
        name: "sustain",
        defaultValue: 70,
        minValue: 0,
        maxValue: 100,
        automationRate: "k-rate"
      },
      {
        name: "release",
        defaultValue: 50,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      }
    ]
  }

  public get thresolds(): Thresholds {
    return { trigger: 0.9, release: 0.1 }
  }

  private previous: Frame = new Frame(Number.MIN_VALUE, this.thresolds);

  process (inputs: Float32Array[][], outputs: Float32Array[][], _: any) {
    for (let i: number = 0; i < 128 ; ++i) {
      const current = new Frame(inputs[0][0][i], this.thresolds, this.previous);
      if (this.previous.state !== current.state) {
        if (current.state === State.TRIGGERED) {
          console.log("triggering")
        }
        else if (current.state === State.RELEASED) {
          console.log("releasing");
        }
      }
      this.previous = current;
    }
    return true;
  }
}
