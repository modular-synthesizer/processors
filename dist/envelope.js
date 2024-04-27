const MAX_THRESHOLD = 0.5;
const MIN_THRESHOLD = -MAX_THRESHOLD;
function log(message) {
    const dt = new Date();
    const formattedDate = `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`;
    console.log(`${formattedDate} ${message}`);
}
var State;
(function (State) {
    State["DEFAULT"] = "DEFAULT";
    State["TRIGGERED"] = "TRIGGERED";
    State["RELEASED"] = "RELEASED";
})(State || (State = {}));
class Frame {
    constructor(value) {
        this._value = value;
    }
    get state() {
        if (this._value > MAX_THRESHOLD)
            return State.TRIGGERED;
        if (this._value < MIN_THRESHOLD)
            return State.RELEASED;
        return State.DEFAULT;
    }
    get value() {
        return this._value;
    }
}
class EnvelopeProcessor extends AudioWorkletProcessor {
    constructor() {
        super(...arguments);
        this.previous = new Frame(Number.MIN_VALUE);
    }
    process(inputs, outputs, _) {
        for (let i = 0; i < 128; ++i) {
            const current = new Frame(inputs[0][0][i]);
            if (this.previous.state !== current.state && current.state !== State.DEFAULT) {
                log(`New state : ${current.state}`);
            }
            this.previous = current;
        }
        return true;
    }
}
registerProcessor("adsr", EnvelopeProcessor);
