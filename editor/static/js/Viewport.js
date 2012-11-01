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
            minWidth : 304,
            width : 304,
            collapsed : false,
            collapseMode : 'mini',
            hidden : false,
            layout : 'fit',
            items : [{
                border : false,
                layout: {
                    type: 'vbox',
                    align : 'stretch',
                    pack  : 'start'
                },
                items : [reportManager, {
                    xtype : 'panel',
                    title : 'Advertisement',
                    layout : 'fit',
                    html: $('#ad-wrap').html ()
                }]
            }]
        }],

        listeners: {
            afterlayout: function () {
                var page_wrap = Ext.get ('page-wrap');
                if (page_wrap) page_wrap.remove ();
                var ad_wrap = Ext.get ('ad-wrap');
                if (ad_wrap) ad_wrap.remove ();
            }
        }
    });
}();
