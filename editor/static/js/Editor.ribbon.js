var editorRibbon = function () {

    function changeIconClassFrom32To16 (toolbar, lastOverflow) {
        if (lastOverflow) {
            for (var idx in toolbar.items.items) {
                var group = toolbar.items.items[idx]
                if (group.hidden) {
                    var buttons = group.findByType ('button')
                    for (var jdx in buttons) {
                        var button = buttons[jdx]
                        if (button && button.iconCls) {
                            button.iconCls = button.iconCls.replace('', '')
                        }
                    }
                }
            }
        }
    }

    return new Ext.Toolbar ({ enableOverflow : true, items : [{

        xtype: 'buttongroup',
        title: 'Document',
        columns: 2,
        defaults: { scale: 'small' },

        items: [{
            text : 'Save',
            iconCls : 'icon-disk-16',
            iconAlign: 'left',
            tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('saveTab');
            }
        },{
            text : 'Open',
            iconCls : 'icon-folder_page-16',
            iconAlign: 'left',
            tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('openFile');
            }
        }]

    },{

        xtype: 'buttongroup',
        title: 'Manage',
        columns: 3,
        defaults: { scale: 'small' },
        items: [{
            text : 'Add',
            iconCls : 'icon-add-16',
            xtype :'splitbutton',
            tooltip : '<b>Add</b><br/>Add a new report, folder or file',
            menu : {
                xtype : 'menu',
                plain : true,

                items : [{
                    iconCls : 'icon-report-16-sprite',
                    text : 'Report',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addReport')
                    }
                },{
                    iconCls : 'icon-folder-16-sprite',
                    text : 'Folder',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addFolder')
                    }
                },{
                    iconCls : 'icon-page-16',
                    text : 'Plain Text',
                    handler : function (button, event) {
                        Ext.getCmp ('reportManager.id').fireEvent ('addTextFile')
                    }
                }]
            }
        },{
            text : 'Rename',
            iconCls : 'icon-pencil-16',
            iconAlign: 'left',
            tooltip : '<b>Rename</b><br/>Rename selected report, folder or file',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('renameSelectedNode')
            }
        },{
            text : 'Delete',
            iconCls : 'icon-delete-16',
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
        defaults: { scale: 'small' },
        items: [{
            text: 'Import',
            iconCls: 'icon-page_white_zip-16',
            iconAlign: 'left',
            tooltip : '<b>Import</b><br/>Open a report from a <b>ZIP</b> archive (at <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('importReport')
            }
        },{
            id : 'btn.export.editor.id',
            text: 'Export',
            iconCls: 'icon-report_go-16',
            iconAlign: 'left',
            tooltip : '<b>Export Text & Images</b><br/>Save selected report (to <i>local</i> storage)',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportText')
            }
        }]

    },{

        xtype: 'buttongroup',
        title: 'Export as ..',
        columns: 3,
        defaults: { scale: 'small' },
        items: [{
            id : 'btn.export-latex.editor.id',
            text : 'LaTex',
            iconCls : 'icon-page_white_code-16',
            iconAlign: 'left',
            tooltip : '<b>Export LaTex</b><br/>Convert selected report to LaTex',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportLatex')
            }
        },{
            id : 'btn.export-pdf.editor.id',
            text : 'PDF',
            iconCls : 'icon-page_white_acrobat-16',
            iconAlign: 'left',
            tooltip : '<b>Export PDF</b><br/>Convert selected report to PDF',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportPdf')
            }
        },{
            id : 'btn.export-html.editor.id',
            text : 'HTML',
            iconCls : 'icon-page_white_world-16',
            iconAlign: 'left',
            tooltip : '<b>Export</b><br/>Convert selected report to HTML',
            handler : function (button, event) {
                Ext.getCmp ('reportManager.id').fireEvent ('exportHtml')
            }
        }]

    }], listeners: { overflowchange : changeIconClassFrom32To16}});
}();