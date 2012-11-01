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
                    html : '<div style="height:250px; width:100%;"><script type="text/javascript"><!--google_ad_client = "ca-pub-0141161703803018";/* NoTex - MedRec */google_ad_slot = "6190750994";google_ad_width = 300;google_ad_height = 250;//--></script><script type="text/javascript" src="https://pagead2.googlesyndication.com/pagead/show_ads.js"></script></div>'
                }]
            }]
        }],

        listeners: {
            afterlayout: function () {
                var load_progress = Ext.get ('load-progress');
                if (load_progress) load_progress.remove ();
                var page_wrap = Ext.get ('page-wrap');
                if (page_wrap) page_wrap.remove ();
            }
            /*afterrender: function (self) {
                var origin = String.format ('{0}//{1}',
                    document.location.protocol, document.location.host);
                $('#ad-home').load (origin + '/editor/ad-medrec.html');
            }*/
        }
    });
}();
