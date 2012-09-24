var tracker = function () {

    function _event (args) {
        if (_gaq && _gaq.push) {
            _gaq.push (['_trackEvent',
                args.category,
                args.action,
                args.label,
                args.value,
                args.flag
            ]);
        }
    }

    return {
        event: _event
    }
}();
