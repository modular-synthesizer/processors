import type { EnvelopeProcessor } from "../processors/envelope";

export abstract class Phase {
  protected readonly processor: EnvelopeProcessor;

  protected get sampleRate(): number {
    return this.processor.sampleRate;
  }

  protected elapsed = -1;

  constructor(processor: EnvelopeProcessor) {
    this.processor = processor;
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