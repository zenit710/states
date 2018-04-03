var StateEditModule = function (modal) {
    this.$modal = $(modal);
    this.$modalTitle = $('.modal-title', this.$modal);
    this.$cancelButton = $('.update-state-cancel-btn', this.$modal);
    this.$saveButton = $('.update-state-btn', this.$modal);
    this.$form = $('.update-state-form', this.$modal);
    this.$currentStateName = $('.update-state-current-name', this.$form);
    this.$machineName = $('.update-state-machine-name', this.$form);
    this.$newStateName = $('.update-state-name', this.$form);
    this.$isStartState = $('.update-state-start', this.$form);
    this.$isValid = $('.update-state-valid', this.$form);
    this.initialized = false;

    this.init();
};

StateEditModule.prototype.init = function () {
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

StateEditModule.prototype.open = function () {
    this.$modal.modal('show');
};

StateEditModule.prototype.fillForm = function (currentName, machineName, isStart, isValid) {
    this.$currentStateName.val(currentName);
    this.$machineName.val(machineName);
    this.$newStateName.val(currentName);
    this.$isStartState.prop('checked', isStart);
    this.$isValid.prop('checked', isValid);
};

StateEditModule.prototype.setStateName = function (name) {
    this.$modalTitle.html("Edytuj stan '" + name + "'");
};

StateEditModule.prototype.clearForm = function () {
    this.$form[0].reset();
};

StateEditModule.prototype.getValues = function () {
    var values =  this.$form.serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    return {
        machineName: values.machineName,
        currentName: values.currentName,
        name: values.newName,
        isStart: !!values.isStart,
        isValid: !!values.isValid
    }
};