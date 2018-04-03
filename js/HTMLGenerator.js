var HTMLGenerator = function () {
    this.name = 'HTMLGenerator';
};

HTMLGenerator.prototype.createStateElement = function (state, isStart) {
    var element,
        innerText;

    innerText = '<div class="state-title">' + state.name;
    innerText += state.isValid ? ' - akceptujący' : '';
    innerText += isStart ? ' - startowy' : '';
    innerText += '</div>';

    element = document.createElement('div');
    element.id = state.name;
    element.className = 'well col-md-12 row state-holder';
    element.innerHTML = innerText;

    return element;
};

HTMLGenerator.prototype.createEditButton = function (state) {
    var element = document.createElement('button');

    element.className = 'btn btn-primary edit-state';
    element.dataset['statename'] = state.name;
    element.innerHTML = '<span class="glyphicon glyphicon-pencil"></span>';

    return element;
};

HTMLGenerator.prototype.createRemoveButton = function (state) {
    var element = document.createElement('button');

    element.className = 'btn btn-danger remove-state';
    element.dataset['statename'] = state.name;
    element.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';

    return element;
};

HTMLGenerator.prototype.createRouteButton = function (state) {
    var element = document.createElement('button')

    element.className = 'btn btn-info add-route';
    element.dataset['statename'] = state.name;
    element.innerHTML = '<span class="glyphicon glyphicon-plus-sign"></span>';

    return element;
};

HTMLGenerator.prototype.createRouteElement = function (name, route, stateName) {
    var element = document.createElement('p');

    element.className = 'route';
    element.innerHTML = '---[' + route + ']---> ' + stateName;

    return element;
};

HTMLGenerator.prototype.createRemoveRouteButton = function (name, route, toName) {
    var element = document.createElement('button');

    element.className = 'btn btn-sm btn-danger remove-route';
    element.dataset['statename'] = name;
    element.dataset['route'] = route;
    element.dataset['toName'] = toName;
    element.innerHTML = '<span class="glyphicon glyphicon-remove"></span>';

    return element;
};