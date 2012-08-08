var viewport = function () {
    return new Ext.Viewport ({
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
        }],

        listeners: {
            afterlayout: function () {
                var ld = Ext.get ('load-progress');
                if (ld) ld.remove ();
                var sw = Ext.get ('splash-wrap');
                if (sw) sw.remove ();
            }
        }
    });
}();
