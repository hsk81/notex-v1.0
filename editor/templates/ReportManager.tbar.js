var reportManagerTBar = function () {

    return { items: [{
        iconCls : 'icon-disk',
        tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)',
        handler : function (button, event) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveTab')
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
            Ext.getCmp ('reportManager.id').fireEvent ('exportText')
        },

        menu : {
            xtype : 'menu',
            plain : true,

            items : [{
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
    }]};
}();