var pnlReportManager = {
    
    title  : 'Report Manager'
  , layout : 'fit'

  , tools  : [{
        id      : 'refresh'
      , qtip    : '<b>Refresh</b><br/>Refresh report manager\'s view'
      , handler : function (event, toolEl, panel) {

            //
            // @TODO!
            //

        }
    }]

  , tbar : {
        items : [{
            iconCls : 'icon-disk_download'
          , tooltip : '<b>Import</b><br/>Open a report (from <i>local</i> storage)'
        },{
            iconCls : 'icon-disk_upload'
          , tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)'
        },'-',{
            iconCls : 'icon-folder_page'
          , tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)'
          , handler : function (button, event) {

                wndOpenFileDialog.execute ()

            }
        },{
            iconCls : 'icon-disk'
          , tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)'
          , handler : function (button, event) {

                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
                var tab = pnlEditorTabs.getActiveTab ()
                if (tab != undefined)
                {
                    tab.el.mask ('Please wait', 'x-mask-loading')

                    var tree = Ext.getCmp ('pnlReportManagerTreeId')
                    var node = tree.getNodeById (tab.id)

                    Ext.Ajax.request ({
                        url: urls.update
                      , params: {
                            'leafId' : node.id
                          , 'nodeId' : node.parentNode.id
                          , 'name'   : node.text
                          , 'data'   : tab.getData ()
                          , 'rank'   : node.parentNode.indexOf (node)
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )

                            var tab = pnlEditorTabs.findById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            tab.el.unmask ()
                            if (res.id != undefined) {
                                tab.id = res.id
                            }

                            var tree = Ext.getCmp ('pnlReportManagerTreeId')
                            var node = tree.getNodeById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            node.attributes['data'] = tab.getData ()
                            if (res.id != undefined) { 
                                node.id = res.id
                            }
                        }

                      , failure: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )
                            
                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            Ext.MessageBox.show ({
                                title    : 'Saving failed'
                              , msg      : String.Format (
                                    "Saving failed for tab '{0}'!"
                                  , tab.title
                                )
                              , closable : false
                              , width    : 256
                              , buttons  : Ext.MessageBox.OK
                            })
                        }
                    })
                }
            }
        },{
            iconCls : 'icon-disk_multiple'
          , tooltip : '<b>Save All</b><br/>Save all files (to <i>remote</i> storage)'
          , handler : function (button, event) {

                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')

                for (var jdx=0; jdx<pnlEditorTabs.items.length; jdx++) {
                    pnlEditorTabs.items.items[jdx].el.mask (
                        'Please wait', 'x-mask-loading'
                    )
                }

                for (var idx=0; idx<pnlEditorTabs.items.length; idx++) {

                    var tab = pnlEditorTabs.items.items[idx]
                    var tree = Ext.getCmp ('pnlReportManagerTreeId')
                    var node = tree.getNodeById (tab.id)

                    Ext.Ajax.request ({
                        url: urls.update
                      , params: {
                            'leafId' : node.id
                          , 'nodeId' : node.parentNode.id
                          , 'name'   : node.text
                          , 'data'   : tab.getData ()
                          , 'rank'   : node.parentNode.indexOf (node)
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )

                            var tab = pnlEditorTabs.findById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            tab.el.unmask ()
                            if (res.id != undefined) {
                                tab.id = res.id
                            }

                            var tree = Ext.getCmp ('pnlReportManagerTreeId')
                            var node = tree.getNodeById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            node.attributes['data'] = tab.getData ()
                            if (res.id != undefined) {
                                node.id = res.id
                            }
                        }

                      , failure: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )

                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            Ext.MessageBox.show ({
                                title    : 'Saving failed'
                              , msg      : String.Format (
                                    "Saving failed for tab '{0}'!"
                                  , tab.title
                                )
                              , closable : false
                              , width    : 256
                              , buttons  : Ext.MessageBox.OK
                            })
                        }
                    })
                }
            }
        },'-',{
            iconCls : 'icon-add'
          , tooltip : '<b>Add</b><br/>Add a new report, folder or file'
          , split   : true
          , menu    : {
              xtype : 'menu'
            , plain : true

            , items : [{
                  iconCls : 'icon-report'
                , text    : 'Report'
              },{
                  iconCls : 'icon-folder'
                , text    : 'Folder'
              },{
                  iconCls : 'icon-page'
                , text    : 'Plain Text'
              },'-',{
                  iconCls : 'icon-image'
                , text    : 'Image'
              }]

            }
        },{
            iconCls : 'icon-pencil'
          , tooltip : '<b>Rename</b><br/>Rename selected report, folder or file'
        },{
            iconCls : 'icon-delete'
          , tooltip : '<b>Delete</b><br/>Delete selected report, folder or file'
          , handler : function (button, event) {
              
                Ext.getCmp ('pnlReportManagerTreeId').fireEvent (
                    'removeNode', function (result, args) {

                        if (!result) {
                            Ext.Msg.alert (
                                "Error", "No node selected; select a node!"
                            )
                        } else {
                            
                            Ext.getCmp ('pnlEditorTabsId').fireEvent (
                                'removeTab', {'id': args.nodeId }
                            )
                            
                            Ext.Ajax.request ({
                                url: urls.del

                              , params: {
                                    'id' : args.nodeId
                                }

                              , success: function (xhr, opts) {
                                    // @DONE!
                                }

                              , failure: function (xhr, opts) {
                                    var res = Ext.decode (xhr.responseText)[0]

                                    Ext.MessageBox.show ({
                                        title    : 'Deleting failed'
                                      , msg      : String.Format (
                                            "Deleting for '{0}' failed!", res.id
                                        )
                                      , closable : false
                                      , width    : 256
                                      , buttons  : Ext.MessageBox.OK
                                    })
                                }
                            })
                        }
                    }
                )

            }
        },'-',{
            iconCls : 'icon-arrow_up'
          , tooltip : '<b>Move Up</b><br/>Move selected report, folder or file up in tree'
        },{
            iconCls : 'icon-arrow_down'
          , tooltip : '<b>Move Down</b><br/>Move selected report, folder or file down in tree'
        }]
    }

  , items : [pnlReportManagerTree]
}
