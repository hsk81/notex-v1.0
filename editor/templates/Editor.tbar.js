function getEditorTBar (mode, tabId, editorId) {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    if (mode != 'rst-plus') { return; }

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

    function toggleStrong (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleStrong ();
        ed.codeEditor.focus ();
    }

    function toggleItalic (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleItalic ();
        ed.codeEditor.focus ();
    }

    function toggleLiteral (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleLiteral ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleSubscript (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleSubscript ();
        ed.codeEditor.focus ();
    }

    function toggleSupscript (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleSupscript ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toLowerCase (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toLowerCase ();
        ed.codeEditor.focus ();
    }

    function toUpperCase (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toUpperCase ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleBulletList (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleBulletList ();
        ed.codeEditor.focus ();
    }

    function toggleNumberList (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleNumberList ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function decLineIndent (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.decreaseLineIndent ();
        ed.codeEditor.focus ();
    }

    function incLineIndent (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.increaseLineIndent ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function insertFigure (button, event) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (tabId);

        var ed = Ext.getCmp (editorId)
        ed.insertFigure (ed.codeEditor, node);
        ed.codeEditor.focus ();
    }

    function insertImage (button, event) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (tabId);

        var ed = Ext.getCmp (editorId)
        ed.insertImage (ed.codeEditor, node);
        ed.codeEditor.focus ();
    }

    function insertHyperlink (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertHyperlink ();
    }

    function insertHorizontalLine (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertHorizontalLine ();
        ed.codeEditor.focus ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function search (button, event) {
        var ed = Ext.getCmp (editorId);
        CodeMirror.commands['find'] (ed.codeEditor);
    }

    function searchNext (button, event) {
        var ed = Ext.getCmp (editorId);
        CodeMirror.commands['findNext'] (ed.codeEditor);
    }

    function searchPrev (button, event) {
        var ed = Ext.getCmp (editorId);
        CodeMirror.commands['findPrev'] (ed.codeEditor);
    }

    function replaceAll (button, event) {
        var ed = Ext.getCmp (editorId);
        CodeMirror.commands['replaceAll'] (ed.codeEditor);
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
            handler : function (button, event) {
                var ed = Ext.getCmp (editorId);
                CM = ed.codeEditor; console.info ('[CM]', CM);
            },

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
            handler : toggleStrong
        },{
            iconCls : 'icon-text_italic',
            defaults : { text : 'Emphasis'},
            tooltip : 'Emphasis',
            handler : toggleItalic
        },{
            iconCls : 'icon-text_allcaps',
            defaults : { text : 'Literal'},
            tooltip : 'Literal',
            handler : toggleLiteral
        },'-',{
            iconCls : 'icon-text_subscript',
            defaults : { text : 'Subscript'},
            tooltip : 'Subscript',
            handler : toggleSubscript
        },{
            iconCls : 'icon-text_superscript',
            defaults : { text : 'Superscript'},
            tooltip : 'Superscript',
            handler : toggleSupscript
        },'-',{
            iconCls : 'icon-text_lowercase',
            defaults : { text : 'Lower Case'},
            tooltip : 'Lower Case',
            handler : toLowerCase
        },{
            iconCls : 'icon-text_uppercase',
            defaults : { text : 'Upper Case'},
            tooltip : 'Upper Case',
            handler : toUpperCase
        },'-',{
            iconCls : 'icon-text_list_bullets',
            defaults : { text : 'Bullet List'},
            tooltip : 'Bullet List',
            handler : toggleBulletList
        },{
            iconCls : 'icon-text_list_numbers',
            defaults : { text : 'Number List'},
            tooltip : 'Number List',
            handler : toggleNumberList
        },{
            iconCls : 'icon-text_indent_remove',
            defaults : { text : 'Decrease Indent'},
            tooltip : 'Decrease Indent',
            handler : decLineIndent
        },{
            iconCls : 'icon-text_indent',
            defaults : { text : 'Increase Indent'},
            tooltip : 'Increase Indent',
            handler : incLineIndent
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
            defaults : { text : 'Figure'},
            tooltip : 'Figure',
            handler : insertFigure
        },{
            iconCls : 'icon-image',
            defaults : { text : 'Image'},
            tooltip : 'Image',
            handler : insertImage
        },{
            iconCls : 'icon-link',
            defaults : { text : 'Hyperlink'},
            tooltip : 'Hyperlink',
            handler : insertHyperlink
        },{
            iconCls : 'icon-hrule',
            defaults : { text : 'Horizontal Line'},
            tooltip : 'Horizontal Line',
            handler : insertHorizontalLine
        },'-',{
            iconCls : 'icon-find',
            defaults : { text : 'Search'},
            tooltip : 'Search',
            handler : search
        },{
            iconCls : 'icon-document_page_next',
            defaults : { text : 'Next'},
            tooltip : 'Next',
            handler : searchNext
        },{
            iconCls : 'icon-document_page_previous',
            defaults : { text : 'Previous'},
            tooltip : 'Previous',
            handler : searchPrev
        },{
            iconCls : 'icon-text_replace',
            defaults : { text : 'Replace All'},
            tooltip : 'Replace All',
            handler : replaceAll
        }]
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
}