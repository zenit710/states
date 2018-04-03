$(document).ready(function () {
    var htmlGenerator = new HTMLGenerator(),
        machine1 = new StateModule('#machine-1', htmlGenerator, '.edit-modal', '.route-modal'),
        machine2 = new StateModule('#machine-2', htmlGenerator, '.edit-modal', '.route-modal'),
        $comparisonResult = $('.comparison-result'),
        comparisonMessage = {
            true: 'Maszyny działają tak samo',
            false: 'Maszyny nie działają tak samo',
            undefined: 'Nie można zbudować jednej z maszyn'
        };

    $('.compare-btn').click(function () {
        var machineA, machineB, result, msgResult;

        try {
            machineA = machine1.getMachine().toDeterministic();
            machineB = machine2.getMachine().toDeterministic();
            result = machineA.equals(machineB);
        } catch (e) {}

        msgResult = result || false;

        $comparisonResult.html(comparisonMessage[result]);
        $comparisonResult.toggleClass('alert-danger', !msgResult);
        $comparisonResult.toggleClass('alert-success', msgResult);
        $comparisonResult.fadeTo(250, 1);

        setTimeout(function () {
            $comparisonResult.fadeTo(250, 0, function () {
                $comparisonResult.removeClass('alert-danger');
                $comparisonResult.removeClass('alert-success');
            });
        }, 5000);
    })
});