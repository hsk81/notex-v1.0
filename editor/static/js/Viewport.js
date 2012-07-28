Ext.Ajax.on ('beforerequest', function (conn, options) {
    if (!(/^http:.*/.test (options.url) || /^https:.*/.test (options.url))) {
        if (typeof (options.headers) == "undefined") {
            options.headers = {
                'X-CSRFToken': Ext.util.Cookies.get ('csrftoken')
            };
        } else {
            options.headers.extend ({
                'X-CSRFToken': Ext.util.Cookies.get ('csrftoken')
            });
        }
    }
}, this);

Ext.onReady (function () {
    Ext.QuickTips.init ();

    var viewport = new Ext.Viewport ({
        layout : 'border',
        id : 'viewportId',

        items : [{
            region : 'center',
            layout : 'fit',
            items : [editor]
        },{
            region: 'south',
            xtype: 'panel',
            height: 26,
            items : [statusBar]
        },{
            region : 'west',
            split : true,
            minWidth : 260,
            width : 260,
            collapsed : false,
            collapseMode : 'mini',
            hidden : false,
            layout : 'fit',
            items : [reportManager]
        }]
    });

    var map = new Ext.KeyMap (Ext.get(document), [{
        key: "o",
        ctrl: true,
        stopEvent: true,
        fn: function () {
            Ext.getCmp ('reportManager.id').fireEvent ('openFile');
        }
    },{
        key: "s",
        ctrl: true,
        stopEvent: true,
        fn: function () {
            Ext.getCmp ('reportManager.id').fireEvent ('saveTab');
        }
    }]);

    viewport.show ();
});
