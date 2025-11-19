import type { EnvelopeProcessor } from "../processors/envelope";

export abstract class Phase {
  protected readonly processor: EnvelopeProcessor;

  protected readonly sampleRate: number = 48000;

  protected elapsed = -1;

  constructor(processor: EnvelopeProcessor, sampleRate = 48000) {
    this.processor = processor;
    this.sampleRate = sampleRate;
  }

  public step(index = 0): number {
    this.elapsed += 1;
    const value: number = this.compute(index);
    this.checkState();
    return value;
  }

  abstract checkState(): void;

  abstract compute(index: number): number;
}