import NullPhase from '../phases/NullPhase';
import { Phase } from '../phases/Phase';
import { Frame, State, Thresholds } from '../utils/frame';
import { AudioParamDescriptor } from '../utils/types/webaudioapi';

// @ts-ignore
export class EnvelopeProcessor extends AudioWorkletProcessor {
  
  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "attack",
        defaultValue: 1000,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      },
      {
        name: "decay",
        defaultValue: 1000,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      },
      {
        name: "sustain",
        defaultValue: 50,
        minValue: 0,
        maxValue: 100,
        automationRate: "k-rate"
      },
      {
        name: "release",
        defaultValue: 1000,
        minValue: 1,
        maxValue: 10000,
        automationRate: "k-rate"
      }
    ]
  }

  public constructor(...args) {
    super(...args);
    this.phase = new NullPhase(this);
  }

  public get thresolds(): Thresholds {
    return { trigger: 0.9, release: 0.1 }
  }

  private current: Frame = new Frame(Number.MIN_VALUE, this.thresolds);

  private previous: Frame = new Frame(Number.MIN_VALUE, this.thresolds);

  private parameters: Record<string, Float32Array>;

  private _sampleRate: number = 48000;

  private phase: Phase;

  public param(name: string, index: number = 0): any {
    return this.parameters[name][index];
  }

  public get sampleRate(): number {
    return this._sampleRate;
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    // @ts-ignore
    this._sampleRate = sampleRate;
    this.parameters = parameters;
    for (let i: number = 0; i < 128 ; ++i) {
      this.current = new Frame(inputs[0][0][i], this.thresolds, this.previous);
      outputs[0][0][i] = this.phase.step;
      this.previous = this.current;
    }
    return true;
  }

  public get state(): State {
    return this.current.state;
  }

  public setPhase(phase: Phase | null) {
    this.phase = phase;
  }
}
