importScripts ('Assert.js');

self.onmessage = function (event) {

    var args = event.data;
    assert (args.static, 'args.static undefined');
    assert (args.lingua, 'args.lingua undefined');

    var lib_path = args.static + 'lib/typo.js/typo/typo.js';
    var dic_path = args.static + 'lib/typo.js/typo/dictionaries';

    function get (path) {
        var xhr = new XMLHttpRequest ();
        xhr.open ("GET", path, false);
        xhr.overrideMimeType ("text/plain; charset=ISO8859-1");
        xhr.send (null);

        if (xhr.status == 200) {
            return xhr.responseText;
        } else {
            return null;
        }
    }

    var aff_data = get (dic_path + '/' + args.lingua + '.aff');
    if (!aff_data) { self.postMessage (null); return; }
    var dic_data = get (dic_path + '/' + args.lingua + '.dic');
    if (!dic_data) { self.postMessage (null); return; }

    importScripts (lib_path);

    var typo = new Typo (args.lingua, aff_data, dic_data, {
        platform: 'any'
    });

    self.postMessage (typo);
    self.close ();
};
