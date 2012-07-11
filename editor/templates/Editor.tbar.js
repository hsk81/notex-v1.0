function editorTBar (mode, tabId, editorId) {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    if (mode != 'rst' && mode != 'rst-plus') {
        return undefined;
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
        var ed = Ext.getCmp (editorId);
        ed.undo (); ed.fireEvent ('focus');
    }

    function redo (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.redo (); ed.fireEvent ('focus');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function cut (button, event) {
        var ed = Ext.getCmp (editorId);
        if (ed.cutToBuffer (document, 'clipboard')) {
            ed.fireEvent ('focus');
        }
    }

    function copy (button, event) {
        var ed = Ext.getCmp (editorId);
        if (ed.copyToBuffer (document, 'clipboard')) {
            ed.fireEvent ('focus');
        }
    }

    function paste (button, event) {
        var ed = Ext.getCmp (editorId);
        if (ed.pasteFromBuffer (document, 'clipboard')) {
            ed.fireEvent ('focus');
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function applyHeading1 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (1);
        ed.fireEvent ('focus');
    }

    function applyHeading2 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (2);
        ed.fireEvent ('focus');
    }

    function applyHeading3 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (3);
        ed.fireEvent ('focus');
    }

    function applyHeading4 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (4);
        ed.fireEvent ('focus');
    }

    function applyHeading5 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (5);
        ed.codeEditor.focus ();
    }

    function applyHeading6 (button, event) {
        var ed = Ext.getCmp (editorId);
        ed.applyHeading (6);
        ed.fireEvent ('focus');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleStrong (button, event) {
        Ext.getCmp (editorId).toggleStrong ();
    }

    function toggleItalic (button, event) {
        Ext.getCmp (editorId).toggleItalic ();
    }

    function toggleLiteral (button, event) {
        Ext.getCmp (editorId).toggleLiteral ();
    }

    function toggleSubscript (button, event) {
        Ext.getCmp (editorId).toggleSubscript ();
    }

    function toggleSupscript (button, event) {
        Ext.getCmp (editorId).toggleSupscript ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toLowerCase (button, event) {
        Ext.getCmp (editorId).toLowerCase ();
    }

    function toUpperCase (button, event) {
        Ext.getCmp (editorId).toUpperCase ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleBulletList (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleBulletList ();
    }

    function toggleNumberList (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.toggleNumberList ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function decLineIndent (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.decreaseLineIndent ();
    }

    function incLineIndent (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.increaseLineIndent ();
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function insertFigure (button, event) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (tabId);

        var ed = Ext.getCmp (editorId)
        ed.insertFigure (node);
        ed.fireEvent ('focus');
    }

    function insertImage (button, event) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (tabId);

        var ed = Ext.getCmp (editorId)
        ed.insertImage (node);
        ed.fireEvent ('focus');
    }

    function insertHyperlink (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertHyperlink ();
    }

    function insertHorizontalLine (button, event) {
        var ed = Ext.getCmp (editorId)
        ed.insertHorizontalLine ();
        ed.fireEvent ('focus');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function find (button, event) {
        Ext.getCmp (editorId).cmdFind ();
    }

    function findNext (button, event) {
        Ext.getCmp (editorId).cmdFindNext ();
    }

    function findPrev (button, event) {
        Ext.getCmp (editorId).cmdFindPrev ();
    }

    function replace (button, event) {
        Ext.getCmp (editorId).cmdReplace ();
    }

    function replaceAll (button, event) {
        Ext.getCmp (editorId).cmdReplaceAll ();
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
            iconCls : 'icon-text_heading_1',
            text : 'Heading',
            tooltip : 'Document Headers',
            split : true,

            handler : function (button, event) {
                var ed = Ext.getCmp (editorId);
                CM = ed.codeEditor; console.info ('[CM]', CM);
            },

            menu: { items: [{
                iconCls : 'icon-text_heading_1',
                text : 'Parts',
                handler : applyHeading1
            },{
                iconCls : 'icon-text_heading_2',
                text : 'Chapters',
                handler : applyHeading2
            },{
                iconCls : 'icon-text_heading_3',
                text : 'Sections',
                handler : applyHeading3
            },{
                iconCls : 'icon-text_heading_4',
                text : 'Subsections',
                handler : applyHeading4
            },{
                iconCls : 'icon-text_heading_5',
                text : 'Sub-Subsections',
                handler : applyHeading5
            },'-',{
                iconCls : 'icon-text_heading_6',
                text : 'Rubric',
                handler : applyHeading6
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
            defaults : { text : 'Find'},
            tooltip : 'Find',
            handler : find
        },{
            iconCls : 'icon-document_page_next',
            defaults : { text : 'Find Next'},
            tooltip : 'Find Next',
            handler : findNext
        },{
            iconCls : 'icon-document_page_previous',
            defaults : { text : 'Find Previous'},
            tooltip : 'Find Previous',
            handler : findPrev
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