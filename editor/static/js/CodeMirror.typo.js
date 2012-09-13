window.onload = function () {
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
        lingua: 'en_US',
        static: location.static_url
    });
};
