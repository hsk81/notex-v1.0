///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.namespace ('Ext.ux.form');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.ux.form.CodeMirror.rest = function () {

    function onAfterRenderBeg (textarea) {

        CodeMirror.defineMode ("rst-plus", function (config, parserConfig) {
            var overlay = {
                token: function (stream, state) {
                    if (stream.match (/^\[(.+?)\]_\s|^\[(.+?)\]_$/))
                        return "rest-footnote";
                    if (stream.match (/^\.\.(\s+)\[(.+?)\]/))
                        return "rest-footnote";

                    while (stream.next () != null) {
                        if (stream.match (/^\[(.+?)\]_/, false))
                            return null;
                        if (stream.match (/^\.\.(\s+)\[(.+?)\]/, false))
                            return null;
                    }

                    return null;
                }
            };

            var mode = CodeMirror.getMode (
                config, parserConfig.backdrop || "text/x-rst"
            );

            return CodeMirror.overlayMode (mode, overlay);
        });

        return {
            extraKeys: {
                'Ctrl-B' : function (codeEditor) { textarea.toggleStrong (); },
                'Ctrl-I' : function (codeEditor) { textarea.toggleItalic (); }
            }
        }
    }

    function onAfterRenderEnd (textarea) {}

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function applyHeading (level) {

        var level2marker = {
            1:'#', 2:'*', 3:'=', 4:'-', 5:'^'
        }

        var marker = level2marker[level];
        if (marker) {

            var sel = this.codeEditor.getSelection ();
            var rep = sel.replace (/\s+$/, '');

            if (rep) {

                var head = ''; for (var idx=0; idx < rep.length; idx++) {
                    head += marker;
                }

                if (level == 1) {
                    this.codeEditor.replaceSelection (String.format (
                        '{1}\n{0}\n\n', head, rep
                    ));
                } else {
                    this.codeEditor.replaceSelection (String.format (
                        '{0}\n{1}\n{0}\n\n', head, rep
                    ));
                }

            }
        } else {
            if (level == 6) {
                var sel = this.codeEditor.getSelection ();
                var rep = sel.replace (/\s+$/, '');

                if (rep) {
                    this.codeEditor.replaceSelection (String.format (
                        '.. rubric:: {0}\n\n', rep
                    ));
                } else {
                    this.codeEditor.replaceSelection (String.format (
                        '.. rubric:: {0}', ''
                    ));
                }
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleStrong () {

        if (!this.cfgStrong) {
            this.cfgStrong = getToggleCfg ('strong', '**', '**');
        }

        toggleInline (this, this.cfgStrong);
    }

    function toggleItalic () {

        if (!this.cfgItalic) {
            this.cfgItalic = getToggleCfg ('em', '*', '*');
        }

        toggleInline (this, this.cfgItalic);
    }

    function toggleLiteral () {

        if (!this.cfgLiteral) {
            this.cfgLiteral = getToggleCfg ('string', '``', '``');
        }

        toggleInline (this, this.cfgLiteral);
    }

    function toggleSubscript () {

        if (!this.cfgSubscript) {
            this.cfgSubscript = getToggleCfg ('string-2', ':sub:`', '`');
        }

        toggleInline (this, this.cfgSubscript);
    }

    function toggleSupscript () {

        if (!this.cfgSupscript) {
            this.cfgSupscript = getToggleCfg ('string-2', ':sup:`', '`');
        }

        toggleInline (this, this.cfgSupscript);
    }

    function toggleInline (textarea, cfg) {

        var mode = textarea.codeEditor.getOption ('mode');
        if (mode == 'rst' || mode == 'rst-plus') {

            var cur = textarea.codeEditor.getCursor ();
            var tok = textarea.codeEditor.getTokenAt (cur);
            if (tok.className == cfg.cls && tok.string != cfg.markerEnd) {
                return; // no toggle if not all selected
            }
            if (tok.className != cfg.cls && tok.className) {
                return; // no toggle if something else
            }

            var sel = textarea.codeEditor.getSelection ();
            if (sel && sel.length > 0) {

                var rep = undefined;
                if (sel.match (cfg.inline)) {
                    rep = sel.replace (cfg.markerBegRx,'');
                    rep = rep.replace (cfg.markerEndRx,'');
                } else {
                    if (sel.match (/^:(.*?):`(.*)`$/)) {
                        return; // no toggle if another
                    } else {
                        rep = String.format (
                            '{0}{1}{2}', cfg.markerBeg, sel, cfg.markerEnd
                        );
                    }
                }

                textarea.codeEditor.replaceSelection (rep);
            }
        }
    }

    function getToggleCfg (cls, beg, end) {
        return {
            cls: cls,
            markerBeg: beg,
            markerEnd: end,
            markerBegRx: new RegExp ('^' + RegExp.quote (beg)),
            markerEndRx: new RegExp (RegExp.quote (end) + '$'),
            inline: new RegExp (
                '^' + RegExp.quote (beg) + '(.*)' + RegExp.quote (end) + '$'
            )
        }
    }

    RegExp.quote = function(str) {
        return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    };

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toLowerCase () {
        var selection = this.codeEditor.getSelection ();
        this.codeEditor.replaceSelection (selection.toLowerCase ());
    }

    function toUpperCase () {
        var selection = this.codeEditor.getSelection ();
        this.codeEditor.replaceSelection (selection.toUpperCase ());
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleBulletList () {

        var sel = this.codeEditor.getSelection ();
        var rep = ''

        if (sel) {
            CodeMirror.splitLines (sel)
                .filter (function (el) { return el; })
                .forEach (function (el) {

                var group = el.match (/^(\s*)(\*)(\s+)/)
                if (group) {
                    rep += group[1] + el.replace (group[0], '') + '\n';
                } else {
                    var group = el.match (/^(\s*)(.*)/)
                    if (group) {
                        rep += String.format (
                            '{0}{1}{2}\n', group[1], '* ', group[2]
                        );
                    }
                }

            });
        } else {
            rep = '* '
        }

        this.codeEditor.replaceSelection (rep);
    }

    function toggleNumberList () {

        var sel = this.codeEditor.getSelection ();
        var rep = ''

        if (sel) {
            CodeMirror.splitLines (sel)
                .filter (function (el) { return el; })
                .forEach (function (el, idx) {

                var group = el.match (/^(\s*)([0-9]+\.)(\s+)/)
                if (group) {
                    rep += group[1] + el.replace (group[0], '') + '\n';
                } else {
                    var group = el.match (/^(\s*)(.*)/)
                    if (group) {
                        rep += String.format (
                            '{0}{1}{2}\n', group[1], (1+idx) + '. ', group[2]
                        );
                    }
                }

            });
        } else {
            rep = '1. '
        }

        this.codeEditor.replaceSelection (rep);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function decreaseLineIndent () {
        CodeMirror.commands ['indentLess'](this.codeEditor);
    }

    function increaseLineIndent () {
        CodeMirror.commands ['indentMore'](this.codeEditor);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var FIGURE_TYPE = 'figure';
    var IMAGE_TYPE = 'image';

    function insertFigure (node) {
        return insertPicture (this, node, FIGURE_TYPE);
    }

    function insertImage (node) {
        return insertPicture (this, node, IMAGE_TYPE);
    }

    function insertPicture (textarea, node, type) {

        var cmbFilename = new Ext.form.ComboBox ({
            id : "cmbFilenameId",
            fieldLabel : 'File',
            name : 'filename',
            allowBlank : false,
            mode : 'local',
            store : [],
            triggerAction : 'all',
            selectOnFocus : true,
            editable : true,
            typeAhead: true,
            emptyText:'select or enter a file name',

            listeners : {
                afterrender : function (component) {
                    var tree = Ext.getCmp ('reportManager.tree.id');
                    if (node) {
                        while (node.parentNode != tree.root) {
                            node = node.parentNode;
                        }
                    } else {
                        node = tree.root;
                    }

                    tree.getAllLeafs (node, function (node, leaf) {
                        if (tree.isImage (leaf)) {
                            var pathNode = node.getPath ('text');
                            var pathLeaf = leaf.getPath ('text').replace (
                                pathNode + '/', ''
                            );

                            component.store.loadData ([[pathLeaf]], true);
                        }
                    });
                }
            }
        });

        Ext.apply(Ext.form.VTypes, {
            natural: function(val, field) { return /^[\d]+$/.test(val); },
            naturalText: 'Not a positive number.',
            naturalMask: /[\d]/i
        });

        var txtScale = new Ext.form.TextField ({
            allowBlank : false,
            fieldLabel : 'Scale [%]',
            id : "txtScaleId",
            name : 'caption',
            value : '100',
            width : '100%',
            vtype : 'natural'
        });

        var cmbAlignment = new Ext.form.ComboBox ({
            id : "cmbAlignmentId",
            fieldLabel : 'Alignment',
            name : 'alignment',
            allowBlank : false,
            store : ['left', 'center', 'right'],
            mode : 'local',
            triggerAction : 'all',
            selectOnFocus : true,
            editable : false,
            value : 'center'
        });

        var txtCaption = new Ext.form.TextArea ({
            id : "txtCaptionId",
            fieldLabel: 'Caption',
            name: 'caption',
            width: '100%',
            emptyText:'optional'
        });

        function onAfterLayout (panel) {

            panel.un ('afterlayout', onAfterLayout);

            var txtScaleWidth = txtScale.getWidth ();
            var cmbFilenameWidth = cmbFilename.getWidth ();
            var cmbAlignmentWidth = cmbAlignment.getWidth ();

            if (cmbFilenameWidth < txtScaleWidth) {
                cmbFilename.setWidth (txtScaleWidth);
            }

            if (cmbAlignmentWidth < txtScaleWidth) {
                cmbAlignment.setWidth (txtScaleWidth);
            }
        }

        var formPanel = new Ext.FormPanel ({
            frame: true,
            items: (type == FIGURE_TYPE)
                ? [cmbFilename, txtScale, cmbAlignment, txtCaption]
                : [cmbFilename, txtScale, cmbAlignment],
            listeners: { afterlayout: onAfterLayout }
        });

        var win = new Ext.Window ({

            border: false,
            iconCls: 'icon-picture_add',
            modal: true,
            resizable: false,
            title: 'Insert ' + (type == FIGURE_TYPE) ? 'Figure' : 'Image',
            width: 384,

            items: [formPanel],

            buttons: [{
                text: 'Insert',
                iconCls: 'icon-tick',
                handler: function () {

                    if (!cmbFilename.validate ()) return;
                    var filename = cmbFilename.getValue ();
                    if (!txtScale.validate ()) return;
                    var scale = txtScale.getValue ();
                    if (!cmbAlignment.validate ()) return;
                    var alignment = cmbAlignment.getValue ();
                    if (!txtCaption.validate ()) return;
                    var caption = txtCaption.getValue ();

                    var rest = (type == FIGURE_TYPE)
                        ? String.format ('\n.. figure:: {0}\n',  filename)
                        : String.format ('\n.. image:: {0}\n',  filename);

                    if (scale)
                        rest += String.format ('   :scale: {0} %\n', scale);

                    if (alignment)
                        rest += String.format ('   :align: {0}\n', alignment);

                    if (caption && (type == FIGURE_TYPE)) {

                        caption = caption.replace (/\n/g, '\n   ');
                        caption = caption.replace (/\s+$/, '');

                        rest += '\n';
                        rest += String.format ('   {0}\n', caption);
                    }

                    textarea.codeEditor.replaceSelection ('\n' + rest + '\n');

                    win.close ();

                    var cur = textarea.codeEditor.getCursor ();
                    textarea.codeEditor.setSelection (cur, cur);
                    textarea.codeEditor.focus ();
                }
            },{
                text: 'Cancel',
                iconCls: 'icon-cross',
                handler: function () { win.close (); }
            }]
        });

        win.show (textarea);
    }

    ///////////////////////////////////////////////////////////////////////////

    function insertHyperlink () {
        var textarea = this;

        var txtUrl = new Ext.form.TextField ({
            fieldLabel: 'URL',
            name: 'url',
            vtype: 'url',
            width: '100%'
        });

        var txtLabel = new Ext.form.TextField ({
            fieldLabel: 'Label',
            name: 'label',
            width: '100%',
            value: this.codeEditor.getSelection (),
            emptyText: 'optional'
        });

        var pnlHyperlink = new Ext.FormPanel ({
            labelWidth: 64,
            frame: true,
            items: [txtUrl, txtLabel]
        });

        var win = new Ext.Window ({

            border: false,
            iconCls: 'icon-link_add',
            modal: true,
            resizable: false,
            title: 'Insert Hyperlink',
            width: 384,

            items: [pnlHyperlink],

            buttons: [{
                text: 'Insert',
                iconCls: 'icon-tick',
                handler: function () {

                    if (!txtUrl.validate ()) return;
                    var url = txtUrl.getValue ();
                    if (!txtLabel.validate ()) return;
                    var label = txtLabel.getValue ();

                    if (label) {
                        textarea.codeEditor.replaceSelection (
                            String.format ('`{0} <{1}>`_', label, url)
                        );
                    } else {
                        if (url) textarea.codeEditor.replaceSelection (url);
                    }

                    win.close ();

                    var cur = textarea.codeEditor.getCursor ();
                    textarea.codeEditor.setSelection (cur, cur);
                    textarea.codeEditor.focus ();
                }
            },{
                text: 'Cancel',
                iconCls: 'icon-cross',
                handler: function () { win.close (); }
            }]
        });

        win.show (this);
        txtUrl.focus (true, 25)
    }

    ///////////////////////////////////////////////////////////////////////////

    function insertHorizontalLine () {

        var cur = this.codeEditor.getCursor ();
        if (cur.ch > 0) {
            this.codeEditor.replaceSelection ('\n\n----\n\n');
        } else {
            this.codeEditor.replaceSelection ('\n----\n\n');
        }

        var cur = this.codeEditor.getCursor ();
        this.codeEditor.setSelection (cur, cur);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return Ext.extend (Ext.ux.form.CodeMirror, {

        onAfterRenderBeg: onAfterRenderBeg,
        onAfterRenderEnd: onAfterRenderEnd,

        applyHeading: applyHeading,

        toggleStrong: toggleStrong,
        toggleItalic: toggleItalic,
        toggleLiteral: toggleLiteral,
        toggleSubscript: toggleSubscript,
        toggleSupscript: toggleSupscript,

        toLowerCase: toLowerCase,
        toUpperCase: toUpperCase,

        toggleBulletList: toggleBulletList,
        toggleNumberList: toggleNumberList,

        decreaseLineIndent: decreaseLineIndent,
        increaseLineIndent: increaseLineIndent,

        insertFigure: insertFigure,
        insertImage: insertImage,
        insertHyperlink: insertHyperlink,
        insertHorizontalLine: insertHorizontalLine
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror-rest', Ext.ux.form.CodeMirror.rest);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
