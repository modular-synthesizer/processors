import { AudioWorkletProcessor, registerProcessor, AudioParamDescriptor } from "../utils/types/webaudioapi"

class GateProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "duration",
        defaultValue: 1500,
        minValue: 5,
        maxValue: 10000,
        automationRate: "k-rate"
      }
    ]
  }

  // The duration of the gate in FRAMES depending on the parameter in ms.
  duration = 0;

  currentFrame = 0;

  lastTrigger = 0;

  process (inputs, outputs, parameters) {
    // @ts-ignore
    this.duration = sampleRate / 1000 * parameters["duration"][0];

    for (let i = 0; i < 128; ++i) {

      if (this.opened) {
        outputs[0][0][i] = 1;
      }
      else if (this.triggered(inputs, 0, 0, i)) {
        this.lastTrigger = this.currentFrame;
      }
  
      this.currentFrame += 1
    }

    return true;
  }

  // Indicates that the gate is currently OPENED (between a trigger and a release).
  get opened() {
    return (this.lastTrigger + this.duration) > this.currentFrame;
  }

  triggered(inputs, position, channel, index) {
    if (inputs.length <= position) return false;
    if (inputs[position].length <= channel) return false;
    return inputs[position][channel][index] === 1;
  }
}

registerProcessor("trig2gate", GateProcessor);