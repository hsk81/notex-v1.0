importScripts ('Assert.js');

self.onmessage = function (event) {

    var args = event.data;
    assert (args.static, 'args.static undefined');
    assert (args.lingua, 'args.lingua undefined');

    var lib_path = args.static + 'lib/typo.js/typo/typo.js';
    var dic_path = args.static + 'lib/typo.js/typo/dictionaries';

    function get (path) {
        var req = new XMLHttpRequest();
        req.open("GET", path, false);
        req.overrideMimeType("text/plain; charset=ISO8859-1");
        req.send(null);

        return req.responseText;
    }

    var aff_data = get (dic_path + '/' + args.lingua + '.aff');
    assert (aff_data, 'aff_data undefined');
    var dic_data = get (dic_path + '/' + args.lingua + '.dic');
    assert (dic_data, 'dic_data undefined');

    importScripts (lib_path);

    var typo = new Typo (args.lingua, aff_data, dic_data, {
        platform: 'any'
    });

    self.postMessage (typo);
    self.close ();
};
