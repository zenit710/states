/**
 * @param {State} firstState
 * @param {State} secondState
 * @param {Array} routes
 * @constructor
 */
var CartesianStateRow = function (firstState, secondState, routes) {
    this.CARTESIAN_CONNECTOR = '[x]';
    this.EXCEPTION_CODES = {
        ROUTE_NOT_FOUND: {
            code: 1,
            message: 'Outgoing route not found for one of states.'
        },
        INCOMPATIBLE_STATES: {
            code: 2,
            message: 'One of states would accept and another one would not.'
        }
    };
    this.firstState = firstState;
    this.secondState = secondState;
    this.routes = routes;
    this.key = this.generateKey(firstState, secondState);
    this.routeEffect = {};
};

/**
 * @param {State} firstState
 * @param {State} secondState
 * @returns {string}
 */
CartesianStateRow.prototype.generateKey = function (firstState, secondState) {
    return firstState.name + this.CARTESIAN_CONNECTOR + secondState.name;
};

/**
 * @returns {{}}
 */
CartesianStateRow.prototype.getRouteEffect = function () {
    for (var route in this.routes) {
        if (this.routes.hasOwnProperty(route)) {
            var newFirstState = this.firstState.getFirstRoute(this.routes[route]),
                newSecondState = this.secondState.getFirstRoute(this.routes[route]);

            if ((newFirstState === null && newSecondState !== null)
                || (newFirstState !== null && newSecondState === null)
            ) {
                console.log(newFirstState, newSecondState, this.secondState)
                throw this.EXCEPTION_CODES.ROUTE_NOT_FOUND;
            }

            if (newFirstState.isValid != newSecondState.isValid) {
                console.log(newFirstState, newSecondState, this.secondState)
                throw this.EXCEPTION_CODES.INCOMPATIBLE_STATES;
            }

            this.routeEffect[this.routes[route]] = {
                key: this.generateKey(newFirstState, newSecondState),
                newFirstState: newFirstState,
                newSecondState: newSecondState,
                bothValid: newFirstState.isValid && newSecondState.isValid
            }
        }
    }

    return this.routeEffect;
};