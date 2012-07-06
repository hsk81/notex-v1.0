function getEditorTBar (mode) {

    if (mode != 'rst-plus') {
        return;
    }

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

    return new Ext.Toolbar ({

        enableOverflow : true,

        listeners : {
            overflowchange : toggleButtonText
        },

        items: [{
            iconCls : 'icon-arrow_undo',
            defaults : { text : 'Undo'},
            tooltip : 'Undo',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-arrow_redo',
            defaults : { text : 'Redo'},
            tooltip : 'Redo',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-cut',
            defaults : { text : 'Cut'},
            tooltip : 'Cut Text',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-page_white_copy',
            defaults : { text : 'Copy'},
            tooltip : 'Copy',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-paste_plain',
            defaults : { text : 'Paste'},
            tooltip : 'Paste',
            handler : function (button, event) {}
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
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_italic',
            defaults : { text : 'Emphasis'},
            tooltip : 'Emphasis',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_allcaps',
            defaults : { text : 'Literal'},
            tooltip : 'Literal',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_underline',
            defaults : { text : 'Underline'},
            tooltip : 'Underline',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_strikethroungh',
            defaults : { text : 'Strikethrough'},
            tooltip : 'Strikethrough',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-text_subscript',
            defaults : { text : 'Subscript'},
            tooltip : 'Subscript',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_superscript',
            defaults : { text : 'Superscript'},
            tooltip : 'Superscript',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-text_lowercase',
            defaults : { text : 'Lower Case'},
            tooltip : 'Lower Case',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_uppercase',
            defaults : { text : 'Upper Case'},
            tooltip : 'Upper Case',
            handler : function (button, event) {}
        },'-',{
            iconCls : 'icon-text_list_bullets',
            defaults : { text : 'Bullet List'},
            tooltip : 'Bullet List',
            handler : function (button, event) {}
        },{
            iconCls : 'icon-text_list_numbers',
            defaults : { text : 'Number List'},
            tooltip : 'Number List',
            handler : function (button, event) {}
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
            handler : function (button, event) {}
        }]
    });
}