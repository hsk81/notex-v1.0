var editor = function () {

    // #########################################################################
    var tbar_items = [{
    // #########################################################################

        xtype: 'buttongroup',
        title: 'Document',
        columns: 2,
        defaults: { scale: 'large'},
        items: [{
            text : 'Save',
            iconCls : 'icon-disk-32',
            iconAlign: 'left',
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
        },{
            text : 'Open',
            iconCls : 'icon-folder_page-32',
            iconAlign: 'left',
            tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('openFile')
            }
        }]

    },{

        xtype: 'buttongroup',
        title: 'Manage',
        columns: 3,
        defaults: { scale: 'large'},
        items: [{
            text : 'Add',
            iconCls : 'icon-add-32',
            xtype :'splitbutton',
            tooltip : '<b>Add</b><br/>Add a new report, folder or file',
            menu : {
                xtype : 'menu',
                plain : true,

                items : [{
                    iconCls : 'icon-report',
                    text : 'Report',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addReport')
                    }
                },{
                    iconCls : 'icon-folder',
                    text : 'Folder',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addFolder')
                    }
                },{
                    iconCls : 'icon-page',
                    text : 'Plain Text',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addTextFile')
                    }
                }]
            }
        },{
            text : 'Rename',
            iconCls : 'icon-pencil-32',
            iconAlign: 'left',
            tooltip : '<b>Rename</b><br/>Rename selected report, folder or file',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('renameSelectedNode')
            }
        },{
            text : 'Delete',
            iconCls : 'icon-delete-32',
            iconAlign: 'left',
            tooltip : '<b>Delete</b><br/>Delete selected report, folder or file',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('deleteSelectedNode')
            }
        }]

    },{

        xtype: 'buttongroup',
        title: 'Reports',
        columns: 2,
        defaults: { scale: 'large'},
        items: [{
            text: 'Import',
            iconCls: 'icon-page_white_zip-32',
            iconAlign: 'left',
            tooltip : '<b>Import</b><br/>Open a report from a <b>ZIP</b> archive (at <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('importReport')
            }
        },{
            text: 'Export',
            iconCls: 'icon-report_go-32',
            iconAlign: 'left',
            tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportReport', urls.exportReport)
            }
        }]

    },{

        xtype: 'buttongroup',
        title: 'Export as ..',
        columns: 4,
        defaults: { scale: 'large'},
        items: [{
            id : 'btnExportTextId',
            text : 'Text',
            iconCls : 'icon-page_white_text-32',
            iconAlign: 'left',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportText')
            }
        },{
            text : 'LaTex',
            iconCls : 'icon-page_white_code-32',
            iconAlign: 'left',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportLatex')
            }
        },{
            text : 'PDF',
            iconCls : 'icon-page_white_acrobat-32',
            iconAlign: 'left',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportPdf')
            }
        },{
            text : 'HTML',
            iconCls : 'icon-page_white_world-32',
            iconAlign: 'left',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportHtml')
            }
        }]

    }]

    function _restoreScrollPosition (pnlTab) {

        if (pnlTab.scroll) {
            pnlTab.getEditor ().getEl ().scroll ('down', pnlTab.scroll.top);
            pnlTab.getEditor ().getEl ().scroll ('right', pnlTab.scroll.left);
        }
    }

    function _createTextTab (tabInfo) {

        var tab = this.findById (tabInfo.id);
        if (tab) {
            this.activate (tab)
        } else {
            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                layout : 'fit',
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,

                getEditor : function () {
                    return this.findById ('editorId' + tabInfo.id);
                },

                getData : function () {
                    return this.getEditor ().getValue ()
                },

                items : [{
                    xtype : 'textarea',
                    id : 'editorId' + tabInfo.id,
                    anchor : '100% 100%',
                    value : tabInfo.text,
                    style :"font-family:monospace; font-size:12px;"
                }],

                listeners : {
                    activate : function (pnlTab) {
                        _restoreScrollPosition (pnlTab);
                        _selectTreeNode (pnlTab);
                    }
                }
            });

            this.activate (tab)
        }

        if (tabInfo.save) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveTextTab', tab)
        }
    }

    /**
     * @see http://stackoverflow.com/questions/4776670/
     *      should-setting-an-image-src-to-data-url-be-available-immediately
     */
    function _centerImage (pnlTab) {

        var imageEl = pnlTab.getImage ()
        imageEl.dom.onload = function (event) {

            var imgView = pnlTab.getViewer ()
            var innerEl = imgView.el
            var outerEl = Ext.get (innerEl.up ('div').id)

            var W = outerEl.getWidth ()
            var H = outerEl.getHeight ()
            var w = innerEl.getWidth ()
            var h = innerEl.getHeight ()

            var innerDx = (W - w) / 2.0
            var innerDy = (H - h) / 2.0

            imgView.setPosition (innerDx, innerDy)
        }
    }

    function _createImageTab (tabInfo) {

        var tab = this.findById (tabInfo.id);
        if (tab) {
            this.activate (tab)
        } else {
            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,
                bodyStyle : 'background-color: grey;',

                layout : 'hbox',
                layoutConfig : {
                    align : 'middle',
                    pack : 'center'
                },

                getViewer : function () {
                    return Ext.getCmp ('imageBoxId' + tabInfo.id)
                },

                getImage : function () {
                    return Ext.get ('imageId' + tabInfo.id)
                },

                getData : function () {
                    return this.getImage ().dom.src
                },

                items : [{
                    xtype : 'box',
                    id : 'imageBoxId' + tabInfo.id,
                    autoEl : {
                        tag : 'img',
                        id : 'imageId' + tabInfo.id,
                        src : tabInfo.text
                    }
                }],

                listeners : {
                    activate : function (pnlTab) {
                        _centerImage (pnlTab);
                        _selectTreeNode (pnlTab);
                    }
                }
            });

            this.activate (tab)
        }

        if (tabInfo.save) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab', tab)
        }
    }

    function _selectTreeNode (pnlTab) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (pnlTab.id)
        tree.fireEvent ('selectNode', node)
    }

    function _deleteTab (tabInfo) {

        var tab = this.findById (tabInfo.id);
        if (tab) {
            this.remove (tab, true)
        }
    }

    function _beforeTabChange (tabPanel, newTab, curTab) {
        if (curTab) {
            if (curTab.getEditor) {
                var editor = curTab.getEditor ();
                if (editor && editor.getEl) {
                    var element = editor.getEl ();
                    if (element && element.getScroll) {
                        var scroll = element.getScroll ();
                        if (scroll) {
                            curTab.scroll = scroll
                        }
                    }
                }
            }
        }
    }

    function _changeIconClassFrom32To16 (toolbar, lastOverflow) {
        if (lastOverflow) {
            for (var idx in toolbar.items.items) {
                var group = toolbar.items.items[idx]
                if (group.hidden) {
                    var buttons = group.findByType ('button')
                    for (var jdx in buttons) {
                        var button = buttons[jdx]
                        if (button && button.iconCls) {
                            button.iconCls = button.iconCls.replace('-32', '')
                        }
                    }
                }
            }
        }
    }

    return new Ext.TabPanel ({

        activeTab : 0,
        id : 'editor.id',
        enableTabScroll : true,
        tabPosition : 'bottom',

        tbar : {
            items : tbar_items,
            enableOverflow: true,
            listeners: {
                overflowchange : _changeIconClassFrom32To16
            }
        },

        listeners : {
            createTextTab : _createTextTab,
            createImageTab : _createImageTab,
            deleteTab : _deleteTab,
            beforetabchange : _beforeTabChange
        }
    })
}();
