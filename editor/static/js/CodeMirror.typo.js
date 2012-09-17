window.onload = function () {

    function get_lingua (language2country) {

        function normalize (l2c, result) {
            var l2c_list = l2c.replace ('-','_').split ('_');
            return (l2c_list.length == 2)
                ? l2c_list[0].toLowerCase () + '_' + l2c_list[1].toUpperCase ()
                : result;
        }

        if (language2country &&
            language2country != 'cleared' &&
            language2country.match (/^de|^en|^es/))
        {
            return normalize (language2country, 'en_US');
        } else {
            return undefined;
        }
    }

    var lingua = get_lingua (
        Ext.util.Cookies.get ('lang') ||
        window.navigator.userLanguage ||
        window.navigator.language
    );

    if (lingua == undefined) {
        return; // no default spell checker!
    }

    var worker = new Worker (
        location.static_url + 'app/editor/js/CodeMirror.typo.worker.js'
    );

    worker.onmessage = function (event) {
        if (event.data) {
            var typo = Typo.prototype.load (event.data);
            Ext.ux.form.CodeMirror.typo_engine = typo;
        } else {
            Ext.getCmp ('status-bar.cmb-lang.id').reset ();
        }
    };

    worker.postMessage ({
        lingua: lingua, static: location.static_url
    });

    Ext.getCmp ('status-bar.cmb-lang.id').setValueFor (lingua);
};
