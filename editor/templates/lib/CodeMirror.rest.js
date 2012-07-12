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
            indentUnit: 3,
            tabSize: 3,
            extraKeys: {
                'Ctrl-B' : function (codeEditor) { textarea.toggleStrong (); },
                'Ctrl-I' : function (codeEditor) { textarea.toggleItalic (); }
            }
        }
    }

    function onAfterRenderEnd (textarea) {}

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

    function applyHeading (level) {

        var level2marker = {
            1:'#', 2:'*', 3:'=', 4:'-', 5:'^'
        }

        var marker = level2marker[level];
        if (marker) {
            applyHeading1to5.call (this, marker, level);
        } else if (level == 6) {
            applyHeading6.call (this);
        }
    }

    function applyHeading1to5 (marker, level) {
        removeHeading.call (this, function () {
            var sel = this.codeEditor.getSelection();
            if (sel) {

                var head = '';
                var size = (sel.length < 64) ? sel.length : 4;
                for (var idx = 0; idx < size; idx++) head += marker;

                var tpl = (level == 1) ? '{0}\n{1}\n{0}' : '{1}\n{0}';
                var cur = this.codeEditor.getCursor (true);

                this.codeEditor.replaceSelection(String.format(
                    tpl, head, sel
                ));

                this.codeEditor.setSelection (cur, cur);
            }
        });
    }

    function applyHeading6 () {
        removeHeading.call (this, function () {
            var sel = this.codeEditor.getSelection();
            var rep = sel.replace(/\s+$/, '');
            var tpl = '.. rubric:: {0}';

            var cur = this.codeEditor.getCursor (true);
            if (cur.ch > 0) tpl = '\n\n' + tpl;
            else if (cur.line > 0) tpl = '\n' + tpl;

            this.codeEditor.replaceSelection (String.format(
                tpl, rep
            ));

            this.codeEditor.setSelection (cur, cur);
        });
    }

    function removeHeading (callback) {

        var beg = this.codeEditor.getCursor (true);
        var end = this.codeEditor.getCursor ();

        var prev3 = this.codeEditor.getTokenAt ({line:end.line - 3,ch:1});
        var prev2 = this.codeEditor.getTokenAt ({line:end.line - 2,ch:1});
        var prev1 = this.codeEditor.getTokenAt ({line:end.line - 1,ch:1});
        var line0 = this.codeEditor.getTokenAt ({line:end.line,    ch:1});
        var next1 = this.codeEditor.getTokenAt ({line:end.line + 1,ch:1});
        var next2 = this.codeEditor.getTokenAt ({line:end.line + 2,ch:1});

        prev3.line = end.line - 3;
        prev2.line = end.line - 2;
        prev1.line = end.line - 1;
        line0.line = end.line;
        next1.line = end.line + 1;
        next2.line = end.line + 2;

        var upper;
        var lower;

        if (prev3 && prev3.className == 'header')
            if (upper) { lower = prev3; } else { upper = prev3; }
        if (prev2 && prev2.className == 'header')
            if (upper) { lower = prev2; } else { upper = prev2; }
        if (prev1 && prev1.className == 'header')
            if (upper) { lower = prev1; } else { upper = prev1; }
        if (line0 && line0.className == 'header')
            if (upper) { lower = line0; } else { upper = line0; }
        if (next1 && next1.className == 'header')
            if (upper) { lower = next1; } else { upper = next1; }
        if (next2 && next2.className == 'header')
            if (upper) { lower = next2; } else { upper = next2; }

        var selection = this.codeEditor.getSelection ();
        if (selection) {

            var text = this.codeEditor.getLine (beg.line);
            if (text.match (/.. rubric::/)) {
                this.codeEditor.replaceSelection (
                    text.replace (/.. rubric::(\s*)/, ''));
            }

            else if (selection.match (/.. rubric::/)) {
                this.codeEditor.replaceSelection (
                    selection.replace (/.. rubric::(\s*)/, ''));
            }

            else {
                if (prev3 && prev3.className == 'header' && !lower) return;
                if (prev2 && prev2.className == 'header' && !lower) return;

                if (lower) this.codeEditor.removeLine (lower.line);
                if (upper) this.codeEditor.removeLine (upper.line);

                if (upper && lower) {
                    this.codeEditor.setCursor ({line:upper.line, ch:0});
                } else {
                    if (upper || lower) {
                        if (upper)
                            this.codeEditor.setCursor ({line:upper.line-1, ch:0});
                        if (lower)
                            this.codeEditor.setCursor ({line:lower.line-1, ch:0});
                    } else {
                        if (beg.line == end.line)
                            this.codeEditor.setCursor ({line:beg.line-0, ch:0});
                        else
                            this.codeEditor.setCursor ({line:end.line-1, ch:0});
                    }
                }
            }

            Ext.defer (function () {
                var curr = this.codeEditor.getCursor ();
                var text = this.codeEditor.getLine (curr.line);

                this.codeEditor.setSelection (
                    {line:curr.line, ch:0}, {line:curr.line, ch:text.length}
                );

                callback.call (this);
            }, 25, this)
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

    function insertFootnote () {
        var cur = this.codeEditor.getCursor ();

        var rng = this.codeEditor.getRange (
            {line:cur.line, ch: cur.ch-1},
            {line:cur.line, ch: cur.ch+1}
        );

        var prefix = (rng.match (/^\s/) || (cur.ch -1 < 0))
            ? '' : ' ';
        var suffix = (rng.match (/\s$/))
            ? '' : ' ';
        var anchor = String.format (
            '{0}{1}{2}', prefix, '[#]_', suffix
        );

        if (this.codeEditor.lineCount () <= cur.line+1) {
            this.codeEditor.replaceSelection (anchor + '\n');
            this.codeEditor.setCursor ({line:cur.line+1,ch:0})
            this.codeEditor.replaceSelection ('\n.. [#] \n');
        } else {
            this.codeEditor.replaceSelection (anchor);
            this.codeEditor.setCursor ({line:cur.line+1,ch:0})
            this.codeEditor.replaceSelection ('\n.. [#] \n');

            var nxt = this.codeEditor.getCursor ();
            this.codeEditor.setCursor (nxt);

            if (this.codeEditor.getLine (nxt.line)) {
                this.codeEditor.replaceSelection ('\n');
            }
        }

        this.codeEditor.setCursor ({line:cur.line+2,ch:7});
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
        insertFootnote: insertFootnote,
        insertHorizontalLine: insertHorizontalLine
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror-rest', Ext.ux.form.CodeMirror.rest);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
