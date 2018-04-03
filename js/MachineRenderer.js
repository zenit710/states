var MachineRenderer = function (container, machine) {
    this.container = container;
    this.machine = machine;
    this.states = [];
    this.statesCount = 0;
    this.stateIds = {};
    this.routes = [];
};

MachineRenderer.prototype.render = function () {
    console.log(this.machine.states)

    this.getStates();
    this.getRoutes();

    var nodes = new vis.DataSet(this.states),
        edges = new vis.DataSet(this.routes),
        data = {
            nodes: nodes,
            edges: edges
        },
        options = {},
        network = new vis.Network(this.container, data, options);
};

MachineRenderer.prototype.getStates = function () {
    var i, st;

    for (i = 0; i < this.machine.states.length; i++) {
        st = this.machine.states[i];

        this.states.push({
            id: ++this.statesCount,
            label: st.name,
            shape: st.name === this.machine.startState.name ? 'box' : 'circle',
            color: st.isValid ? 'lightgreen' : 'cyan'
        });

        this.stateIds[st.name] = this.statesCount;
    }
};

MachineRenderer.prototype.getRoutes = function () {
    var i, j, st, route, rts, shared;

    for (i = 0; i < this.machine.states.length; i++) {
        st = this.machine.states[i];
        shared = [];

        for (route in st.routes) {
            if (st.routes.hasOwnProperty(route)) {
                rts = st.getAllRouteStates(route);

                for (j = 0; j < rts.length; j++) {
                    if (st.name === rts[j].name) {
                        shared.push(route);
                    } else {
                        this.routes.push(this.createRoute(st.name, rts[j].name, route));
                    }
                }
            }
        }

        if (shared.length) {
            this.routes.push(this.createRoute(st.name, st.name, shared.join('|')));
        }
    }
};

MachineRenderer.prototype.createRoute = function (fromName, toName, label) {
    return {
        from: this.stateIds[fromName],
        to: this.stateIds[toName],
        arrows: 'to',
        label: label,
        color: 'cyan'
    };
};