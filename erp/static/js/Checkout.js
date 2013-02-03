var getCheckoutWindow = function (address, product) {

    function CORSRequest (method, url) {
        var xhr = new XMLHttpRequest();

        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }

        return xhr;
    }

    function generateInputAddress (fn) {
        var callbackUrlOrig = String.format ("{0}//{1}",
            document.location.protocol, document.location.host
        );

        var callbackUrlBase = callbackUrlOrig + "/erp/btc-transact/";
        var callbackUrlArgs = "?mail={0}&uuid={1}";
        var callbackUrl = callbackUrlBase + String.format (callbackUrlArgs,
            Ext.fly ('input-0.id').dom.value, product.uuid
        );

        var apiUrlBase = "https://blockchain.info/api/receive";
        var apiUrlArgs = "?method=create&address={0}&anonymous={1}&callback={2}";
        var apiUrl = apiUrlBase + String.format (apiUrlArgs,
            address, true, encodeURIComponent (callbackUrl)
        );

        var xhr = new CORSRequest ('GET', apiUrl);
        if (xhr) {
            xhr.onload = function (event) {
                if (xhr.status == 200) {
                    var response = Ext.decode (xhr.responseText);
                    fn.call (this, response.input_address);
                } else {
                    fn.call (this, undefined);
                }
            };

            xhr.onerror = function (event) {
                fn.call (this, undefined);
            };

            xhr.withCredentials = false; //no cookies
            xhr.send();
        }
    }

    function move (delta) {
        var panelLayout = Ext.getCmp ('checkout-panel').getLayout ();
        var item = panelLayout.activeItem.id.split ('card-')[1];
        var index = parseInt (item, 10);

        if (index == 0) {
            if (_gaq && _gaq.push) {
                _gaq.push (['_trackEvent', 'Checkout', 'Email', 'BTC', 1]);
            }

            var email = Ext.fly ('input-0.id').dom.value;
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (regex.test (email) != true) {
                return;
            }
        }

        index += delta;

        if (index == 1) {
            if (_gaq && _gaq.push) {
                _gaq.push (['_trackEvent', 'Checkout', 'QR Code', 'BTC', 1]);
            }

            function callback (input_address) {
                Ext.fly ('input-1.id').dom.value = String.format (
                    "{1} -> {0}", input_address, product.price.with_cents
                );

                var orig = "https://chart.googleapis.com/chart"
                var args = "chs=192x192&cht=qr&chl=" + String.format (
                    "bitcoin:{0}?amount={1}", input_address, product.price.value
                );

                Ext.fly ('qr-code.id').dom.src = String.format ("{0}?{1}",
                    orig, args
                );
            }

            generateInputAddress (callback);
        }

        panelLayout.setActiveItem (index);
        Ext.getCmp ('move-prev').setDisabled (index==0);
        Ext.getCmp ('move-next').setDisabled (index==1);

        var window = Ext.getCmp ('checkout-window');
        window.updateTitle (index);
    };

    var getCheckoutPanel = function (address, product) {

        return new Ext.Panel ({
            id: 'checkout-panel',
            layout:'card',
            activeItem: 0,
            width: 640, height: 480,
            defaults: {
                border:false
            },

            bbar: [{
                id: 'move-prev',
                text: 'Back',
                handler: move.createDelegate (this, [-1]),
                disabled: true
            }, '->', {
                id: 'move-next',
                text: 'Next',
                handler: move.createDelegate (this, [+1])
            }],

            items: [{
                id: 'card-0'
            },{
                id: 'card-1'
            }],

            listeners: {
                afterrender: function (self) {
                    var origin = String.format ('{0}//{1}',
                        document.location.protocol, document.location.host
                    );

                    $('#card-0').load (origin + '/erp/checkout/card-0.html');
                    $('#card-1').load (origin + '/erp/checkout/card-1.html');
                }
            }
        });
    }

    function getTitle (product, progress) {
        return String.format ('Checkout: {0} [{1} of {2}]', product.title,
            progress.index + 1, progress.length
        );
    }

    var progress = {
        index: 0, length: 2
    }

    return new Ext.Window ({
        id: 'checkout-window',
        title: getTitle (product, progress),
        items: [getCheckoutPanel (address, product)],
        iconCls: 'icon-coins-16',
        resizable: false,
        modal: true,

        updateTitle: function (index) {
            this.setTitle (getTitle (product, {
                index: index, length: progress.length
            }));

            return this.title;
        }
    })
}
