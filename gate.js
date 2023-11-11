const THRESHOLD = 0.9;

const MAX_SAMPLES = 128;

let triggered = false;

class GateProcessor extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {
        name: "duration",
        defaultValue: 250,
        minValue: 5,
        maxValue: 10000,
        automationRate: "k-rate"
      }
    ]
  }

  // The number of frames since the last trigger.
  ellapsedFrames = 0
  // The current status of the gate. TRUE if it's being triggered, FALSE otherwise.
  triggered = false;

  displayed = false;

  get ellapsedTime() {
    return (this.ellapsedFrames / sampleRate) * 1000;
  }

  fillChannels(output, value) {
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = value;
      }
    });
  }

  neededFrames(duration) {
    return sampleRate * (duration / 1000);
  }

  get time() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  }

  /**
   * Finds the first index of a value above the defined threshold. If no value is found, returns -1 as it is
   * supposed to not be a valid index. This index will indicate where the gate should start in the output, so
   * that it is precise even with very low values.
   */
  findIndex(channels) {
    for (let i = 0; i < 128; ++i) {
      for(let channel of channels) {
        if (channel[i] > THRESHOLD) return i;
      }
    }
    return -1;
  }

  process (inputs, outputs, parameters) {
    // We just look at the first port of the trigger-to-gate node.
    const input = inputs[0];

    const duration = parameters["duration"][0];

    let firstIndex = input[0]?.indexOf(1)

    const frames = this.neededFrames(duration);

    // If a threshold value is found and the gate has not yet been triggered.
    if (firstIndex > -1 && !this.triggered) {
      const arr = new Array(...input[0]);
      this.triggered = true;
      console.log(this.time, "triggered", firstIndex, arr.lastIndexOf(1));
    }

    if (!this.triggered) return true;

    const diff = Math.min(frames - this.ellapsedFrames, 128);

    // The gate is currently triggered so we just put every frame to one. If the number of frames left
    // Is above the duration in frames, then we just complete the needed frames and then zeros.
    
    outputs[0].forEach((channel) => {
      for (let j = 0; j < diff; j++) {
        channel[j] = this.triggered ? 1 : 0;
      }
    });

    this.ellapsedFrames += diff;

    if (this.ellapsedFrames < frames) return true;

    // console.log(this.time, "released", frames, this.ellapsedFrames, diff);
    this.ellapsedFrames = 0;
    this.triggered = false;
    return true;
  }
}

registerProcessor("gate-processor", GateProcessor);