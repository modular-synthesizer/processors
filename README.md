## Custom processors

This repository holds the logic for all the custom audio processors used by Synple. Even if it has been created to satisfy some needs for Synple, you _SHOULD_ be able to use it in any web audio API related application. Support for any application outside of Synple is __NOT__ guaranteed.

Several new processors have been created :
* the `bitcrusher` processor is a simple bitcrusher that lowers the quality of the audio signal.
* the `clock` processor gives access to a simple clock that can be synchronized and reset from the outside.
* the `envelope` processor is a simple ADSR (Attack, Decay, Sustain, Release) envelope allowing the manipulation of the signal.
* the `gate` processor converts a single trigger signal into a gate continuous signal.
* the `pulse` processor emits a single sample at a value when triggered
* the `sequencer`processor is a 8-steps processor with clock, reset, randomizer, and a selectable number of steps.