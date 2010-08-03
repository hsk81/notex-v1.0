var pnlReportManager = {
    
    title  : 'Report Manager'
  , id     : 'pnlReportManagerId'
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
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('importReport')
            }
        },{
            iconCls : 'icon-disk_upload'
          , tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('exportReport')
            }
        },'-',{
            iconCls : 'icon-folder_page'
          , tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('openFile')
            }
        },{
            iconCls : 'icon-disk'
          , tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('saveActiveTab')
            }
        },{
            iconCls : 'icon-disk_multiple'
          , tooltip : '<b>Save All</b><br/>Save all files (to <i>remote</i> storage)'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('saveOpenTabs')
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
                , handler : function (button, event) {
                      Ext.getCmp ('pnlReportManagerId').fireEvent ('addReport')
                  }
              },{
                  iconCls : 'icon-folder'
                , text    : 'Folder'
                , handler : function (button, event) {
                      Ext.getCmp ('pnlReportManagerId').fireEvent ('addFolder')
                  }
              },{
                  iconCls : 'icon-page'
                , text    : 'Plain Text'
                , handler : function (button, event) {
                      Ext.getCmp ('pnlReportManagerId').fireEvent ('addTextFile')
                  }
              },'-',{
                  iconCls : 'icon-image'
                , text    : 'Image'
                , handler : function (button, event) {
                      Ext.getCmp ('pnlReportManagerId').fireEvent ('addImageFile')
                  }
              }]

            }
        },{
            iconCls : 'icon-pencil'
          , tooltip : '<b>Rename</b><br/>Rename selected report, folder or file'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('renameSelectedNode')
            }
        },{
            iconCls : 'icon-delete'
          , tooltip : '<b>Delete</b><br/>Delete selected report, folder or file'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('deleteSelectedNode')
            }
        },'-',{
            iconCls : 'icon-arrow_up'
          , tooltip : '<b>Move Up</b><br/>Move selected report, folder or file up in tree'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('moveSelectedNodeUp')
            }
        },{
            iconCls : 'icon-arrow_down'
          , tooltip : '<b>Move Down</b><br/>Move selected report, folder or file down in tree'
          , handler : function (button, event) {
                Ext.getCmp ('pnlReportManagerId').fireEvent ('moveSelectedNodeDown')
            }
        }]
    }

  , items : [pnlReportManagerTree]
  
  , listeners : {

        //
        // Import or export a report ------------------------------------------
        //

        importReport : function () {
            //@TODO
        }

      , exportReport : function () {
            //@TODO
        }

        //
        // Open file (from local storage) -------------------------------------
        //

      , openFile : function () {
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
                            'text'     : String.format ("<i>{0}</i>", fileInfo.title)
                          , 'data'     : fileInfo.text
                          , 'id'       : fileInfo.id
                          , 'cls'      : "file"
                          , 'iconCls'  : fileInfo.iconCls
                          , 'leaf'     : true
                          , 'expanded' : false
                        })

                        tree.fireEvent (
                            'createNode', node, {
                                refNode: selectedNode
                            },{
                                success: function (args) {
                                    var pnlTabs = Ext.getCmp ('pnlEditorTabsId')
                                    pnlTabs.fireEvent ('createTab', fileInfo)
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
                        Ext.Msg.alert ("Error", "No file selected!")
                    }
                })

            } else {
                Ext.Msg.alert (
                    "Error", "No report selected; select a report!"
                )
            }
        }

        //
        // Save active tab or save-all open tab -------------------------------
        //

      , saveActiveTab : function () {
            var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
            var tab = pnlEditorTabs.getActiveTab ()

            if (tab != undefined) {

                tab.el.mask ('Please wait', 'x-mask-loading')
                var tree = Ext.getCmp ('pnlReportManagerTreeId')
                var node = tree.getNodeById (tab.id)

                DAL.crudUpdate ({
                    leafId : node.id
                  , nodeId : node.parentNode.id
                  , name   : node.text.replace('<i>','').replace('</i>','')
                  , data   : tab.getData ()
                  , rank   : node.parentNode.indexOf (node)
                },{
                    success : DAL.fnSuccessUpdate
                  , failure : DAL.fnFailureUpdate
                })
            }
        }

      , saveOpenTabs : function () {
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
                  , name   : node.text.replace('<i>','').replace('</i>','')
                  , data   : tab.getData ()
                  , rank   : node.parentNode.indexOf (node)
                },{
                    success : DAL.fnSuccessUpdate
                  , failure : DAL.fnFailureUpdate
                });
            }
        }

        //
        // Add report, folder, text or image file -----------------------------
        //

      , addReport : function () {
            //@TODO
        }

      , addFolder : function () {
            //@TODO
        }

      , addTextFile : function () {
            //@TODO
        }

      , addImageFile : function () {
            //@TODO
        }

        //
        // Rename selected node -----------------------------------------------
        //

      , renameSelectedNode : function () {
            var tree = Ext.getCmp ('pnlReportManagerTreeId')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node != undefined) {
                Ext.Msg.prompt ('Rename Node', 'Enter a name:',
                    function (btn, text) {
                        if (btn == 'ok') {
                            tree.el.mask ('Please wait', 'x-mask-loading')

                            var tabs = Ext.getCmp ('pnlEditorTabsId')
                            var tab = tabs.findById (node.id)
                            if (tab != undefined) {
                                tab.el.mask (
                                    'Please wait', 'x-mask-loading'
                                )
                            }

                            if (Math.uuidMatch (node.id)) {
                                node.setText (
                                    String.format ("<i>{0}</i>", text)
                                )
                                tree.el.unmask ()

                                if (tab != undefined) {
                                    tab.setTitle (text)
                                    tab.el.unmask ()
                                }
                            } else {
                                DAL.crudRename ({
                                    nodeId : node.id
                                  , name   : text
                                },{
                                    success : DAL.fnSuccessRename
                                  , failure : DAL.fnFailureRename
                                })
                            }
                        }
                    }, this, false, node.text.replace('<i>','').replace('</i>','')
                )
            } else {
                Ext.Msg.alert (
                    "Error", "No node selected; select a node!"
                )
            }
        }

        //
        // Delete selected node -----------------------------------------------
        //

      , deleteSelectedNode : function () {
            var tree = Ext.getCmp ('pnlReportManagerTreeId')
            var selectionModel = tree.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()

            tree.fireEvent (
                'deleteNode', selectedNode, {destroy: true}, {

                    success : function (args) {

                        Ext.getCmp ('pnlEditorTabsId').fireEvent (
                            'deleteTab', { 'id': args.node.id }
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

        //
        // Move selected node up or down --------------------------------------
        //

      , moveSelectedNodeUp : function () {
            //@TODO
        }

      , moveSelectedNodeDown : function () {
            //@TODO
        }
    }
}

Ext.getCmp ('pnlReportManagerTreeId').on ('dblclick', function (node, event) {
    if (node.attributes['cls'] == "file") {

        var tabInfo = {
            id      : node.id
          , title   : node.attributes['text'].replace ('<i>','').replace ('</i>','')
          , text    : node.attributes['data']
          , iconCls : node.attributes['iconCls']
        }

        Ext.getCmp ('pnlEditorTabsId').fireEvent (
            'createTab', tabInfo
        )
    }
})
