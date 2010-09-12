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
                Ext.getCmp ('pnlReportManagerId').fireEvent ('saveTab')
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
                            id       : Math.uuid ()
                          , title    : file.name
                        }

                        var node = new Ext.tree.TreeNode ({
                            'text'     : String.format ("<i>{0}</i>", fileInfo.title)
                          , 'id'       : fileInfo.id
                          , 'cls'      : "file"
                          , 'leaf'     : true
                          , 'expanded' : false
                        })

                        if (
                            String.match(file.type, "^text") == "text"
                        ) {
                            fileInfo.iconCls = 'icon-page'
                            fileInfo.text = file.getAsBinary ().replace ("\n", "<br>", 'g')
                            node.attributes['iconCls'] = fileInfo.iconCls
                            node.attributes['data'] = fileInfo.text

                            tree.fireEvent (
                                'createNode', node, {
                                    refNode: selectedNode
                                },{
                                    success: function (args) {
                                        Ext.getCmp ('pnlEditorTabsId').fireEvent (
                                            'createTextTab', fileInfo, function (tab) {
                                                Ext.getCmp (
                                                    'pnlReportManagerId'
                                                ).fireEvent (
                                                    'saveTextTab', tab
                                                )
                                            }
                                        )
                                    }

                                  , failure: function (args) {
                                        Ext.Msg.alert (
                                            "Error", "No node inserted!"
                                        )
                                    }
                                }
                            )
                        } else if (
                            String.match(file.type, "^image") == "image"
                        ) {
                            fileInfo.iconCls = 'icon-image'
                            fileInfo.text = file.getAsBinary ()
                            node.attributes['iconCls'] = fileInfo.iconCls
                            node.attributes['data'] = fileInfo.text
                            
                            tree.fireEvent (
                                'createNode', node, {
                                    refNode: selectedNode
                                },{
                                    success: function (args) {
                                        Ext.getCmp ('pnlEditorTabsId').fireEvent (
                                            'createImageTab', fileInfo, function (tab) {
                                                Ext.getCmp (
                                                    'pnlReportManagerId'
                                                ).fireEvent (
                                                    'saveImageTab', tab
                                                )
                                            }
                                        )
                                    }

                                  , failure: function (args) {
                                        Ext.Msg.alert (
                                            "Error", "No node inserted!"
                                        )
                                    }
                                }
                            )
                        } else {
                            Ext.Msg.alert (
                                "Error", "Select a text or image file!"
                            )
                        }

                    }

                  , failure: function () {
                        Ext.Msg.alert (
                            "Error", "No file or invalid file type selected!"
                        )
                    }
                })

            } else {
                Ext.Msg.alert (
                    "Error", "No report selected; select a report!"
                )
            }
        }

        //
        // Save text/image tab ------------------------------------------------
        //

      , saveTextTab : function (tab) {
            if (tab == undefined) {
                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
                tab = pnlEditorTabs.getActiveTab ()
            }

            if (tab != undefined) {

                tab.el.mask ('Please wait', 'x-mask-loading')
                var tree = Ext.getCmp ('pnlReportManagerTreeId')
                var node = tree.getNodeById (tab.id)

                DAL.crudUpdate ({
                    leafId  : node.id
                  , nodeId  : node.parentNode.id
                  , name    : node.text.replace('<i>','').replace('</i>','')
                  , data    : tab.getData ()
                  , rank    : node.parentNode.indexOf (node)
                },{
                    success : DAL.fnSuccessUpdate
                  , failure : DAL.fnFailureUpdate
                }, urls.updateText)
            }
        }

      , saveImageTab : function (tab) {
            if (tab == undefined) {
                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
                tab = pnlEditorTabs.getActiveTab ()
            }

            if (tab != undefined) {

                tab.el.mask ('Please wait', 'x-mask-loading')
                var tree = Ext.getCmp ('pnlReportManagerTreeId')
                var node = tree.getNodeById (tab.id)

                DAL.crudUpdate ({
                    leafId  : node.id
                  , nodeId  : node.parentNode.id
                  , name    : node.text.replace('<i>','').replace('</i>','')
                  , data    : tab.getData ()
                  , rank    : node.parentNode.indexOf (node)
                },{
                    success : DAL.fnSuccessUpdate
                  , failure : DAL.fnFailureUpdate
                }, urls.updateImage)
            }
        }

        //
        // Add report, folder, text or image file -----------------------------
        //

      , addReport : function (a,b,c,d) {
            var tree = Ext.getCmp ('pnlReportManagerTreeId')
            var rank = tree.root.childNodes.indexOf (
                tree.root.lastChild
            )
            
            Ext.Msg.prompt ('Create Report', 'Enter a name:',
                function (btn, text) {
                    if (btn == 'ok') {
                        tree.el.mask ('Please wait', 'x-mask-loading')

                        DAL.crudCreate (urls.createProject, {
                            nodeId : tree.root.id
                          , name   : text
                          , rank   : rank + 1
                        },{
                            success : DAL.fnSuccessCreate
                          , failure : DAL.fnFailureCreate
                        })
                    }
                }
            )
        }

      , addFolder : function () {
            var tree = Ext.getCmp ('pnlReportManagerTreeId')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node != undefined) {
                if (node.isLeaf()) {
                    node = node.parentNode
                }

                Ext.Msg.prompt ('Create Folder', 'Enter a name:',
                    function (btn, text) {
                        if (btn == 'ok') {
                            tree.el.mask ('Please wait', 'x-mask-loading')

                            var rank = node.childNodes.indexOf (
                                node.lastChild
                            );

                            DAL.crudCreate (urls.createFolder, {
                                nodeId : node.id
                              , name   : text
                              , rank   : rank + 1
                            },{
                                success : DAL.fnSuccessCreate
                              , failure : DAL.fnFailureCreate
                            })
                        }
                    }
                )
            } else {
                Ext.Msg.alert (
                    "Error", "No node selected; select a node!"
                )
            }
        }

      , addTextFile : function () {
            var tree = Ext.getCmp ('pnlReportManagerTreeId')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node != undefined) {
                if (node.isLeaf()) {
                    node = node.parentNode
                }

                Ext.Msg.prompt ('Create Text File', 'Enter a name:',
                    function (btn, text) {
                        if (btn == 'ok') {
                            tree.el.mask ('Please wait', 'x-mask-loading')

                            var rank = node.childNodes.indexOf (
                                node.lastChild
                            );

                            DAL.crudCreate (urls.createText, {
                                nodeId : node.id
                              , name   : text
                              , rank   : rank + 1
                              , data   : '..'
                            },{
                                success : DAL.fnSuccessCreate
                              , failure : DAL.fnFailureCreate
                            })
                        }
                    }
                )
            } else {
                Ext.Msg.alert (
                    "Error", "No node selected; select a node!"
                )
            }
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

                                if (tree != undefined) {
                                    tree.el.unmask ()
                                }

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
                    }, this, false, node.text.replace('<i>','').replace(
                        '</i>',''
                    )
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
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            tree.fireEvent (
                'deleteNode', node, {destroy: true}, {

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

        if (String.match(tabInfo.iconCls, "^icon-page$") == "icon-page") {
            Ext.getCmp ('pnlEditorTabsId').fireEvent ('createTextTab', tabInfo)
        } else if (String.match(tabInfo.iconCls, "^icon-image$") == "icon-image") {
            tabInfo.src = 'http://1.bp.blogspot.com/_cqVsOMOJ0NM/SbvyunYBlMI/AAAAAAAAA4U/yx1_Qy4C-ko/s400/Misa+Campo+Very+Sexy+Model2.jpg'
            Ext.getCmp ('pnlEditorTabsId').fireEvent ('createImageTab', tabInfo)
        }
    }
})
