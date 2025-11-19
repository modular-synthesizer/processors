export interface AudioWorkletProcessor {
  readonly port: MessagePort;
}

export interface AudioWorkletProcessorImpl extends AudioWorkletProcessor {
  process(
      inputs: Float32Array[][],
      outputs: Float32Array[][],
      parameters: Record<string, Float32Array>
  ): boolean;
}

export declare const AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

export type AudioParamDescriptor = {
  name: string,
  automationRate: AutomationRate,
  minValue: number,
  maxValue: number,
  defaultValue: number
}

export interface AudioWorkletProcessorConstructor {
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessorImpl;
  parameterDescriptors?: AudioParamDescriptor[];
}

export declare function registerProcessor(
  name: string,
  processorCtor: AudioWorkletProcessorConstructor,
): void;