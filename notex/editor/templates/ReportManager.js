var reportManager = function () {

    // #########################################################################
    var tbar_items = [
    // #########################################################################
    {
        iconCls : 'icon-disk_download',
        tooltip : '<b>Import</b><br/>Open a report from a <b>ZIP</b> archive (at <i>local</i> storage)',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('importReport')
        }
    },{
        iconCls : 'icon-disk_upload',
        tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)',
        split : true,

        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('exportText')
        },

        menu : {
          xtype : 'menu',
          plain : true,

          items : [{
              iconCls : 'icon-page_white_compressed',
              text : 'Text Report',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportText')
              }
          },{
              iconCls : 'icon-page_white_code',
              text : 'Latex Files',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportLatex')
              }
          },{
              iconCls : 'icon-page_white_acrobat',
              text : 'PDF Document',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportPdf')
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

            var editor = Ext.getCmp ('editor.id')
            var tab = editor.getActiveTab ()
            if (tab != undefined) {
                var tree = Ext.getCmp ('reportManager.tree.id')
                var node = tree.getNodeById (tab.id)
                var attr = node.attributes

                if (String (attr['iconCls']).match ("^icon-image$") == "icon-image") {
                    Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab', tab)
                } else {
                    Ext.getCmp ('reportManager.id').fireEvent ('saveTextTab', tab)
                }
            }
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

    // #########################################################################
    function _importReport () {
    // #########################################################################
        dialog.openFile.execute ({
            success: function (file) {
                var tree = Ext.getCmp ('reportManager.tree.id')
                tree.el.mask ('Please wait', 'x-mask-loading')

                var xhr = new XMLHttpRequest ()
                xhr.open ("POST", urls.importReport.replace ('=', file.name),
                    true)
                xhr.onload = function (event) {
                    tree.el.unmask ()

                    if (this.status == 200) {
                        var response = Ext.util.JSON.decode (this.response)
                        if (response.success) {
                            Ext.Msg.alert ("Info", "Importing <i>" +
                                file.name + "</i> file was sucessful.")
                            tree.getLoader ().load (tree.root, null, this)
                        } else {
                            Ext.Msg.alert ("Error", "Importing <i>" +
                                file.name + "</i> file failed: " +
                                response.message + "!")
                        }
                    } else {
                        Ext.Msg.alert ("Error", "Importing <i>" +
                            file.name + "</i> file failed: Unknown error!")
                    }
                }

                xhr.send (file);
            },

            failure: function () {
                Ext.Msg.alert (
                    "Error", "No file or invalid file type selected!"
                )
            }
        })
    }

    // #########################################################################
    function _exportReport (url) {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var model = tree.getSelectionModel ()
        var node = model.getSelectedNode ()
        if (node != undefined) {

            tree.el.mask ('Please wait', 'x-mask-loading')

            var fnSuccess = function (xhr, opts) {
                var body = Ext.getBody()

                var frame_old = Ext.get ('iframe')
                if (frame_old != null) {
                    Ext.destroy (frame_old)
                }

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
                    method : 'POST',
                    action : url.replace ('=', node.id),
                    target : 'iframe'
                })

                tree.el.unmask ()
                form.dom.submit ()
            }

            var fnFailure = function (xhr, opts, res) {

                if (res) {
                    msg = "Exporting <i>" + res.name + "</i> report failed!"
                } else {
                    msg = "Exporting report failed!"
                }

                tree.el.unmask ()
                Ext.Msg.alert ("Error", msg)
            }

            Ext.Ajax.request ({
                url : url.replace ('=', node.id) + "?refresh",
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)[0]
                        if (res.success) {
                            fnSuccess (xhr, opts)
                        } else {
                            fnFailure (xhr, opts, res)
                        }
                    } else {
                        fnFailure (xhr, opts)
                    }
                }
            });
        } else {
            Ext.Msg.alert ("Error", "No report selected; select a report!")
        }
    }
    
    function _exportText () {
        this.fireEvent ('exportReport', urls.exportText)
    }

    function _exportLatex () {
        this.fireEvent ('exportReport', urls.exportLatex)
    }

    function _exportPdf () {
        this.fireEvent ('exportReport', urls.exportPdf)
    }
    
    // #########################################################################
    function _openFile () {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var selectionModel = tree.getSelectionModel ()
        var selectedNode = selectionModel.getSelectedNode ()

        if (selectedNode != null) {
            dialog.openFile.execute ({
                success: _openFileOnSucess,
                failure: _openFileOnFailure
            })
        } else {
            Ext.Msg.alert ("Error", "No report selected; select a report!")
        }
    }
    
    function _openFileOnSucess (file) {

        var tree = Ext.getCmp ('reportManager.tree.id')
        var selectionModel = tree.getSelectionModel ()
        var selectedNode = selectionModel.getSelectedNode ()

        var fileInfo = {
            id : Math.uuid (),
            title : file.name
        }

        var node = new Ext.tree.TreeNode ({
            'text' : String.format ("<i>{0}</i>", fileInfo.title),
            'id' : fileInfo.id,
            'cls' : "file",
            'leaf' : true,
            'expanded' : false
        })

        if (String (file.type).match("^image") == "image") {
            var imageReader = new FileReader();

            imageReader.onerror = function (e) {
                Ext.Msg.alert (
                    "Error", "Reading <i>" + file.name + "</i> failed!"
                )
            }

            imageReader.onload = function (e) {
                fileInfo.iconCls = 'icon-image'
                fileInfo.text = e.target.result
                fileInfo.save = true
                node.attributes['iconCls'] = fileInfo.iconCls
                node.attributes['data'] = fileInfo.text

                tree.fireEvent ('createNode', node, {refNode: selectedNode},{
                    success: function (args) {
                        Ext.getCmp ('editor.id').fireEvent (
                            'createImageTab', fileInfo
                        )
                    },

                    failure: function (args) {
                        Ext.Msg.alert ("Error", "No node inserted!")
                    }
                })
            }

            imageReader.readAsDataURL (file);
        } else { // assume text
            var textReader = new FileReader();

            textReader.onerror = function (e) {
                Ext.Msg.alert (
                    "Error", "Reading <i>" + file.name + "</i> failed!"
                )
            }

            textReader.onload = function (e) {
                fileInfo.iconCls = 'icon-page'
                fileInfo.text = e.target.result
                fileInfo.save = true
                node.attributes['iconCls'] = fileInfo.iconCls
                node.attributes['data'] = fileInfo.text

                tree.fireEvent ('createNode', node, {refNode: selectedNode},{
                    success: function (args) {
                        Ext.getCmp ('editor.id').fireEvent (
                            'createTextTab', fileInfo
                        )
                    },

                    failure: function (args) {
                        Ext.Msg.alert ("Error", "No node inserted!")
                    }
                })
            }

            textReader.readAsBinaryString (file);
        }
    }

    function _openFileOnFailure () {
        Ext.Msg.alert ("Error", "No file or invalid file type selected!")
    }
    
    // #########################################################################
    function _saveTextTab (tab) {
    // #########################################################################
        if (tab == undefined) {
            tab = Ext.getCmp ('editor.id').getActiveTab ()
        }

        if (tab != undefined) {
            tab.el.mask ('Please wait', 'x-mask-loading')
            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (tab.id)

            reportManager.util.crudUpdate ({
                leafId : node.id,
                nodeId : node.parentNode.id,
                name : node.text.replace('<i>','').replace('</i>',''),
                data : tab.getData (),
                rank : node.parentNode.indexOf (node)
            },{
                success : reportManager.util.fnSuccessUpdate,
                failure : reportManager.util.fnFailureUpdate
            }, urls.updateText)
        }
    }

    // #########################################################################
    function _saveImageTab (tab) {
    // #########################################################################
        if (tab == undefined) {
            tab = Ext.getCmp ('editor.id').getActiveTab ()
        }

        if (tab != undefined) {

            tab.el.mask ('Please wait', 'x-mask-loading')
            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (tab.id)

            reportManager.util.crudUpdate ({
                leafId : node.id,
                nodeId : node.parentNode.id,
                name : node.text.replace('<i>','').replace('</i>',''),
                data : tab.getData (),
                rank : node.parentNode.indexOf (node)
            },{
                success : reportManager.util.fnSuccessUpdate,
                failure : reportManager.util.fnFailureUpdate
            }, urls.updateImage)
        }
    }
    
    // #########################################################################
    function _addReport () {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var rank = tree.root.childNodes.indexOf (tree.root.lastChild)

        Ext.Msg.prompt ('Create Report', 'Enter a name:',
            function (btn, text) {
                if (btn == 'ok') {
                    tree.el.mask ('Please wait', 'x-mask-loading')

                    reportManager.util.crudCreate (urls.createProject, {
                        nodeId : tree.root.id,
                        name : text,
                        rank : rank + 1
                    },{
                        success : reportManager.util.fnSuccessCreate,
                        failure : reportManager.util.fnFailureCreate
                    })
                }
            }
        )
    }

    // #########################################################################
    function _addFolder () {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var model = tree.getSelectionModel ()
        var node = model.getSelectedNode ()

        if (node != undefined) {
            if (node.isLeaf ()) {
                node = node.parentNode
            }

            Ext.Msg.prompt ('Create Folder', 'Enter a name:',
                function (btn, text) {
                    if (btn == 'ok') {
                        tree.el.mask ('Please wait', 'x-mask-loading')
                        var rank = node.childNodes.indexOf (node.lastChild)

                        reportManager.util.crudCreate (urls.createFolder, {
                            nodeId : node.id,
                            name : text,
                            rank : rank + 1
                        },{
                            success : reportManager.util.fnSuccessCreate,
                            failure : reportManager.util.fnFailureCreate
                        })
                    }
                }
            )
        } else {
            Ext.Msg.alert ("Error", "No node selected; select a node!")
        }
    }

    // #########################################################################
    function _addTextFile () {
    // #########################################################################
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
                        var rank = node.childNodes.indexOf (node.lastChild)

                        reportManager.util.crudCreate (urls.createText, {
                            nodeId : node.id,
                            name : text,
                            rank : rank + 1,
                            data : '..'
                        },{
                            success : reportManager.util.fnSuccessCreate,
                            failure : reportManager.util.fnFailureCreate
                        })
                    }
                }
            )
        } else {
            Ext.Msg.alert ("Error", "No node selected; select a node!")
        }
    }

    // #########################################################################
    function _renameSelectedNode () {
    // #########################################################################
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
                            tab.el.mask ('Please wait', 'x-mask-loading')
                        }

                        if (Math.uuidMatch (node.id)) {
                            node.setText (String.format ("<i>{0}</i>", text))
                            if (tree != undefined) { tree.el.unmask () }

                            if (tab != undefined) {
                                tab.setTitle (text)
                                tab.el.unmask ()
                            }
                        } else {
                            reportManager.util.crudRename ({
                                nodeId : node.id,
                                name : text
                            },{
                                success : reportManager.util.fnSuccessRename,
                                failure : reportManager.util.fnFailureRename
                            })
                        }
                    }
                }, this, false, node.text.replace('<i>','').replace('</i>','')
            )
        } else {
            Ext.Msg.alert ("Error", "No node selected; select a node!")
        }
    }

    // #########################################################################
    function _deleteSelectedNode () {
    // #########################################################################
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
                        success: reportManager.util.fnSuccessDelete,
                        failure: reportManager.util.fnFailureDelete
                    })
                },

                failure : function (args) {
                    Ext.Msg.alert ("Error", "No node selected; select a node!")
                }
            }
        )
    }

    // #########################################################################
    function _moveSelectedNodeUp () {
    // #########################################################################
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
            params : {id: node.id, jd: node.previousSibling.id },
            url : urls.swapRank,

            success : function (xhr, opts) {
                node.parentNode.insertBefore (node, node.previousSibling)
                tree.selectPath (node.getPath ())
                tree.el.unmask ()
                move.enable ()
            },

            failure : function (xhr, opts) {
                tree.el.unmask ()
                move.enable ()
                Ext.Msg.alert ("Error", "Moving up '" + node.text + "' failed!")
            }
        });
    }

    // #########################################################################
    function _moveSelectedNodeDown () {
    // #########################################################################
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
            url : urls.swapRank,

            success : function (xhr, opts) {
                node.parentNode.insertBefore (node.nextSibling, node)
                tree.selectPath (node.getPath ())
                tree.el.unmask ()
                move.enable ()
            },

            failure : function (xhr, opts) {
                tree.el.unmask ()
                move.enable ()
                Ext.Msg.alert (
                    "Error", "Moving down '" + node.text + "' failed!"
                )
            }
        });
    }

    // #########################################################################
    // #########################################################################

    return new Ext.Panel ({

        title : 'Report Manager',
        id : 'reportManager.id',
        layout : 'fit',

        tools : [{
            id : 'refresh',
            qtip : '<b>Refresh</b><br/>Refresh report manager\'s view',
            handler : function (event, toolEl, panel) {
                var tree = Ext.getCmp ('reportManager.tree.id')
                tree.getLoader ().load (tree.root, null, this)
            }
        }],

        tbar : { items : tbar_items },
        items : [reportManagerTree],

        listeners : {
            importReport : _importReport,
            exportText : _exportText,
            exportLatex : _exportLatex,
            exportPdf : _exportPdf,
            exportReport : _exportReport,
            openFile : _openFile,
            saveTextTab : _saveTextTab,
            saveImageTab : _saveImageTab,
            addReport : _addReport,
            addFolder : _addFolder,
            addTextFile : _addTextFile,
            renameSelectedNode : _renameSelectedNode,
            deleteSelectedNode : _deleteSelectedNode,
            moveSelectedNodeUp : _moveSelectedNodeUp,
            moveSelectedNodeDown : _moveSelectedNodeDown
        },
    })
}();

// #############################################################################
// #############################################################################

(function() {
    reportManager.util = reportManagerUtil;
    reportManager.tree = reportManagerTree;
    reportManager.task = reportManagerTask;
})();

// #############################################################################
// #############################################################################
