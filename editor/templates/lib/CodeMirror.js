///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.namespace ('Ext.ux.form');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.ux.form.CodeMirror = function () {

    function initComponent () {

        Ext.ux.form.CodeMirror.superclass.initComponent.apply (this, arguments);

        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////

        function resize (ta, width, height) {
            if (this.codeEditor) {
                this.codeEditor.refresh ();
            }
        }

        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////

        var overlays = {
            rstPlus: function (config, parserConfig) {
                var overlay = {
                    token: function (stream, state) {
                        if (stream.match (/^\[(.+?)\]_\s|^\[(.+?)\]_$/))
                            return "rst-footnote";
                        if (stream.match (/^\.\.(\s+)\[(.+?)\]/))
                            return "rst-footnote";

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
            },

            yamlPlus: function (config, parserConfig) {
                var overlay = {
                    token: function (stream, state) {
                        var ch;
                        if (stream.match ("${")) {
                            while ((ch = stream.next ()) != null)
                                if (ch == "}") return "yaml-tag";
                            return null;
                        }

                        while (stream.next () != null)
                            if (stream.match ("${", false)) break;
                        return null;
                    }
                };

                var mode = CodeMirror.getMode (
                    config, parserConfig.backdrop || "text/x-yaml"
                );

                return CodeMirror.overlayMode (mode, overlay);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////

        function afterrender (textarea) {

            CodeMirror.defineMode ("rst-plus", overlays.rstPlus);
            CodeMirror.defineMode ("yaml-plus", overlays.yamlPlus);

            var keymap = {
                'Ctrl-B' : function (codeEditor) { textarea.toggleStrong (); },
                'Ctrl-I' : function (codeEditor) { textarea.toggleItalic (); }
            }

            function onCursorActivity (codeEditor) {
                codeEditor.matchHighlight ("CodeMirror-matchhighlight");
                codeEditor.setLineClass (codeEditor.hlLine, null, null);
                var cursor = codeEditor.getCursor ();
                codeEditor.hlLine = codeEditor.setLineClass (
                    cursor.line, null, "activeline"
                );
            }

            this.codeEditor = new CodeMirror.fromTextArea (
                this.el.dom, {
                    autofocus: true,
                    matchBrackets: true,
                    autoClearEmptyLines: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    mode: this.initialConfig.mode,
                    onCursorActivity: onCursorActivity,
                    extraKeys: keymap
                }
            );

            this.codeEditor.hlLine = this.codeEditor.setLineClass (
                0, "activeline"
            );

            this.codeEditor.setValue (this.initialConfig.value);
            this.setFontSize (this.initialConfig.fontSize);
        }

        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////

        this.on ({
            resize: resize ,
            afterrender: afterrender
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function getValue () {
        if (this.codeEditor) {
            return this.codeEditor.getValue ();
        } else {
            return this.initialConfig.value;
        }
    }

    function setValue (value) {
        if (this.codeEditor) {
            this.codeEditor.setValue (value);
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function focus (delay) {
        if (this.codeEditor) {

            if (this.codeEditor.lastCursor) {
                this.codeEditor.setCursor (this.codeEditor.lastCursor);
            } else {
                this.codeEditor.setCursor (this.codeEditor.getCursor ());
            }

            this.codeEditor.focus (delay);
        }
    }

    function blur () {
        if (this.codeEditor) {
            this.codeEditor.lastCursor = this.codeEditor.getCursor ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function undo () {
        if (this.codeEditor) {
            this.codeEditor.undo ();
        }
    }

    function redo () {
        if (this.codeEditor) {
            this.codeEditor.redo ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function cmdFind () {
        CodeMirror.commands['find'] (this.codeEditor);
    }

    function cmdFindNext () {
        CodeMirror.commands['findNext'] (this.codeEditor);
    }

    function cmdFindPrev () {
        CodeMirror.commands['findPrev'] (this.codeEditor);
    }

    function cmdReplace () {
        CodeMirror.commands['replace'] (this.codeEditor);
    }

    function cmdReplaceAll () {
        CodeMirror.commands['replaceAll'] (this.codeEditor);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function cutToBuffer (buffer, name) {

        var selection = this.codeEditor.getSelection ();
        if (selection) {
            buffer[name] = selection;
            this.codeEditor.replaceSelection ('');
            return true;
        }

        return false;
    }

    function copyToBuffer (buffer, name) {

        var selection = this.codeEditor.getSelection ();
        if (selection) {
            buffer[name] = selection;
            return true;
        }

        return false;
    }

    function pasteFromBuffer (buffer, name) {

        if (buffer[name]) {
            this.codeEditor.replaceSelection (buffer[name]);
            return true;
        }

        return false;
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function applyHeading () {
        // TODO!
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

    function setFontSize (value) {
        if (this.codeEditor) {
            var codeEditorEl = this.el.next ();
            if (codeEditorEl) {
                codeEditorEl.setStyle ('font-size', value);
                this.codeEditor.refresh ();
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return Ext.extend (Ext.form.TextArea, {

        ///////////////////////////////////////////////////////////////////////
        // Generic Interface
        ///////////////////////////////////////////////////////////////////////

        initComponent: initComponent,

        getValue: getValue,
        setValue: setValue,

        listeners: {
            focus: focus,
            blur: blur
        },

        undo: undo,
        redo: redo,

        cmdFind: cmdFind,
        cmdFindNext: cmdFindNext,
        cmdFindPrev: cmdFindPrev,
        cmdReplace: cmdReplace,
        cmdReplaceAll: cmdReplaceAll,

        ///////////////////////////////////////////////////////////////////////
        // NoTex YAML-Plus & RST-Plus specific extensions
        ///////////////////////////////////////////////////////////////////////

        cutToBuffer: cutToBuffer,
        copyToBuffer: copyToBuffer,
        pasteFromBuffer: pasteFromBuffer,

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
        insertHorizontalLine: insertHorizontalLine,

        ///////////////////////////////////////////////////////////////////////
        // NoTex general extensions
        ///////////////////////////////////////////////////////////////////////

        setFontSize: setFontSize
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror', Ext.ux.form.CodeMirror);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
