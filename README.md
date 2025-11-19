## Custom processors

This repository holds the logic for all the custom audio processors used by Synple. Even if it has been created to satisfy some needs for Synple, you _SHOULD_ be able to use it in any web audio API related application. Support for any application outside of Synple is __NOT__ guaranteed.

Several new processors have been created :
* the `bitcrusher` processor is a simple bitcrusher that lowers the quality of the audio signal.
* the `clock` processor gives access to a simple clock that can be synchronized and reset from the outside.
* the `envelope` processor is a simple ADSR (Attack, Decay, Sustain, Release) envelope allowing the manipulation of the signal.
* the `gate` processor converts a single trigger signal into a gate continuous signal.
* the `pulse` processor emits a single sample at a value when triggered
* the `sequencer`processor is a 8-steps processor with clock, reset, randomizer, and a selectable number of steps.

## Description of the processors

### Bitcrusher

A bitcrusher is an audio node that receives a signal as input, and lowers the sound quality of it. It generally can do this in two different ways : reducing the possible precision of the sample values, or merging samples. In Synple, we implemented both of them at the same time.

There are several available parameters :
* `max` is the maximum value that the signal can have at any given sample.
* `min` is the minimum possible value for any given sample.
* `precision` the precision you wan apply to a number. It is the number of possible values between `min` and `max`.
* `reductionFactor` is a number representing the number of samples you will merge with one another.

There is only one input (at index 0) and one output (at index 0). They respectively represent the input and the output of the audio signal.

### Clock

The clock generates impulse at a regular rate. The rate is given by the frequency parameter. Impulses are just one sample long, and sends a one instead of the usual 0 the node outputs the rest of the time.

There is only one parameter available :
* `frequency` the frequency, in "triggers per seconds" (eg: 2 equals two clock triggers per second)

There is only one output (at index 0) that will output zero (0) all the time, except on trigger samples, when it will output one (1).