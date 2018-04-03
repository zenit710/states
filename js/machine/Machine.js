/**
 * Creates new machine.
 * @param {State} startState
 * @constructor
 */
var Machine = function (startState) {
    this.states = [startState];
    this.names = [startState.name];
    this.startState = startState;
    this.currentState = startState;
};


/**
 * Add new state to the machine. State must have set routes before add.
 * @param {State} state
 */
Machine.prototype.addState = function (state) {
    if (typeof state === 'object' && state.constructor.name === 'State' && this.names.indexOf(state.name) == -1) {
        this.states.push(state);
        this.names.push(state.name);
    }
};

/**
 * Returns names of all routes used in the machine.
 * @returns {Array}
 */
Machine.prototype.getAllRouteNames = function () {
    var names = [];

    for (var state in this.states) {
        if (this.states.hasOwnProperty(state)) {
            names = names.concat(this.states[state].getAllRouteNames().filter(function (item) {
                return names.indexOf(item) < 0;
            }));
        }
    }

    return names;
};

/**
 * Check can word be accepted by the machine.
 * @param {string} series
 * @returns {boolean}
 */
Machine.prototype.check = function (series) {
    if (typeof series != 'string') {
        return false;
    }

    this.currentState = this.startState;

    var charArray = series.split('');

    for (var i = 0; i < charArray.length; i++) {
        if (this.currentState.hasRoute(charArray[i])) {
            this.currentState = this.currentState.getFirstRoute(charArray[i]);
        } else return false;
    }

    return this.currentState.isValid;
};

/**
 * Check are two machines do the same.
 * @param {Machine} machine
 * @returns {boolean}
 */
Machine.prototype.equals = function (machine) {
    if (typeof machine != 'object' || machine.constructor.name != 'Machine') {
        return false;
    }

    this.currentState = this.startState;

    var comparator = new MachineComparator(this, machine);

    return comparator.compare();
};

/**
 * Converts the machine to the deterministic one.
 */
Machine.prototype.toDeterministic = function () {
    this.currentState = this.startState;

    var determiner = new MachineDeterminer(this);

    return determiner.determine();
};

/**
 * Set current state of the machine.
 * @param {State} state
 */
Machine.prototype.setCurrentState = function (state) {
    if (this.names.indexOf(state.name) >= 0) {
        this.currentState = state;
    }
};

/**
 * Converts the machine to the string value.
 * @returns {string}
 */
Machine.prototype.toString = function () {
    var string = '';

    for (var state in this.states) {
        if (this.states.hasOwnProperty(state)) {
            string += this.states[state].toString() + '\n\n';
        }
    }

    return string;
};