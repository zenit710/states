/**
 * Creates new MachineDeterminer.
 * @param {Machine} machine
 * @constructor
 */
var MachineDeterminer = function (machine) {
    this.machine = machine;
    this.matrix = {};
    this.routeNames = machine.getAllRouteNames();
    this.CONNECTOR = '[x]';
};

/**
 * Converts the Machine to the deterministic one.
 * @returns {Machine}
 */
MachineDeterminer.prototype.determine = function () {
    this.generateMatrix();

    return this.createMachineFromMatrix();
};

/**
 * Generate matrix of all possible movements in the machine.
 */
MachineDeterminer.prototype.generateMatrix = function () {
    var key = this.machine.currentState.name;

    this.generateMatrixRow(key, [this.machine.currentState], this.machine.currentState.isValid, true);
};

/**
 * Generate matrix row
 * @param {string} key
 * @param {Array} states
 * @param {boolean} isValid
 * @param {boolean} [isFirst]
 */
MachineDeterminer.prototype.generateMatrixRow = function (key, states, isValid, isFirst) {
    var nextStates,
        routes = {};

    if (!this.matrix.hasOwnProperty(key)) {
        this.matrix[key] = {
            routes: {},
            valid: isValid,
            first: !!isFirst
        };

        for (var i = 0; i < this.routeNames.length; i++) {
            nextStates = this.getStatesFromRoute(states, this.routeNames[i]);

            if (nextStates.length) {
                routes[this.routeNames[i]] = this.generateCell(nextStates);
            }
        }

        this.matrix[key]['routes'] = routes;

        for (var route in routes) {
            if (routes.hasOwnProperty(route)) {
                this.generateMatrixRow(routes[route].key, routes[route].states, routes[route].valid);
            }
        }
    }
};

/**
 * Returns all states used in route
 * @param {Array} states
 * @param {string} route
 * @returns {Array}
 */
MachineDeterminer.prototype.getStatesFromRoute = function (states, route) {
    var nextStates = [];

    for (var i = 0; i < states.length; i++) {
        var routeStates = states[i].getAllRouteStates(route).filter(function (item) {
            return nextStates.indexOf(item) == -1;
        });

        for (var j = 0; j < routeStates.length; j++) {
            nextStates.push(routeStates[j]);
        }
    }

    return nextStates;
};

/**
 * Generates cell in matrix
 * @param {Array} states
 * @returns {{states: Array, key: string, valid: boolean}}
 */
MachineDeterminer.prototype.generateCell = function (states) {
    var nextKey = '',
        valid = false;

    for (var i = 0; i < states.length; i++) {
        nextKey += states[i].name + this.CONNECTOR;

        if (states[i].isValid) valid = true;
    }

    return {
        states: states,
        key: nextKey.substr(0, nextKey.lastIndexOf(this.CONNECTOR)),
        valid: valid
    };
};

MachineDeterminer.prototype.createMachineFromMatrix = function () {
    var states = {},
        firstState,
        state,
        machine;

    // create all the states
    for (state in this.matrix) {
        if (this.matrix.hasOwnProperty(state)) {
            states[state] = new State(state, this.matrix[state].valid);

            if (this.matrix[state].first) {
                firstState = states[state];
            }
        }
    }

    machine = new Machine(firstState);

    // set routes for states
    for (state in this.matrix) {
        if (this.matrix.hasOwnProperty(state)) {
            var routes = this.matrix[state].routes;

            for (var route in routes) {
                if (routes.hasOwnProperty(route)) {
                    states[state].addRoute(route, states[routes[route].key]);
                }
            }
        }
    }

    // add states to the machine
    for (state in states) {
        if (states.hasOwnProperty(state)) {
            machine.addState(states[state]);
        }
    }

    return machine;
};