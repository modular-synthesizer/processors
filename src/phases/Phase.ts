import { EnvelopeProcessor } from "../processors/envelope";

export abstract class Phase {
  protected readonly processor: EnvelopeProcessor;

  protected readonly sampleRate: number = 48000;

  protected elapsed: number = -1;

  constructor(processor: EnvelopeProcessor, sampleRate: number = 48000) {
    this.processor = processor;
    this.sampleRate = sampleRate;
  }

  public get step(): number {
    this.elapsed += 1;
    return this.compute()
  }

  abstract compute(): number;

  public trigger(): void {
    this.elapsed = -1;
  }
}