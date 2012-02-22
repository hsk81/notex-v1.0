var reportManager = new Ext.Panel ({
    
    title  : 'Report Manager', 
    id     : 'reportManager.id', 
    layout : 'fit', 
    
    tools  : [{
        id      : 'refresh', 
        qtip    : '<b>Refresh</b><br/>Refresh report manager\'s view', 
        handler : function (event, toolEl, panel) {
            var tree = Ext.getCmp ('reportManager.tree.id')
            tree.getLoader ().load (tree.root, null, this)
        }
    }], 

    tbar : {
        items : [{
            iconCls : 'icon-disk_download', 
            tooltip : '<b>Import</b><br/>Open a report (from <i>local</i> storage)', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('importReport')
            }
        },{
            iconCls : 'icon-disk_upload',
            tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)',
            split   : true,
            menu    : {
              xtype : 'menu',
              plain : true,

              items : [{
                  iconCls : 'icon-html_go',
                  text    : 'With HTML Tags',
                  tooltip : '<b>Export with HTML Tags</b><br/>..',
                  handler : function (button, event) {
                      Ext.getCmp ('reportManager.id').fireEvent ('exportReport', true)
                  }
              },{
                  iconCls : 'icon-html_delete',
                  text    : 'As Simple Text',
                  tooltip : '<b>Export without HTML Tags</b><br/>..',
                  handler : function (button, event) {
                      Ext.getCmp ('reportManager.id').fireEvent ('exportReport', false)
                  }
              }]
            }
        },'-',{
            iconCls : 'icon-folder_page', 
            tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('openFile')
            }
        },{
            iconCls : 'icon-disk', 
            tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('saveTextTab')
             //@TODO:
             // Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab')
            }
        },'-',{
            iconCls : 'icon-add', 
            tooltip : '<b>Add</b><br/>Add a new report, folder or file', 
            split   : true, 
            menu    : {
              xtype : 'menu', 
              plain : true, 
              
              items : [{
                  iconCls : 'icon-report', 
                  text    : 'Report', 
                  handler : function (button, event) {
                      Ext.getCmp ('reportManager.id').fireEvent ('addReport')
                  }
              },{
                  iconCls : 'icon-folder', 
                  text    : 'Folder', 
                  handler : function (button, event) {
                      Ext.getCmp ('reportManager.id').fireEvent ('addFolder')
                  }
              },{
                  iconCls : 'icon-page', 
                  text    : 'Plain Text', 
                  handler : function (button, event) {
                      Ext.getCmp ('reportManager.id').fireEvent ('addTextFile')
                  }
              }]
            }
        },{
            iconCls : 'icon-pencil', 
            tooltip : '<b>Rename</b><br/>Rename selected report, folder or file', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('renameSelectedNode')
            }
        },{
            iconCls : 'icon-delete', 
            tooltip : '<b>Delete</b><br/>Delete selected report, folder or file', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('deleteSelectedNode')
            }
        },'-',{
            iconCls : 'icon-arrow_up', 
            id      : 'btnMoveUp', 
            tooltip : '<b>Move Up</b><br/>Move selected report, folder or file up in tree', 
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('moveSelectedNodeUp')
            }
        },{
            iconCls : 'icon-arrow_down', 
            id      : 'btnMoveDown', 
            tooltip : '<b>Move Down</b><br/>Move selected report, folder or file down in tree',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('moveSelectedNodeDown')
            }
        }]
    }, 
    
    items : [reportManagerTree], 
    listeners : {

        //
        // Import or export a report ----------------------------------------------------------
        //

        importReport : function () {
            dialog.openFile.execute ({
                success: function (file) {
                    var xhr = new XMLHttpRequest ()
                    xhr.open ("POST", urls.storeFile.replace ('*', file.name), true)
                    xhr.onload = function (event) {
                        if (this.status == 200) {
                            var response = Ext.util.JSON.decode (this.response)
                            if (response.success == 'true') {
                                Ext.Msg.alert ("Info", "Importing <i>" + file.name +
                                    "</i> file was sucessful.")
                                var tree = Ext.getCmp ('reportManager.tree.id')
                                tree.getLoader ().load (tree.root, null, this)
                            } else {
                                Ext.Msg.alert ("Error", "Importing <i>" + file.name +
                                    "</i> file failed: " + response.message + "!")
                            }
                        } else {
                            Ext.Msg.alert ("Error", "Importing <i>" + file.name +
                                "</i> file failed: Unknown error!")
                        }
                    }
                    xhr.send (file);
                },

                failure: function () {
                    Ext.Msg.alert ("Error", "No file or invalid file type selected!")
                }
            })
        }, 
        
        exportReport : function (withHtmlTags) {

            var tree = Ext.getCmp ('reportManager.tree.id')
            var selectionModel = tree.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()
            if (selectedNode != undefined) {

                var node = selectedNode
                var body = Ext.getBody()

                var frame = body.createChild ({
                    tag : 'iframe',
                    cls : 'x-hidden',
                    id : 'iframe',
                    name : 'iframe'
                })

                var form = body.createChild ({
                    tag : 'form',
                    cls : 'x-hidden',
                    id : 'form',
                    action : (withHtmlTags)
                        ? urls.fetchHtml.replace ('=', node.id)
                        : urls.fetchText.replace ('=', node.id),
                    target : 'iframe'
                })

                form.dom.submit();
            }
        },

        //
        // Open file (from local storage) -----------------------------------------------------
        //

        openFile : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var selectionModel = tree.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()

            if (selectedNode != null) {
                dialog.openFile.execute ({
                    success: function (file) {

                        var fileInfo = {
                            id       : Math.uuid (), 
                            title    : file.name
                        }

                        var node = new Ext.tree.TreeNode ({
                            'text'     : String.format ("<i>{0}</i>", fileInfo.title), 
                            'id'       : fileInfo.id, 
                            'cls'      : "file", 
                            'leaf'     : true, 
                            'expanded' : false
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
                                        Ext.getCmp ('editor.id').fireEvent (
                                            'createTextTab', fileInfo, function (tab) {
                                                Ext.getCmp ('reportManager.id').fireEvent (
                                                    'saveTextTab', tab
                                                )
                                            }
                                        )
                                    }, 
                                    
                                    failure: function (args) {
                                        Ext.Msg.alert ("Error", "No node inserted!")
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
                                        Ext.getCmp ('editor.id').fireEvent (
                                            'createImageTab', fileInfo, function (tab) {
                                                Ext.getCmp ('reportManager.id').fireEvent (
                                                    'saveImageTab', tab
                                                )
                                            }
                                        )
                                    }

                                  , failure: function (args) {
                                        Ext.Msg.alert ("Error", "No node inserted!")
                                    }
                                }
                            )
                        } else {
                            Ext.Msg.alert ("Error", "Select a text or image file!")
                        }

                    }, 
                    
                    failure: function () {
                        Ext.Msg.alert ("Error", "No file or invalid file type selected!")
                    }
                })

            } else {
                Ext.Msg.alert ("Error", "No report selected; select a report!")
            }
        }, 

        //
        // Save text/image tab ----------------------------------------------------------------
        //

        saveTextTab : function (tab) {
            if (tab == undefined) {
                var editor = Ext.getCmp ('editor.id')
                tab = editor.getActiveTab ()
            }

            if (tab != undefined) {

                tab.el.mask ('Please wait', 'x-mask-loading')
                var tree = Ext.getCmp ('reportManager.tree.id')
                var node = tree.getNodeById (tab.id)

                reportManager.util.crudUpdate ({
                    leafId  : node.id
                  , nodeId  : node.parentNode.id
                  , name    : node.text.replace('<i>','').replace('</i>','')
                  , data    : tab.getData ()
                  , rank    : node.parentNode.indexOf (node)
                },{
                    success : reportManager.util.fnSuccessUpdate
                  , failure : reportManager.util.fnFailureUpdate
                }, urls.updateText)
            }
        }, 

        saveImageTab : function (tab) {
            if (tab == undefined) {
                var editor = Ext.getCmp ('editor.id')
                tab = editor.getActiveTab ()
            }

            if (tab != undefined) {

                tab.el.mask ('Please wait', 'x-mask-loading')
                var tree = Ext.getCmp ('reportManager.tree.id')
                var node = tree.getNodeById (tab.id)

                reportManager.util.crudUpdate ({
                    leafId  : node.id
                  , nodeId  : node.parentNode.id
                  , name    : node.text.replace('<i>','').replace('</i>','')
                  , data    : tab.getData ()
                  , rank    : node.parentNode.indexOf (node)
                },{
                    success : reportManager.util.fnSuccessUpdate
                  , failure : reportManager.util.fnFailureUpdate
                }, urls.updateImage)
            }
        }, 

        //
        // Add report, folder, text or image file -----------------------------
        //

        addReport : function (a,b,c,d) {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var rank = tree.root.childNodes.indexOf (
                tree.root.lastChild
            )
            
            Ext.Msg.prompt ('Create Report', 'Enter a name:',
                function (btn, text) {
                    if (btn == 'ok') {
                        tree.el.mask ('Please wait', 'x-mask-loading')

                        reportManager.util.crudCreate (urls.createProject, {
                            nodeId : tree.root.id
                          , name   : text
                          , rank   : rank + 1
                        },{
                            success : reportManager.util.fnSuccessCreate
                          , failure : reportManager.util.fnFailureCreate
                        })
                    }
                }
            )
        }, 

        addFolder : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
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

                            reportManager.util.crudCreate (urls.createFolder, {
                                nodeId : node.id
                              , name   : text
                              , rank   : rank + 1
                            },{
                                success : reportManager.util.fnSuccessCreate
                              , failure : reportManager.util.fnFailureCreate
                            })
                        }
                    }
                )
            } else {
                Ext.Msg.alert (
                    "Error", "No node selected; select a node!"
                )
            }
        }, 

        addTextFile : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
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

                            reportManager.util.crudCreate (urls.createText, {
                                nodeId : node.id
                              , name   : text
                              , rank   : rank + 1
                              , data   : '..'
                            },{
                                success : reportManager.util.fnSuccessCreate
                              , failure : reportManager.util.fnFailureCreate
                            })
                        }
                    }
                )
            } else {
                Ext.Msg.alert (
                    "Error", "No node selected; select a node!"
                )
            }
        }, 

        //
        // Rename selected node ---------------------------------------------------------------
        //

        renameSelectedNode : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node != undefined) {
                Ext.Msg.prompt ('Rename Node', 'Enter a name:',
                    function (btn, text) {
                        if (btn == 'ok') {
                            tree.el.mask ('Please wait', 'x-mask-loading')

                            var tabs = Ext.getCmp ('editor.id')
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
                                reportManager.util.crudRename ({
                                    nodeId : node.id
                                  , name   : text
                                },{
                                    success : reportManager.util.fnSuccessRename
                                  , failure : reportManager.util.fnFailureRename
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
        }, 

        //
        // Delete selected node -----------------------------------------------
        //

        deleteSelectedNode : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            tree.fireEvent (
                'deleteNode', node, {destroy: true}, {

                    success : function (args) {

                        Ext.getCmp ('editor.id').fireEvent (
                            'deleteTab', { 'id': args.node.id }
                        )

                        reportManager.util.crudDelete({
                            id: args.node.id
                        },{
                            success: reportManager.util.fnSuccessDelete
                          , failure: reportManager.util.fnFailureDelete
                        })

                    }

                  , failure : function (args) {
                        Ext.Msg.alert (
                            "Error", "No node selected; select a node!"
                        )
                    }

                }
            )
        }, 

        //
        // Move selected node up or down ------------------------------------------------------
        //

        moveSelectedNodeUp : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node == undefined) {
                Ext.Msg.alert ("Error", "No node selected; select a node!")
                return
            }
            
            if (node.parentNode == undefined) return;            
            if (node.previousSibling == undefined) return;

            var move = Ext.getCmp ('btnMoveUp').disable ()
            tree.el.mask ('Please wait', 'x-mask-loading')
            
            Ext.Ajax.request ({
                params : {id: node.id, jd: node.previousSibling.id }
              , url    : urls.swapRank

              , success : function (xhr, opts) {
                    node.parentNode.insertBefore (node, node.previousSibling)
                    tree.selectPath (node.getPath ())
                    tree.el.unmask ()
                    move.enable ()
                }

              , failure : function (xhr, opts) {
                    tree.el.unmask ()
                    move.enable ()
                    Ext.Msg.alert ("Error", "Moving up '" + node.text + "' failed!")
                }
            });
        }, 

        moveSelectedNodeDown : function () {
            var tree = Ext.getCmp ('reportManager.tree.id')
            var model = tree.getSelectionModel ()
            var node = model.getSelectedNode ()

            if (node == undefined) {
                Ext.Msg.alert ("Error", "No node selected; select a node!")
                return;
            }
            
            if (node.parentNode == undefined) return;            
            if (node.nextSibling == undefined) return;
            
            var move = Ext.getCmp ('btnMoveDown').disable ()
            tree.el.mask ('Please wait', 'x-mask-loading')
            
            Ext.Ajax.request ({
                params : {id: node.id, jd: node.nextSibling.id }, 
                url    : urls.swapRank, 
                
                success : function (xhr, opts) {
                    node.parentNode.insertBefore (node.nextSibling, node)
                    tree.selectPath (node.getPath ())
                    tree.el.unmask ()
                    move.enable ()
                }, 

                failure : function (xhr, opts) {
                    tree.el.unmask ()
                    move.enable ()
                    Ext.Msg.alert ("Error", "Moving down '" + node.text + "' failed!")
                }
            });
        }
    }
});

(function() {
    reportManager.util = reportManagerUtil;
    reportManager.tree = reportManagerTree;
    reportManager.task = reportManagerTask;
})();
