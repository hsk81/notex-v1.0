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
                var load_progress = Ext.get ('load-progress');
                if (load_progress) load_progress.remove ();
                var page_wrap = Ext.get ('page-wrap');
                if (page_wrap) page_wrap.remove ();
            }
        }
    });
}();
