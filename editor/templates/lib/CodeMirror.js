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

        function afterrender (ta) {

            CodeMirror.defineMode ("rst-plus", overlays.rstPlus);
            CodeMirror.defineMode ("yaml-plus", overlays.yamlPlus);

            var keymap = {
                'Ctrl-B' : function (cm) { ta.toggleStrong (cm); },
                'Ctrl-I' : function (cm) { ta.toggleItalic (cm); }
            }

            function onCursorActivity (self) {
                self.matchHighlight ("CodeMirror-matchhighlight");
                self.setLineClass (self.hlLine, null, null);
                var cursor = self.getCursor ();
                self.hlLine = self.setLineClass (
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

    function toggleStrong (cm) {
        if (!this.cfgStrong)
            this.cfgStrong = getToggleCfg ('strong', '**', '**');
        this.toggleInline (cm, this.cfgStrong);
    }

    function toggleItalic (cm) {
        if (!this.cfgItalic)
            this.cfgItalic = getToggleCfg ('em', '*', '*');
        this.toggleInline (cm, this.cfgItalic);
    }

    function toggleLiteral (cm) {
        if (!this.cfgLiteral)
            this.cfgLiteral = getToggleCfg ('string', '``', '``');
        this.toggleInline (cm, this.cfgLiteral);
    }

    function toggleSubscript (cm) {
        if (!this.cfgSubscript)
            this.cfgSubscript = getToggleCfg ('string-2', ':sub:`', '`');
        this.toggleInline (cm, this.cfgSubscript);
    }

    function toggleSupscript (cm) {
        if (!this.cfgSupscript)
            this.cfgSupscript = getToggleCfg ('string-2', ':sup:`', '`');
        this.toggleInline (cm, this.cfgSupscript);
    }

    function toggleInline (cm, cfg) {
        if (cm == undefined) cm = this.codeEditor;

        var mode = cm.getOption ('mode');
        if (mode == 'rst' || mode == 'rst-plus') {

            var cur = cm.getCursor ();
            var tok = cm.getTokenAt (cur);
            if (tok.className == cfg.cls && tok.string != cfg.markerEnd) {
                return; // no toggle if not all selected
            }
            if (tok.className != cfg.cls && tok.className) {
                return; // no toggle if something else
            }

            var sel = cm.getSelection ();
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

                cm.replaceSelection (rep);
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

    function refresh (self) {
        if (self.codeEditor) {
            self.codeEditor.refresh ();
        }
    }

    function focus (self) {
        if (self.codeEditor && self.codeEditor.lastCursor) {
            self.codeEditor.setCursor (self.codeEditor.lastCursor);
            Ext.defer (function () { self.codeEditor.focus (); }, 25);
        }
    }

    function blur (self) {
        if (self.codeEditor) {
            self.codeEditor.lastCursor = self.codeEditor.getCursor ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toLowerCase (cm) {
        if (cm == undefined) cm = this.codeEditor;
        var sel = cm.getSelection ();
        cm.replaceSelection (sel.toLowerCase ());
    }

    function toUpperCase (cm) {
        if (cm == undefined) cm = this.codeEditor;
        var sel = cm.getSelection ();
        cm.replaceSelection (sel.toUpperCase ());
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function toggleBulletList (cm) {
        if (cm == undefined) cm = this.codeEditor;

        var sel = cm.getSelection ();
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

        cm.replaceSelection (rep);
        var cur = cm.getCursor ();
        cm.setSelection (cur, cur);
    }

    function toggleNumberList (cm) {
        if (cm == undefined) cm = this.codeEditor;

        var sel = cm.getSelection ();
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

        cm.replaceSelection (rep);
        var cur = cm.getCursor ();
        cm.setSelection (cur, cur);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function decreaseLineIndent (cm) {
        if (cm == undefined) cm = this.codeEditor;
        CodeMirror.commands ['indentLess'](cm);
    }

    function increaseLineIndent (cm) {
        if (cm == undefined) cm = this.codeEditor;
        CodeMirror.commands ['indentMore'](cm);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function insertFigure (cm) {
        if (cm == undefined) cm = this.codeEditor;
    }

    function insertHyperlink (cm) {
        if (cm == undefined) cm = this.codeEditor;
    }

    function insertHorizontalLine (cm) {
        if (cm == undefined) cm = this.codeEditor;

        var cur = cm.getCursor ();
        if (cur.ch > 0) {
            cm.replaceSelection ('\n\n----\n\n');
        } else {
            cm.replaceSelection ('\n----\n\n');
        }

        var cur = cm.getCursor ();
        cm.setSelection (cur, cur);
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return Ext.extend (Ext.form.TextArea, {
        initComponent: initComponent,

        getValue: getValue,
        setValue: setValue,
        setFontSize: setFontSize,

        toggleStrong: toggleStrong,
        toggleItalic: toggleItalic,
        toggleLiteral: toggleLiteral,
        toggleSubscript: toggleSubscript,
        toggleSupscript: toggleSupscript,
        toggleInline: toggleInline,

        toLowerCase: toLowerCase,
        toUpperCase: toUpperCase,

        toggleBulletList: toggleBulletList,
        toggleNumberList: toggleNumberList,

        decreaseLineIndent: decreaseLineIndent,
        increaseLineIndent: increaseLineIndent,

        insertFigure: insertFigure,
        insertHyperlink: insertHyperlink,
        insertHorizontalLine: insertHorizontalLine,

        listeners: {
            refresh: refresh,
            focus: focus,
            blur: blur
        }
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror', Ext.ux.form.CodeMirror);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
