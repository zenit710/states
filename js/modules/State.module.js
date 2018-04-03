var StateModule = function (machineContainer, generator, stateEditModal, addRouteModal) {
    this.$machineContainer = $(machineContainer);
    this.machineName = machineContainer;
    this.generator = generator;
    this.$form = $('.add-state', this.$machineContainer);
    this.$list = $('.states', this.$machineContainer);
    this.$testButton = $('.test-machine-btn', this.$machineContainer);
    this.$deterministicButton = $('.deterministic-btn', this.$machineContainer);
    this.$deterministicContainer = $('.deterministic', this.$machineContainer);
    this.$deterministicContent = $('.deterministic-content', this.$deterministicContainer);
    this.$originalButton = $('.original-btn', this.$machineContainer);
    this.$originalContainer = $('.original', this.$machineContainer);
    this.$originalContent = $('.original-content', this.$originalContainer);
    this.stateEdit = new StateEditModule(stateEditModal);
    this.addRouteModule = new AddRouteModule(addRouteModal);
    this.states = {};
    this.startState = null;
    this.initialized = false;

    this.init();
};

StateModule.prototype.init = function () {
    var self = this;

    if (!this.initialized) {
        this.$form.submit(function (e) {
            e.preventDefault();

            var formValue = self.$form.serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            self.states[formValue.name] = new State(formValue.name, formValue.valid);

            if (formValue.start) {
                self.startState = self.states[formValue.name];
            }

            self.$form[0].reset();
            self.printStates();
        });

        this.stateEdit.$saveButton.click(function () {
            var formValue = self.stateEdit.getValues();

            if (formValue.machineName === self.machineName) {
                self.stateEdit.clearForm();
                self.updateStateByName(formValue.currentName, formValue);
                self.printStates();
            }
        });

        this.addRouteModule.$saveButton.click(function () {
            var formValue = self.addRouteModule.getValues();

            if (formValue.machineName === self.machineName) {
                self.addRouteModule.clearForm();
                self.addRouteToStateByName(formValue.currentName, formValue);
                self.printStates();
            }
        });

        this.$testButton.click(function () {
            var word = prompt('Podaj słowo do testowania'),
                result,
                machine;

            try {
                machine = self.getMachine();
                result = machine.check(word);
                alert('Wyraz ' + (result ? '' : 'nie ') + 'OK');
            } catch (e) {
                alert('Automat jest niesprawny!');
                console.error(e);
            }
        });

        this.$deterministicButton.click(function () {
            var det, renderer;

            try {
                det = self.getMachine().toDeterministic();

                self.$deterministicContainer.show();
                renderer = new MachineRenderer(self.$deterministicContent[0], det);
                renderer.render();
            } catch (e) {
                alert('Automat jest niesprawny!');
                console.error(e);
            }
        });

        $('.close', this.$deterministicContainer).click(function () {
            self.$deterministicContainer.hide();
        });

        this.$originalButton.click(function () {
            try {
                self.$originalContainer.show();
                var renderer = new MachineRenderer(self.$originalContent[0], self.getMachine());
                renderer.render();
            } catch (e) {
                alert('Automat jest niesprawny!');
                console.error(e);
            }
        });


        $('.close', this.$originalContainer).click(function () {
            self.$originalContainer.hide();
        });
    }
};

StateModule.prototype.printStates = function () {
    var state,
        element;

    this.$list.html('');

    for (state in this.states) {
        if (this.states.hasOwnProperty(state)) {
            element = this.createStateElement(this.states[state]);

            this.$list.append(element)
        }
    }
};

StateModule.prototype.createStateElement = function (state) {
    var stateElement = this.generator.createStateElement(state, (this.startState && state.name == this.startState.name)),
        routeButton = this.createRouteButton(state),
        editButton= this.createEditButton(state),
        removeButton = this.createRemoveButton(state),
        route;

    stateElement.appendChild(routeButton);
    stateElement.appendChild(editButton);
    stateElement.appendChild(removeButton);

    if (state.hasAnyRoute()) {
        for (route in state.routes) {
            if (state.routes.hasOwnProperty(route)) {
                for (var i = 0; i < state.routes[route].length; i++) {
                    stateElement.appendChild(this.createRouteElement(state.name, route, state.routes[route][i].name));
                }
            }
        }
    }

    return stateElement;
};

StateModule.prototype.createRouteButton = function (state) {
    var routeButton = this.generator.createRouteButton(state),
        self = this;

    $(routeButton).click(function () {
        var stateName = $(this).data('statename'),
            state,
            options = '';

        for (state in self.states) {
            if (self.states.hasOwnProperty(state)) {
                options += '<option value=' + self.states[state].name + '>' + self.states[state].name + '</option>';
            }
        }

        self.addRouteModule.setStateName(stateName);
        self.addRouteModule.fillForm(stateName, self.machineName, options);
        self.addRouteModule.open();
    });

    return routeButton;
};

StateModule.prototype.createEditButton = function (state) {
    var button = this.generator.createEditButton(state),
        self = this;

    $(button).click(function () {
        var stateName = $(this).data('statename'),
            state = self.getStateByName(stateName),
            isStart = self.startState && state.name == self.startState.name;

        self.stateEdit.fillForm(state.name, self.machineName, isStart, state.isValid);
        self.stateEdit.setStateName(state.name);
        self.stateEdit.open();
    });

    return button;
};

StateModule.prototype.createRemoveButton = function (state) {
    var button = this.generator.createRemoveButton(state),
        self = this;

    $(button).click(function () {
        var stateName = $(this).data('statename');

        self.removeStateByName(stateName);
        self.printStates();
    });

    return button;
};

StateModule.prototype.createRouteElement = function (name, route, stateName) {
    var element = this.generator.createRouteElement(name, route, stateName),
        removeButton;

    removeButton = this.createRemoveRouteButton(name, route, stateName);

    element.appendChild(removeButton);

    return element;
};

StateModule.prototype.createRemoveRouteButton = function (name, route, toName) {
    var element = this.generator.createRemoveRouteButton(name, route, toName),
        self = this;

    $(element).click(function () {
        var el = $(this);

        self.removeRoute(el.data('statename'), el.data('route'), el.data('toName'));
        self.printStates();
    });

    return element;
};

StateModule.prototype.removeStateByName = function (name) {
    for (var state in this.states) {
        if (this.states.hasOwnProperty(state) && this.states[state].name === name) {
            delete this.states[state];
        }
    }

    if (this.startState.name === name) {
        this.startState = null;
    }
};

StateModule.prototype.getStateByName = function (name) {
    return this.states[name] || null;
};

StateModule.prototype.updateStateByName = function (name, values) {
    var state = this.getStateByName(name),
        stateName = state.name;

    if (values.isStart) {
        this.startState = this.states[state];
    }

    state.name = values.name;
    state.isValid = values.isValid;

    if (name != values.name) {
        delete this.states[stateName];
    }

    this.states[values.name] = state;
};

StateModule.prototype.addRouteToStateByName = function (name, values) {
    var state = this.getStateByName(name),
        chars = values.chars.split('');

    state.addRoutes(chars, this.getStateByName(values.toState));
};

StateModule.prototype.removeRoute = function (name, route, toName) {
    var state = this.getStateByName(name);

    if (state.routes.hasOwnProperty(route)) {
        for (var i = 0; i < state.routes[route].length; i++) {
            if (state.routes[route][i].name === toName) {
                state.routes[route].splice(i, 1);
            }
        }

        if (state.routes[route].length == 0) {
            delete state.routes[route];
        }
    }
};

StateModule.prototype.getMachine = function () {
    var machine,
        state;

    if (this.startState) {
        machine = new Machine(this.startState);

        for (state in this.states) {
            if (this.states.hasOwnProperty(state)) {
                machine.addState(this.states[state]);
            }
        }

        return machine;
    }

    throw {
        code: 1,
        msg: 'Cannot generate Machine'
    };
};