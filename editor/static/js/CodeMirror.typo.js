importScripts ("Assert.js");

self.onmessage = function (e) {
    assert (e.data, 'e.data undefined');

    var args = JSON.parse (e.data);
    assert (args, 'args undefined')
    assert (args.path, 'path undefined')
    assert (args.lang, 'lang undefined')

    function get (path) {
        var req = new XMLHttpRequest();
        req.open("GET", path, false);
        req.overrideMimeType("text/plain; charset=ISO8859-1");
        req.send(null);

        return req.responseText;
    }

    var affData = get (args.path + '/' + args.lang + '/' + args.lang + '.aff');
    assert (affData, 'affData undefined');
    var dicData = get (args.path + '/' + args.lang + '/' + args.lang + '.dic');
    assert (dicData, 'dicData undefined');

    self.postMessage (JSON.stringify({
        lang: args.lang,
        affData: affData,
        dicData: dicData
    }));

    self.close ();
};
