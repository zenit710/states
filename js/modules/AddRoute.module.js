var AddRouteModule = function (modal) {
    this.$modal = $(modal);
    this.$modalTitle = $('.modal-title', this.$modal);
    this.$cancelButton = $('.add-route-cancel-btn', this.$modal);
    this.$saveButton = $('.add-route-btn', this.$modal);
    this.$form = $('.route-add-form', this.$modal);
    this.$currentStateName = $('.route-state-name', this.$form);
    this.$machineName = $('.route-state-machine-name', this.$form);
    this.$char = $('.route-char', this.$form);
    this.$toState = $('.route-state', this.$form);
    this.initialized = false;

    this.init();
};

AddRouteModule.prototype.init = function () {
    if (this.initialized) return;

    var self = this;

    this.$cancelButton.click(function () {
        self.$modal.modal('hide');
        self.clearForm();
    });

    this.$saveButton.click(function () {
        self.$modal.modal('hide');
    });

    this.initialized = true;
};

AddRouteModule.prototype.open = function () {
    this.$modal.modal('show');
};

AddRouteModule.prototype.fillForm = function (currentName, machineName, options) {
    this.$currentStateName.val(currentName);
    this.$machineName.val(machineName);
    this.$toState.html(options);
};

AddRouteModule.prototype.setStateName = function (name) {
    this.$modalTitle.html("Dodaj ścieżkę dla stanu '" + name + "'");
};

AddRouteModule.prototype.clearForm = function () {
    this.$form[0].reset();
};

AddRouteModule.prototype.getValues = function () {
    var values =  this.$form.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    return {
        machineName: values.machineName,
        currentName: values.stateName,
        chars: values.chars,
        toState: values.toState
    }
};