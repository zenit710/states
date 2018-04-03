/**
 * Creates new MachineComparator.
 * @param {Machine} machine1
 * @param {Machine} machine2
 * @constructor
 */
var MachineComparator = function (machine1, machine2) {
    this.machine1 = machine1;
    this.machine2 = machine2;
    this.matrix = {};
    this.routeNames = [];
};

/**
 * Checks are two machines equal.
 * @returns {boolean}
 */
MachineComparator.prototype.compare = function () {
    return this.routesCompatible() && this.deepComparisonSuccess();
};

/**
 * Checks are two machines work on same routes.
 * @returns {boolean}
 */
MachineComparator.prototype.routesCompatible = function () {
    this.routeNames = this.machine1.getAllRouteNames().sort();

    return this.machine2.getAllRouteNames().sort().compare(this.routeNames);
};


/**
 * Checks are two machines do the same.
 * @returns {boolean}
 */
MachineComparator.prototype.deepComparisonSuccess = function () {
    var success = true;

    try {
        this.generateMatrix();
    } catch (err) {
        console.error(err);
        success = false;
    }

    return success;
};

/**
 * Generete matrix of moves possible in two machines.
 */
MachineComparator.prototype.generateMatrix = function () {
    var row = new CartesianStateRow(this.machine1.currentState, this.machine2.currentState, this.routeNames);

    if (!this.matrix.hasOwnProperty(row.key)) {
        var routes = this.matrix[row.key] = row.getRouteEffect();

        for (var route in routes) {
            if (routes.hasOwnProperty(route)) {
                this.machine1.setCurrentState(routes[route].newFirstState);
                this.machine2.setCurrentState(routes[route].newSecondState);

                this.generateMatrix();
            }
        }
    }
};