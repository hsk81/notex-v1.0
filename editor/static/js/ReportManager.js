var reportManager = {
    util: reportManagerUtil,
    crud: reportManagerCrud,
    tree: reportManagerTree,
    task: reportManagerTask
}

var reportManager = function () {

    // #########################################################################
    // #########################################################################

    var prompt_message = reportManager.util.prompt_message;
    var confirm_message = reportManager.util.confirm_message;
    var error_msg = reportManager.util.error_message;
    var resource = reportManager.util.resource;

    // #########################################################################
    // #########################################################################

    function importReport () {

        dialog.openFile.setTitle ('Open ZIP Archive');
        dialog.openFile.setIconClass ('icon-report_add-16');
        dialog.openFile.execute ({
            success: function (file) {

                var progressBar = Ext.getCmp ('progress-bar.id')
                progressBar.show ()
                progressBar.setMode ('import')
                progressBar.wait ({
                    increment : progressBar.increment,
                    interval : progressBar.interval
                })

                var xhr = new XMLHttpRequest ()

                xhr.open (
                    "POST", urls.importReport.replace ('=', file.name), true
                );

                xhr.onerror = function (event) {
                    progressBar.reset (true)
                    if (this.response) {
                        var response = Ext.util.JSON.decode (this.response)
                        import_failure (file.name, response.message);
                    } else {
                        import_failure (file.name, resource.LARGE_FILE);
                    }
                }

                xhr.onload = function (event) {
                    progressBar.reset (true)
                    if (this.status == 200) {
                        var response = Ext.util.JSON.decode (this.response)
                        if (response.success) {
                            var tree = Ext.getCmp ('reportManager.tree.id')
                            tree.getLoader ().load (tree.root, null, this)
                        } else {
                            import_failure (file.name, response.message);
                        }
                    } else if (this.status == 413) {
                        import_failure (file.name, resource.LARGE_FILE);
                    } else {
                        import_failure (file.name, resource.UNKNOWN_ERROR);
                    }
                }

                xhr.setRequestHeader (
                    'X-CSRFToken', Ext.util.Cookies.get ('csrftoken')
                );

                xhr.send (file);
            },

            failure: function (file) {
                import_failure (file.name, resource.INVALID_FILE);
            }
        });
    }

    function import_failure (filename, message) {
        error_msg (String.format (
            'importing <i>{0}</i> failed: {1}', filename, message
        ));
    }

    // #########################################################################
    // #########################################################################

    function exportReport (url) {

        var statusBar = Ext.getCmp ('status-bar.id');
        var progressBar = Ext.getCmp ('progress-bar.id');

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        disableExport ();

        statusBar.showBusy ({text: 'Please wait ..'});
        progressBar.show ();
        progressBar.setMode ('export');
        progressBar.wait ({
            increment : progressBar.increment,
            interval : progressBar.interval
        });

        var _onSuccess = function (xhr, opts) {
            var body = Ext.getBody()

            var frame_old = Ext.get ('iframe');
            if (frame_old != null) {
                Ext.destroy (frame_old);
            }

            var frame = body.createChild ({
                tag : 'iframe',
                cls : 'x-hidden',
                id : 'iframe',
                name : 'iframe'
            });

            var form = body.createChild ({
                tag : 'form',
                cls : 'x-hidden',
                id : 'form',
                method : 'POST',
                action : url.replace ('=', node.id) + "?fetch",
                target : 'iframe'
            });

            form.insertHtml ('beforeend', CSRF_TOKEN)
            progressBar.reset (true);
            statusBar.clearStatus ({useDefaults:true});
            form.dom.submit ();
            enableExport ();
        }

        var _onFailure = function (xhr, opts, res) {
            progressBar.reset (true);
            statusBar.clearStatus ({useDefaults:true});
            export_failure (res.name, resource.UNKNOWN_ERROR);
            enableExport ();
        }

        Ext.Ajax.request ({
            url : url.replace ('=', node.id),
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)[0];
                    if (res.success) {
                        _onSuccess (xhr, opts);
                    } else {
                        _onFailure (xhr, opts, res)
                    }
                } else {
                    _onFailure (xhr, opts, {name: undefined});
                }
            }
        });
    }

    function exportText () {
        this.fireEvent ('exportReport', urls.exportText)
    }

    function exportLatex () {
        this.fireEvent ('exportReport', urls.exportLatex)
    }

    function exportPdf () {
        this.fireEvent ('exportReport', urls.exportPdf)
    }
    
    function exportHtml () {
        this.fireEvent ('exportReport', urls.exportHtml)
    }

    function getExportButtons () {
        return [
            Ext.getCmp ('btn.export.report-manager.id'),
            Ext.getCmp ('btn.export-latex.report-manager.id'),
            Ext.getCmp ('btn.export-pdf.report-manager.id'),
            Ext.getCmp ('btn.export-html.report-manager.id'),
            Ext.getCmp ('btn.export.editor.id'),
            Ext.getCmp ('btn.export-latex.editor.id'),
            Ext.getCmp ('btn.export-pdf.editor.id'),
            Ext.getCmp ('btn.export-html.editor.id')
        ];
    }

    function enableExport () {
        var buttons = getExportButtons ();
        for (var idx in buttons) {
            if (buttons[idx].enable) { buttons[idx].enable (); }
        }
    }

    function disableExport () {
        var buttons = getExportButtons ();
        for (var idx in buttons) {
            if (buttons[idx].disable) { buttons[idx].disable (); }
        }
    }

    function export_failure (filename, message) {
        error_msg (String.format (
            'exporting <i>{0}</i> failed: {1}', filename, message
        ));
    }

    // #########################################################################
    // #########################################################################

    function openFile () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        dialog.openFile.setTitle ('Open Text/Image File');
        dialog.openFile.setIconClass ('icon-page_white_add-16');
        dialog.openFile.execute ({
            success: openFileOnSuccess,
            failure: openFileOnFailure
        });
    }

    function openFileOnSuccess (file) {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        var newNode = new Ext.tree.TreeNode ({
            'text' : file.name,
            'id' : Math.uuid (),
            'cls' : "file",
            'leaf' : true,
            'expanded' : false
        })

        function getReader (url) {

            var reader = new FileReader ();
            reader.onerror = function (e) {
                open_failure (file.name, resource.READ_ERROR);
            }

            reader.onload = function (e) {
                if (e.loaded >= 524288) {
                    open_failure (file.name, resource.LARGE_FILE);
                    return;
                }

                newNode.attributes['iconCls'] = 'icon-page-16'
                newNode.attributes['data'] = e.target.result

                tree.fireEvent('createNode', newNode, {refNode:node}, {
                    success:function (args) {
                        reportManager.crud.update ({
                            leafId: newNode.id,
                            nodeId: newNode.parentNode.id,
                            name: newNode.text,
                            data: newNode.attributes['data'],
                            rank: newNode.parentNode.indexOf (newNode)
                        }, url);
                    },
                    failure:function (args) {
                        open_failure (file.name, resource.NO_NEW_NODE);
                    }
                });
            }

            return reader;
        }

        if (String (file.type).match (/^image(.*)/)) {
            getReader (urls.updateImage).readAsDataURL (file);
        } else {
            getReader (urls.updateText).readAsText (file);
        }
    }

    function openFileOnFailure () {
        open_failure (undefined, resource.INVALID_FILE);
    }

    function open_failure (filename, message) {
        error_msg (String.format (
            'Opening <i>{0}</i> failed: {1}!', filename, message
        ));
    }

    // #########################################################################
    // #########################################################################

    function saveTab (tab, skipMask) {

        if (tab == undefined) {
            tab = Ext.getCmp ('editor.id').getActiveTab ()
        }

        if (tab == undefined) {
            return;
        }

        var tree = Ext.getCmp ('reportManager.tree.id')
        var node = tree.getNodeById (tab.id)

        if (!tree.isImage (node)) {
            var cm = tab.getEditor ().codeEditor;
            if (cm.dirty) {
                if (skipMask == undefined || skipMask != true) {
                    if (tab.el && tab.el.mask) {
                        tab.el.mask ('Please wait', 'x-mask-loading')
                    }
                }

                var data = (tab.getData)
                    ? tab.getData ()
                    : node.attributes['data']

                reportManager.crud.update ({
                    leafId : node.id,
                    nodeId : node.parentNode.id,
                    name : node.text,
                    data : data ,
                    rank : node.parentNode.indexOf (node)
                }, urls.updateText);

                cm.dirty = false;
            }
        }
    }

    // #########################################################################
    // #########################################################################

    function addReport () {

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
            layout: 'fit',
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
                toc : false,
                index : false,
                content : 'empty'
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
        var model = propertyGrid.getColumnModel();
        model.getColumnById('name').sortable = false;

        var win = new Ext.Window ({

            border : false,
            iconCls : 'icon-report_add-16',
            modal : true,
            resizable : false,
            title : 'Create Report',
            width: 512,

            items : [propertyGrid],

            buttons: [{
                text : 'Create',
                iconCls : 'icon-tick-16',
                handler : function () {
                    tree.el.mask ('Please wait', 'x-mask-loading');
                    var source = propertyGrid.getSource ();
                    reportManager.crud.create (urls.createProject, {
                        nodeId : tree.root.id,
                        data : Ext.encode (source),
                        rank : rank + 1
                    }); win.close ();
                }
            },{
                text : 'Cancel',
                iconCls : 'icon-cross-16',
                handler : function () { win.close (); }
            }]
        });

        win.show (this);
    }

    // #########################################################################
    // #########################################################################

    function addFolder () {

        var tree = Ext.getCmp ('reportManager.tree.id')
        var model = tree.getSelectionModel ()
        var node = model.getSelectedNode ()

        if (node == undefined) {
            return;
        }

        if (node.isLeaf ()) {
            node = node.parentNode
        }

        function callback (btn, text) {
            if (btn == 'ok') {
                tree.el.mask ('Please wait', 'x-mask-loading');
                var rank = node.childNodes.indexOf (node.lastChild);

                reportManager.crud.create (urls.createFolder, {
                    nodeId : node.id,
                    name : text,
                    rank : rank + 1
                });
            }
        }

        prompt_message (
            'Create Folder', 'Enter a name:', callback, null, 'icon-folder_add-16'
        );
    }

    // #########################################################################
    // #########################################################################

    function addTextFile () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        if (node.isLeaf()) {
            node = node.parentNode;
        }

        function callback (btn, text) {
            if (btn == 'ok') {
                tree.el.mask ('Please wait', 'x-mask-loading');
                var rank = node.childNodes.indexOf (node.lastChild);

                reportManager.crud.create (urls.createText, {
                    nodeId : node.id,
                    name : text,
                    rank : rank + 1,
                    data : '..'
                });
            }
        }

        prompt_message (
            'Create Text', 'Enter a name:', callback, null, 'icon-page_add-16'
        );
    }

    // #########################################################################
    // #########################################################################

    function renameSelectedNode () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        var text = node.text
            .replace('<i>','')
            .replace('</i>','');

        function callback (btn, text) {
            if (btn == 'ok') {
                tree.el.mask ('Please wait', 'x-mask-loading');

                var tabs = Ext.getCmp ('editor.id');
                var tab = tabs.findById (node.id);
                if (tab != undefined) {
                    tab.el.mask ('Please wait', 'x-mask-loading');
                }

                if (Math.uuidMatch (node.id)) {
                    node.setText (String.format ("<i>{0}</i>", text));
                    if (tree != undefined) {
                        tree.el.unmask ();
                    }

                    if (tab != undefined) {
                        tab.setTitle (text);
                        tab.el.unmask ();
                    }
                } else {
                    reportManager.crud.rename ({
                        nodeId : node.id,
                        name : text
                    });
                }
            }
        }

        prompt_message (
            'Rename', 'Enter a name:', callback, text, 'icon-document_rename-16'
        );
    }

    // #########################################################################
    // #########################################################################

    function deleteSelectedNode () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        function callback (btn) {
            if (btn != 'yes') {
                return;
            }

            tree.fireEvent (
                'deleteNode', node, {destroy: true}, {
                    success : function (args) {
                        Ext.getCmp ('editor.id').fireEvent (
                            'deleteTab', { 'id' : args.node.id }
                        );

                        reportManager.crud.del ({
                            id : args.node.id
                        });
                    },

                    failure : function (args) {
                        error_msg (resource.NO_NODE);
                    }
                }
            );
        }

        if (tree.isText (node)) {
            var iconCls = 'icon-page_delete-16';
            var element = 'text'
        } else if (tree.isImage (node)) {
            var iconCls = 'icon-picture_delete-16';
            var element = 'image'
        } else if (tree.isFolder (node)) {
            var iconCls = 'icon-folder_delete-16';
            var element = 'folder'
        } else if (tree.isReport (node)) {
            var iconCls = 'icon-report_delete-16';
            var element = 'report'
        } else {
            var iconCls = 'icon-delete-16';
            var element = 'selection'
        }

        confirm_message ('Delete',
            String.format ('Are you sure you want to delete {0}?', element),
            callback, iconCls
        )
    }

    // #########################################################################
    // #########################################################################

    function moveSelectedNodeUp () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        if (tree.isReport (node.previousSibling)) {
            return;
        }

        var pnod = prev (node)
        if (tree.isReport (pnod)) {
            return;
        }

        var move = Ext.getCmp ('btnMoveUp').disable ();
        tree.el.mask ('Please wait', 'x-mask-loading');

        Ext.Ajax.request ({
            params : {id: node.id, jd: pnod.id},
            url : urls.decreaseRank,

            success : function (xhr, opts) {
                if (node.parentNode == pnod.parentNode.parentNode) {
                    pnod.parentNode.insertBefore (node, pnod);
                    pnod.parentNode.insertBefore (pnod, node);
                } else {
                    pnod.parentNode.insertBefore (node, pnod);
                }

                tree.selectPath (node.getPath ());
                tree.el.unmask ();
                move.enable ();
            },

            failure : function (xhr, opts) {
                tree.el.unmask ();
                move.enable ();
                error_msg (resource.MOVE_FAILED);
            }
        });
    }

    function prev (node) {
        var prevSibling = node.previousSibling
        if (prevSibling) {
            return last (prevSibling);
        } else {
            return node.parentNode;
        }
    }

    function last (node) {
        if (node.lastChild) {
            return last (node.lastChild);
        } else {
            return node;
        }
    }

    // #########################################################################
    // #########################################################################

    function moveSelectedNodeDown () {

        var tree = Ext.getCmp ('reportManager.tree.id');
        var model = tree.getSelectionModel ();
        var node = model.getSelectedNode ();

        if (node == undefined) {
            return;
        }

        if (tree.isReport (node.nextSibling)) {
            return;
        }

        var nnod = next (node)
        if (tree.isReport (nnod)) {
            return;
        }

        var move = Ext.getCmp ('btnMoveDown').disable ();
        tree.el.mask ('Please wait', 'x-mask-loading');

        Ext.Ajax.request ({
            params : {id: node.id, jd: nnod.id },
            url : urls.increaseRank,

            success : function (xhr, opts) {
                if (nnod.parentNode == node.parentNode) {
                    nnod.parentNode.insertBefore (nnod, node);
                } else {
                    nnod.parentNode.insertBefore (node, nnod);
                }

                tree.selectPath (node.getPath ());
                tree.el.unmask ();
                move.enable ();
            },

            failure : function (xhr, opts) {
                tree.el.unmask ()
                move.enable ()
                error_msg (resource.MOVE_FAILED);
            }
        });
    }

    function next (node) {
        var nextSibling = node.nextSibling;
        if (nextSibling) {
            return first (nextSibling);
        } else {
            return node.parentNode.nextSibling;
        }
    }

    function first (node) {
        if (node.firstChild) {
            return node.firstChild;
        } else {
            return node;
        }
    }

    // #########################################################################
    // #########################################################################

    var result = new Ext.Panel ({
        title : 'Report Manager',
        id : 'reportManager.id',
        layout : 'fit',

        tools : [{
            id : 'refresh',
            qtip : '<b>Refresh</b><br/>Refresh report manager\'s view',

            handler : function (event, toolEl, panel) {
                var tree = Ext.getCmp ('reportManager.tree.id');
                var model = tree.getSelectionModel ();
                var node = model.getSelectedNode ();
                var loader = tree.getLoader ();

                if (node) {
                    function expand (root) { root.expand (); }
                    loader.load (node.parentNode, expand, this);
                } else {
                    loader.load (tree.root, null, this);
                }
            }
        }],

        tbar : reportManagerTBar,
        items : [reportManager.tree],

        listeners : {
            importReport : importReport,
            exportReport : exportReport,
            exportText : exportText,
            exportLatex : exportLatex,
            exportPdf : exportPdf,
            exportHtml : exportHtml,
            openFile : openFile,
            saveTab : saveTab,
            addReport : addReport,
            addFolder : addFolder,
            addTextFile : addTextFile,
            renameSelectedNode : renameSelectedNode,
            deleteSelectedNode : deleteSelectedNode,
            moveSelectedNodeUp : moveSelectedNodeUp,
            moveSelectedNodeDown : moveSelectedNodeDown
        }
    });

    for (var key in reportManager) {
        result[key] = reportManager[key];
    }

    return result;
}();

// #############################################################################
// #############################################################################
