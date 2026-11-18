import type { EnvelopeProcessor } from "../processors/envelope";

export abstract class Phase {
  protected readonly processor: EnvelopeProcessor;

  protected readonly from: number

  protected get sampleRate(): number {
    return this.processor.sampleRate;
  }

  protected elapsed = -1;

  constructor(processor: EnvelopeProcessor, from: number) {
    this.processor = processor;
    this.from = from
  }

  public step(index = 0): number {
    this.elapsed += 1;
    const value = this.compute(index);
    this.processor.setLastOutput(value);
    return value;
  }

  protected sustainLevel(index = 0): number {
    return this.processor.input * this.processor.param("sustain", index) / 100;
  }

  abstract checkState(): void;

  abstract compute(index: number): number;
}