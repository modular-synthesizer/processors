import NullPhase from '../phases/NullPhase';
import type { Phase } from '../phases/Phase';
import { Frame, type Thresholds } from '../utils/frame';
import type { ITriggerable } from '../utils/interfaces/ITriggerable';
import type { AudioParamDescriptor } from '../utils/types/webaudioapi';

// @ts-ignore
export class EnvelopeProcessor extends AudioWorkletProcessor implements ITriggerable {
  
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
        automationRate: "a-rate"
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
    this.phase = new NullPhase(this, 0);
    // @ts-ignore
    this._sampleRate = sampleRate;
  }

  public get thresolds(): Thresholds {
    return { trigger: 0.9, release: 0.1 }
  }

  private current: Frame = new Frame(Number.MIN_VALUE, this.thresolds);

  private lastOutput: number = 0;

  private parameters: Record<string, Float32Array>;

  private readonly _sampleRate: number;

  private phase: Phase;

  public param(name: string, index = 0) {
    const values = this.parameters[name];
    return values.length > 1 ? values[index] : values[0];
  }

  public get sampleRate(): number {
    return this._sampleRate;
  }

  public setLastOutput(value: number) {
    this.lastOutput = value
  }

  public get from(): number {
    return this.lastOutput
  }

  public get input(): number {
    return this.current.value;
  }

  process (inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    this.parameters = parameters;

    if (inputs[0].length === 0) return true;
    for (let i = 0; i < 128 ; ++i) {
      this.current = new Frame(inputs[0][0][i], this.thresolds, this.current.gate);
      this.phase.checkState();
      outputs[0][0][i] = this.phase.step(i);
    }
    return true;
  }

  public setPhase(phase: Phase | null) {
    this.phase = phase;
  }

  public get gate(): boolean { return this.current.gate; }

  public get rising(): boolean { return this.current.rising; }
  
  public get falling(): boolean { return this.current.falling; }
}
