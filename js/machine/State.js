/**
 * Creates new State.
 * @param {string} name
 * @param {boolean} [isValid] - can State accept the word
 * @constructor
 */
var State = function (name, isValid) {
    this.name = name;
    this.isValid = !!isValid;
    this.routes = {};
};

/**
 * Adds new route to the State.
 * @param {string} char
 * @param {State} state
 */
State.prototype.addRoute = function (char, state) {
    if (typeof state !== 'object' || state.constructor.name !== 'State' || typeof char !== 'string' || char.length !== 1) {
        return;
    }

    if (!this.routes.hasOwnProperty(char)) {
        this.routes[char] = [];
    }

    this.routes[char].push(state);
};

/**
 * Adds multiple routes to the machine.
 * @param {Array} chars
 * @param {State} state
 */
State.prototype.addRoutes = function (chars, state) {
    if (Array.isArray(chars)) {
        for (var i = 0; i < chars.length; i++)
            this.addRoute(chars[i], state);
    }
};

/**
 * Removes route from the State.
 * @param {string} char
 * @param {State} state
 */
State.prototype.removeRoute = function (char, state) {
    if (typeof state !== 'object' || state.constructor.name !== 'State' || typeof char !== 'string' || char.length !== 1) {
        return;
    }

    if (this.routes.hasOwnProperty(char)) {
        var index = this.routes[char].indexOf(state);

        if (index >= 0) {
            this.routes[char].slice(index, 1);
        }

        if (this.routes[char].length === 0) {
            delete this.routes[char];
        }
    }
};

/**
 * Check is the route defined in the State.
 * @param {string} char
 * @returns {boolean}
 */
State.prototype.hasRoute = function (char) {
    if (typeof char !== 'string' || char.length !== 1) {
        return false;
    }

    return this.routes.hasOwnProperty(char) && this.routes[char].length > 0;
};

State.prototype.hasAnyRoute = function () {
    return Object.keys(this.routes).length > 0;
};

/**
 * Returns first State from the route if set.
 * @param {string} char
 * @returns {State|null}
 */
State.prototype.getFirstRoute = function (char) {
    return this.hasRoute(char) ? this.routes[char][0] : null;
};

/**
 * Returns names of all routes used in the State.
 * @returns {Array}
 */
State.prototype.getAllRouteNames = function () {
    var names = [];

    for (var route in this.routes) {
        if (this.routes.hasOwnProperty(route)) {
            names.push(route);
        }
    }

    return names;
};

/**
 * Returns all States accessible from route.
 * @param {string} route
 * @returns {Array}
 */
State.prototype.getAllRouteStates = function (route) {
    var states = [];

    if (this.routes.hasOwnProperty(route)) {
        for (var i = 0; i < this.routes[route].length; i++) {
            states.push(this.routes[route][i]);
        }
    }

    return states;
};

/**
 * Check are two States equal.
 * @param {State} state
 */
State.prototype.equals = function (state) {

};

/**
 * Converts the State to the string value.
 * @returns {string}
 */
State.prototype.toString = function () {
    var string = '';

    for (var route in this.routes) {
        if (this.routes.hasOwnProperty(route)) {
            for (var i = 0; i < this.routes[route].length; i++) {
                string += this.name + ' ---' + route + '---> ' + this.routes[route][i].name + '\n';
            }
        }
    }

    if (string === '') {
        string = this.name;
    }

    return string;
};