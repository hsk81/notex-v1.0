window.onload = function () {

    function get_lingua (language2country) {

        function normalize (l2c, result) {
            var l2c_list = l2c.replace ('-','_').split ('_');
            return (l2c_list.length == 2)
                ? l2c_list[0].toLowerCase () + '_' + l2c_list[1].toUpperCase ()
                : result;
        }

        if (language2country &&
            language2country.indexOf &&
            language2country.indexOf ('en') !== -1) {
            return normalize (language2country, 'en_US');
        } else {
            return undefined;
        }
    }

    var lingua = get_lingua (
        window.navigator.userLanguage || window.navigator.language
    );

    if (lingua == undefined) {
        return; // do not set a default spell checker
    }

    var worker = new Worker (
        location.static_url + 'app/editor/js/CodeMirror.typo.worker.js'
    );

    worker.onmessage = function (event) {
        var typo = Typo.prototype.load (event.data);
        assert (typo);
        Ext.ux.form.CodeMirror.typo_engine = typo;
    };

    Ext.ux.form.CodeMirror.typo_engine = null;

    worker.postMessage ({
        lingua: lingua, static: location.static_url
    });
};
