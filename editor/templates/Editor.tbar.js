function getEditorTBar (mode, editorId) {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    if (mode != 'rst-plus') {
        return;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleButtonText (toolbar, lastOverflow) {
        if (lastOverflow) {
            var buttons = toolbar.items.items;
            for (var idx in buttons) {
                var button = buttons[idx];
                if (button && button.defaults) {
                    button.text = button.defaults.text;
                }
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function undo (button, event) {
        var cm = Ext.getCmp (editorId).codeEditor;
        var historySize = cm.historySize ();
        if (historySize.undo > 1) cm.undo ();
        cm.focus ();
    }

    function redo (button, event) {
        var cm = Ext.getCmp (editorId).codeEditor;
        var historySize = cm.historySize ();
        if (historySize.redo > 0) cm.redo ();
        cm.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function cut (button, event) {
        var cm = Ext.getCmp (editorId).codeEditor;
        var doc = Ext.getDoc ();
        doc.clipboard = cm.getSelection ();
        cm.replaceSelection ('');
        cm.focus ();
    }

    function copy (button, event) {
        var cm = Ext.getCmp (editorId).codeEditor;
        var doc = Ext.getDoc ();
        doc.clipboard = cm.getSelection ();
        cm.focus ();
    }

    function paste (button, event) {
        var cm = Ext.getCmp (editorId).codeEditor;
        var doc = Ext.getDoc ();
        if (doc.clipboard) {
            cm.replaceSelection (doc.clipboard);
            cm.setCursor (cm.getCursor ());
            cm.focus ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function strong (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleStrong ();
        ed.codeEditor.focus ();
    }

    function italic (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleItalic ();
        ed.codeEditor.focus ();
    }

    function literal (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleLiteral ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function subscript (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleSubscript ();
        ed.codeEditor.focus ();
    }

    function supscript (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleSupscript ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function lowercase (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toLowerCase ();
        ed.codeEditor.focus ();
    }

    function uppercase (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toUpperCase ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function bulletlist (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertBulletList ();
        ed.codeEditor.focus ();
    }

    function numberlist (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertNumberList ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return new Ext.Toolbar ({

        editorId : editorId,
        enableOverflow : true,

        listeners : {
            overflowchange : toggleButtonText
        },

        items: [{
            iconCls : 'icon-arrow_undo',
            defaults : { text : 'Undo'},
            tooltip : 'Undo',
            handler : undo
        },{
            iconCls : 'icon-arrow_redo',
            defaults : { text : 'Redo'},
            tooltip : 'Redo',
            handler : redo
        },'-',{
            iconCls : 'icon-cut',
            defaults : { text : 'Cut'},
            tooltip : 'Cut Text',
            handler : cut
        },{
            iconCls : 'icon-page_white_copy',
            defaults : { text : 'Copy'},
            tooltip : 'Copy',
            handler : copy
        },{
            iconCls : 'icon-paste_plain',
            defaults : { text : 'Paste'},
            tooltip : 'Paste',
            handler : paste
        },'-',{
            iconCls : 'icon-text_prose',
            text : 'Paragraph',
            tooltip : 'Document Headers',
            split : true,
            menu: { items: [{
                iconCls : 'icon-text_prose',
                text: 'Paragraph',
                handler : function (button, event) {}
            },'-',{
                iconCls : 'icon-text_heading_1',
                text : 'Parts',
                handler : function (button, event) {}
            },{
                iconCls : 'icon-text_heading_2',
                text : 'Chapters',
                handler : function (button, event) {}
            },{
                iconCls : 'icon-text_heading_3',
                text : 'Sections',
                handler : function (button, event) {}
            },{
                iconCls : 'icon-text_heading_4',
                text : 'Subsections',
                handler : function (button, event) {}
            },{
                iconCls : 'icon-text_heading_5',
                text : 'Sub-Subsections',
                handler : function (button, event) {}
            },'-',{
                iconCls : 'icon-text_heading_6',
                text : 'Rubric Heading',
                handler : function (button, event) {}
            }]}
        },'-',{
            iconCls : 'icon-text_bold',
            defaults : { text : 'Strong Emphasis'},
            tooltip : 'Strong Emphasis',
            handler : strong
        },{
            iconCls : 'icon-text_italic',
            defaults : { text : 'Emphasis'},
            tooltip : 'Emphasis',
            handler : italic
        },{
            iconCls : 'icon-text_allcaps',
            defaults : { text : 'Literal'},
            tooltip : 'Literal',
            handler : literal
        },'-',{
            iconCls : 'icon-text_subscript',
            defaults : { text : 'Subscript'},
            tooltip : 'Subscript',
            handler : subscript
        },{
            iconCls : 'icon-text_superscript',
            defaults : { text : 'Superscript'},
            tooltip : 'Superscript',
            handler : supscript
        },'-',{
            iconCls : 'icon-text_lowercase',
            defaults : { text : 'Lower Case'},
            tooltip : 'Lower Case',
            handler : lowercase
        },{
            iconCls : 'icon-text_uppercase',
            defaults : { text : 'Upper Case'},
            tooltip : 'Upper Case',
            handler : uppercase
        },'-',{
            iconCls : 'icon-text_list_bullets',
            defaults : { text : 'Bullet List'},
            tooltip : 'Bullet List',
            handler : bulletlist
        },{
            iconCls : 'icon-text_list_numbers',
            defaults : { text : 'Number List'},
            tooltip : 'Number List',
            handler : numberlist
        },{
            iconCls : 'icon-text_indent_remove',
            defaults : { text : 'Decrease Indent'},
            tooltip : 'Decrease Indent',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_indent',
            defaults : { text : 'Increase Indent'},
            tooltip : 'Increase Indent',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-text_align_left',
            defaults : { text : 'Align Left'},
            tooltip : 'Align Left',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_align_center',
            defaults : { text : 'Center'},
            tooltip : 'Center',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_align_right',
            defaults : { text : 'Align Right'},
            tooltip : ' Align Right',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_align_justity',
            defaults : { text : 'Justify'},
            tooltip : 'Justify',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-picture',
            defaults : { text : 'Picture'},
            tooltip : 'Picture',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-link',
            defaults : { text : 'Hyperlink'},
            tooltip : 'Hyperlink',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-hrule',
            defaults : { text : 'Horizontal Rule'},
            tooltip : 'Horizontal Rule',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-find',
            defaults : { text : 'Search'},
            tooltip : 'Search',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_replace',
            defaults : { text : 'Replace'},
            tooltip : 'Replace',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-document_page_next',
            defaults : { text : 'Next'},
            tooltip : 'Next',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-document_page_previous',
            defaults : { text : 'Previous'},
            tooltip : 'Previous',
            handler : function (button, event) {
                var cm = Ext.getCmp (editorId).codeEditor;
                CM = cm; console.info (CM);
            }
        }]
    });
}