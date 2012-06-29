var reportManager = function () {

    // #########################################################################
    // #########################################################################

    var tbar = { items: [{
        iconCls : 'icon-disk',
        tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)',
        handler : function (button, event) {
            var editor = Ext.getCmp ('editor.id')
            var tab = editor.getActiveTab ()
            if (tab != undefined) {
                var tree = Ext.getCmp ('reportManager.tree.id')
                var node = tree.getNodeById (tab.id)

                if (this.tree.isImage (node)) {
                    Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab', tab)
                }

                if (this.tree.isText (node)) {
                    Ext.getCmp ('reportManager.id').fireEvent ('saveTextTab', tab)
                }
            }
        }
    },{
        iconCls : 'icon-folder_page',
        tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('openFile')
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
        iconCls : 'icon-page_white_zip',
        tooltip : '<b>Import</b><br/>Open a report from a <b>ZIP</b> archive (at <i>local</i> storage)',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('importReport')
        }
    },{
        id : 'btn.export.report-manager.id',
        iconCls : 'icon-report_go',
        tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)',
        split : true,

        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent (
                'exportReport', urls.exportReport
            )
        },

        menu : {
          xtype : 'menu',
          plain : true,

          items : [{
              id : 'btn.export-text.report-manager.id',
              iconCls : 'icon-page_white_text',
              text : 'Text Files',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportText')
              }
          },{
              id : 'btn.export-latex.report-manager.id',
              iconCls : 'icon-page_white_code',
              text : 'Latex Files',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportLatex')
              }
          },{
              id : 'btn.export-pdf.report-manager.id',
              iconCls : 'icon-page_white_acrobat',
              text : 'PDF Report',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportPdf')
              }
          },{
              id : 'btn.export-html.report-manager.id',
              iconCls : 'icon-page_white_world',
              text : 'HTML Files',
              handler : function (button, event) {
                  Ext.getCmp ('reportManager.id').fireEvent ('exportHtml')
              }
          }]
        }
    },'-',{
        id : 'btnMoveUp',
        iconCls : 'icon-arrow_up',
        tooltip : '<b>Move Up</b><br/>Move selected report, folder or file up in tree',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('moveSelectedNodeUp')
        }
    },{
        id : 'btnMoveDown',
        iconCls : 'icon-arrow_down',
        tooltip : '<b>Move Down</b><br/>Move selected report, folder or file down in tree',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('moveSelectedNodeDown')
        }
    }]}

    // #########################################################################
    // #########################################################################

    function _importReport () {
        dialog.openFile.setTitle ('Open ZIP Archive')
        dialog.openFile.execute ({
            success: function (file) {
                var progressBar = Ext.getCmp ('progressBarId')
                progressBar.show ()
                progressBar.setMode ('import')
                progressBar.wait ({
                    increment : progressBar.increment,
                    interval : progressBar.interval
                })

                var xhr = new XMLHttpRequest ()
                xhr.open (
                    "POST", urls.importReport.replace ('=', file.name), true
                )

                xhr.onload = function (event) {
                    progressBar.reset (true)

                    if (this.status == 200) {
                        var response = Ext.util.JSON.decode (this.response)
                        if (response.success) {
                            Ext.Msg.alert ("Info", "Importing <i>" +
                                file.name + "</i> file was sucessful."
                            )
                            var tree = Ext.getCmp ('reportManager.tree.id')
                            tree.getLoader ().load (tree.root, null, this)
                        } else {
                            Ext.Msg.alert ("Error", "Importing <i>" +
                                file.name + "</i> file failed: " +
                                response.message + "!"
                            )
                        }
                    } else {
                        Ext.Msg.alert ("Error", "Importing <i>" +
                            file.name + "</i> file failed: Unknown error!"
                        )
                    }
                }

                xhr.setRequestHeader (
                    'X-CSRFToken', Ext.util.Cookies.get ('csrftoken')
                );

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
    // #########################################################################

    function _exportReport (url) {
        var statusBar = Ext.getCmp ('statusBarId');
        var progressBar = Ext.getCmp ('progressBarId');

        var tree = Ext.getCmp ('reportManager.tree.id')
        var model = tree.getSelectionModel ()
        var node = model.getSelectedNode ()

        if (node != undefined) {
            _disableExport ()
            statusBar.showBusy ({text: 'Please wait ..'})
            progressBar.show ()
            progressBar.setMode ('export')
            progressBar.wait ({
                increment : progressBar.increment,
                interval : progressBar.interval
            })

            var _onSuccess = function (xhr, opts) {
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

                form.insertHtml ('beforeend', "{% csrf_token %}")
                progressBar.reset (true)
                statusBar.clearStatus ({useDefaults:true})
                form.dom.submit ()
                _enableExport ()
            }

            var _onFailure = function (xhr, opts, res) {

                if (res) {
                    msg = "Exporting <i>" + res.name + "</i> report failed!"
                } else {
                    msg = "Exporting report failed!"
                }

                progressBar.reset (true)
                statusBar.clearStatus ({useDefaults:true})
                Ext.Msg.alert ("Error", msg)
                _enableExport ()
            }

            Ext.Ajax.request ({
                url : url.replace ('=', node.id) + "?refresh",
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)[0]
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts, res)
                        }
                    } else {
                        _onFailure (xhr, opts)
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
    
    function _exportHtml () {
        this.fireEvent ('exportReport', urls.exportHtml)
    }

    function _getExportButtons () {
        return [
            Ext.getCmp ('btn.export.report-manager.id'),
            Ext.getCmp ('btn.export-text.report-manager.id'),
            Ext.getCmp ('btn.export-latex.report-manager.id'),
            Ext.getCmp ('btn.export-pdf.report-manager.id'),
            Ext.getCmp ('btn.export-html.report-manager.id'),
            Ext.getCmp ('btn.export.editor.id'),
            Ext.getCmp ('btn.export-text.editor.id'),
            Ext.getCmp ('btn.export-latex.editor.id'),
            Ext.getCmp ('btn.export-pdf.editor.id'),
            Ext.getCmp ('btn.export-html.editor.id')
        ];
    }

    function _enableExport () {
        var buttons = _getExportButtons ();
        for (var idx in buttons) {
            var button = buttons[idx]
            if (button.enable) {
                button.enable ();
            }
        }
    }

    function _disableExport () {
        var buttons = _getExportButtons ();
        for (var idx in buttons) {
            var button = buttons[idx]
            if (button.disable) {
                button.disable ();
            }
        }
    }

    // #########################################################################
    function _openFile () {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var selectionModel = tree.getSelectionModel ()
        var selectedNode = selectionModel.getSelectedNode ()

        if (selectedNode != null) {
            dialog.openFile.setTitle ('Open Text/Image File')
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
                    "Error", "Reading <i>" + file.name + "</i> failed!")
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
                    "Error", "Reading <i>" + file.name + "</i> failed!")
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
    function _saveTextTab (tab, skipMask) {
    // #########################################################################
        if (tab == undefined) {
            tab = Ext.getCmp ('editor.id').getActiveTab ()
        }

        if (tab != undefined) {
            if (skipMask == undefined || skipMask != true) {
                tab.el.mask ('Please wait', 'x-mask-loading')
            }

            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (tab.id)

            reportManager.util.crudUpdate ({
                leafId : node.id,
                nodeId : node.parentNode.id,
                name : node.text.replace('<i>','').replace('</i>',''),
                data : tab.getData (),
                rank : node.parentNode.indexOf (node)
            }, urls.updateText)
        }
    }

    // #########################################################################
    function _saveImageTab (tab, skipMask) {
    // #########################################################################
        if (tab == undefined) {
            tab = Ext.getCmp ('editor.id').getActiveTab ()
        }

        if (tab != undefined) {
            if (skipMask == undefined || skipMask != true) {
                tab.el.mask ('Please wait', 'x-mask-loading')
            }

            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (tab.id)

            reportManager.util.crudUpdate ({
                leafId : node.id,
                nodeId : node.parentNode.id,
                name : node.text.replace('<i>','').replace('</i>',''),
                data : tab.getData (),
                rank : node.parentNode.indexOf (node)
            }, urls.updateImage)
        }
    }
    
    // #########################################################################
    function _addReport () {
    // #########################################################################
        var tree = Ext.getCmp ('reportManager.tree.id')
        var rank = tree.root.childNodes.indexOf (tree.root.lastChild)

        var cmbDocumentType = new Ext.form.ComboBox ({
            fieldLabel : 'Document',
            name : 'document',
                allowBlank : false,
                store : ['article', 'report'],
            mode : 'local',
            triggerAction : 'all',
            selectOnFocus : true,
            editable : false
        });

        var cmbFontSize = new Ext.form.ComboBox ({
            fieldLabel : 'Font Size',
            name : 'fontSize',
                allowBlank : false,
                store : ['10pt', '11pt', '12pt'],
            mode : 'local',
            triggerAction : 'all',
            selectOnFocus : true,
            editable : false
        });

        var cmbColumns = new Ext.form.ComboBox ({
            fieldLabel : 'Columns',
            name : 'columns',
                allowBlank : false,
                store : [1, 2],
            mode : 'local',
            triggerAction : 'all',
            selectOnFocus : true,
            editable : false
        });

        var cmbContent = new Ext.form.ComboBox ({
            fieldLabel : 'Content',
            name : 'content',
                allowBlank : false,
                store : ['empty', 'tutorial'],
            mode : 'local',
            triggerAction : 'all',
            selectOnFocus : true,
            editable : false
        });

        var propertyGrid = new Ext.grid.PropertyGrid ({
            width: 512,
            autoHeight: true,
            propertyNames : {
                project : 'Project',
                authors : 'Author(s)',
                documentType : 'Document Type',
                fontSize : 'Font Size',
                columns : 'Columns',
                title : 'Title',
                toc : 'Table of Content',
                index : 'Index',
                content : 'Content'
            },
            source : {
                project : 'PROJECT',
                authors : 'AUTHORs',
                documentType : 'article',
                fontSize : '12pt',
                columns : 2,
                title : true,
                toc : true,
                index : false,
                content : 'tutorial'
            },
            viewConfig : {
                forceFit : true,
                scrollOffset : 2
            },
            customEditors: {
                documentType : new Ext.grid.GridEditor (cmbDocumentType),
                fontSize : new Ext.grid.GridEditor (cmbFontSize),
                columns : new Ext.grid.GridEditor (cmbColumns),
                content : new Ext.grid.GridEditor (cmbContent)
            }
        });

        delete propertyGrid.getStore().sortInfo;
        propertyGrid.getColumnModel().getColumnById('name').sortable = false

        var win = new Ext.Window ({

            title : 'Create Report',
            plain : true,
            resizable : false,
            modal : true,

            buttons: [{
                text : 'Cancel',
                handler : function () { win.close () }
            },{
                text : 'Create',
                handler : function () {
                    tree.el.mask ('Please wait', 'x-mask-loading')
                    var source = propertyGrid.getSource ()
                    reportManager.util.crudCreate (urls.createProject, {
                        nodeId : tree.root.id,
                        data : Ext.encode (source),
                        rank : rank + 1
                    }); win.close ()
                }
            }],

            items : [propertyGrid]
        })

        win.show (this);
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

        if (node) {
            function _onConfirm (id) {
                if (id != 'yes') {
                    return
                }

                tree.fireEvent (
                    'deleteNode', node, {destroy: true}, {
                        success : function (args) {
                            Ext.getCmp ('editor.id').fireEvent (
                                'deleteTab', { 'id' : args.node.id }
                            )
                            reportManager.util.crudDelete ({id : args.node.id})
                        },

                        failure : function (args) {
                            Ext.Msg.alert (
                                "Error", "No node selected; select a node!"
                            )
                        }
                    }
                )
            }

            Ext.Msg.show ({
               title : 'Delete',
               msg : 'Are you sure you want to delete selection?',
               buttons : Ext.Msg.YESNO,
               fn : _onConfirm,
               scope : this
            });

        } else {
            Ext.Msg.alert ("Error", "No node selected; select a node!")
        }
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

        if (this.tree.isReport (node.previousSibling))
        {
            return
        }

        var prev = _prev (node)
        if (this.tree.isReport (prev))
        {
            return
        }

        var move = Ext.getCmp ('btnMoveUp').disable ()
        tree.el.mask ('Please wait', 'x-mask-loading')

        Ext.Ajax.request ({
            params : {id: node.id, jd: prev.id},
            url : urls.decreaseRank,

            success : function (xhr, opts) {

                if (node.parentNode == prev.parentNode.parentNode) {
                    prev.parentNode.insertBefore (node, prev)
                    prev.parentNode.insertBefore (prev, node)
                } else {
                    prev.parentNode.insertBefore (node, prev)
                }

                tree.selectPath (node.getPath ())
                tree.el.unmask ()
                move.enable ()
            },

            failure : function (xhr, opts) {
                tree.el.unmask ()
                move.enable ()
                Ext.Msg.alert (
                    "Error", "Moving up '" + node.text + "' failed!"
                )
            }
        });
    }

    function _prev (node) {

        var prev = node.previousSibling
        if (prev) {
            return _last (prev)
        } else {
            return node.parentNode
        }
    }

    function _last (node) {

        if (node.lastChild) {
            return _last (node.lastChild)
        } else {
            return node
        }
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

        if (this.tree.isReport (node.nextSibling))
        {
            return
        }

        var next = _next (node)
        if (this.tree.isReport (next))
        {
            return
        }

        var move = Ext.getCmp ('btnMoveDown').disable ()
        tree.el.mask ('Please wait', 'x-mask-loading')

        Ext.Ajax.request ({
            params : {id: node.id, jd: next.id },
            url : urls.increaseRank,

            success : function (xhr, opts) {

                if (next.parentNode == node.parentNode) {
                    next.parentNode.insertBefore (next, node)
                } else {
                    next.parentNode.insertBefore (node, next)
                }

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

    function _next (node) {

        var next = node.nextSibling
        if (next) {
            return _first (next)
        } else {
            return node.parentNode.nextSibling
        }
    }

    function _first (node) {

        if (node.firstChild) {
            return node.firstChild
        } else {
            return node
        }
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
                var model = tree.getSelectionModel ()
                var node = model.getSelectedNode ()

                if (node) {
                    tree.getLoader ().load (node.parentNode, function (root) {
                        root.expand ()
                    }, this)
                } else {
                    tree.getLoader ().load (tree.root, null, this)
                }
            }
        }],

        tbar : tbar,
        items : [reportManagerTree],

        listeners : {
            importReport : _importReport,
            exportReport : _exportReport,
            exportText : _exportText,
            exportLatex : _exportLatex,
            exportPdf : _exportPdf,
            exportHtml : _exportHtml,
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
        }
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
