var pnlReportManager = {
    
    title  : 'Report Manager'
  , layout : 'fit'

  , tools  : [{
        id      : 'refresh'
      , qtip    : '<b>Refresh</b><br/>Refresh report manager\'s view'
      , handler : function (event, toolEl, panel) {
            //@TODO!?
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

                var tree = Ext.getCmp ('pnlReportManagerTreeId')
                var selectionModel = tree.getSelectionModel ()
                var selectedNode = selectionModel.getSelectedNode ()

                if (selectedNode != null) {

                    wndOpenFileDialog.execute ({
                        success: function (file) {

                            var fileInfo = {
                                id      : Math.uuid ()
                              , title   : file.name
                              , text    : file.getAsBinary ().replace (
                                    "\n", "<br>", 'g'
                                )
                              , iconCls : 'icon-page'
                            }

                            var node = new Ext.tree.TreeNode ({
                                'text'     : fileInfo.title
                              , 'data'     : fileInfo.text
                              , 'id'       : fileInfo.id
                              , 'cls'      : "file"
                              , 'iconCls'  : fileInfo.iconCls
                              , 'leaf'     : true
                              , 'expanded' : false
                            })

                            tree.fireEvent (
                                'createNode', node, {
                                    refNode  : selectedNode
                                },{
                                    success: function (args) {
                                        var pnlTabs = Ext.getCmp (
                                            'pnlEditorTabsId'
                                        )
                                        pnlTabs.fireEvent (
                                            'insertTab', fileInfo
                                        )
                                    }

                                  , failure: function (args) {
                                        Ext.Msg.alert (
                                            "Error", "No node inserted!"
                                        )
                                    }
                                }
                            )
                        }
                        
                      , failure: function () {
                            Ext.Msg.alert (
                                "Error", "No file selected!"
                            )
                      }
                    })

                } else {
                    Ext.Msg.alert (
                        "Error", "No report selected; select a report!"
                    )
                }

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

                    DAL.crudUpdate ({
                        leafId : node.id
                      , nodeId : node.parentNode.id
                      , name   : node.text
                      , data   : tab.getData ()
                      , rank   : node.parentNode.indexOf (node)
                    },{
                        success : DAL.fnSuccessUpdate
                      , failure : DAL.fnFailureUpdate
                    });
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

                    DAL.crudUpdate ({
                        leafId : node.id
                      , nodeId : node.parentNode.id
                      , name   : node.text
                      , data   : tab.getData ()
                      , rank   : node.parentNode.indexOf (node)
                    },{
                        success : DAL.fnSuccessUpdate
                      , failure : DAL.fnFailureUpdate
                    });
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

                var tree = Ext.getCmp ('pnlReportManagerTreeId')
                var selectionModel = tree.getSelectionModel ()
                var selectedNode = selectionModel.getSelectedNode ()

                tree.fireEvent (
                    'deleteNode', selectedNode, {destroy: true}, {

                        success : function (args) {

                            Ext.getCmp ('pnlEditorTabsId').fireEvent (
                                'removeTab', { 'id': args.node.id }
                            )

                            DAL.crudDelete({
                                id: args.node.id
                            },{
                                success: DAL.fnSuccessDelete
                              , failure: DAL.fnFailureDelete
                            })

                        }

                      , failure : function (args) {
                            Ext.Msg.alert (
                                "Error", "No node selected; select a node!"
                            )
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

Ext.getCmp ('pnlReportManagerTreeId').on ('dblclick', function (node, event) {
    if (node.attributes['cls'] == "file") {

        var tabInfo = {
            id      : node.id
          , title   : node.attributes['text']
          , text    : node.attributes['data']
          , iconCls : node.attributes['iconCls']
        }

        Ext.getCmp ('pnlEditorTabsId').fireEvent (
            'insertTab', tabInfo
        )
    }
});
