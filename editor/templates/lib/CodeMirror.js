Ext.namespace ('Ext.ux.form');

Ext.ux.form.CodeMirror = Ext.extend (Ext.form.TextArea, {
    initComponent: function () {
        Ext.ux.form.CodeMirror.superclass.initComponent.apply (this, arguments);

        this.on ({
            resize : function (ta, width, height) {
                if (this.codeEditor) {
                    this.codeEditor.refresh ();
                }
            },

            afterrender : function () {

                CodeMirror.defineMode ("rst-plus", function (config, parserConfig) {
                    var overlay = {
                        startState: function () {
                            return {
                                directive: false
                            }
                        },

                        token: function (stream, state) {
                            var ch;

                            if (stream.match (/^\[(.+?)\]_\s|^\[(.+?)\]_$/)) {
                                return "rst-footnote";
                            }

                            if (stream.match (/^\.\.(\s+)\[(.+?)\]/)) {
                                return "rst-footnote";
                            }

                            while (stream.next () != null) {
                                if (stream.match (/^\[(.+?)\]_/, false)) {
                                    return null;
                                }

                                if (stream.match (/^\.\.(\s+)\[(.+?)\]/, false)) {
                                    return null;
                                }
                            }

                            return null;
                        }
                    };

                    var mode = CodeMirror.getMode (
                        config, parserConfig.backdrop || "text/x-rst"
                    );

                    return CodeMirror.overlayMode (mode, overlay);
                });

                CodeMirror.defineMode ("yaml-plus", function (config, parserConfig) {
                    var overlay = {
                        token: function (stream, state) {
                            var ch;

                            if (stream.match ("${"))
                            {
                                while ((ch = stream.next ()) != null) {
                                    if (ch == "}") { return "yaml-tag"; }
                                }

                                return null;
                            }

                            while (stream.next () != null) {
                                if (stream.match ("${", false)) { break; }
                            }

                            return null;
                        }
                    };

                    var mode = CodeMirror.getMode (
                        config, parserConfig.backdrop || "text/x-yaml"
                    );

                    return CodeMirror.overlayMode (mode, overlay);
                });

                var keymap = {
                    'Ctrl-S' : function (cm) {
                        Ext.getCmp ('reportManager.id').fireEvent ('saveTab');
                    },

                    'Ctrl-O' : function (cm) {
                        Ext.getCmp ('reportManager.id').fireEvent ('openFile');
                    },

                    'Ctrl-B' : function (cm) {
                        var mode = cm.getOption ('mode')
                        if (mode == 'rst' || mode == 'rst-plus') {
                            var cur = cm.getCursor ()
                            var tok = cm.getTokenAt (cur)

                            if (tok.className == 'strong' && tok.string != '**') {
                                return; // no bold toggle if not all selected
                            }
                            if (tok.className == 'em') {
                                return; // no bold toggle if not bold
                            }

                            var sel = cm.getSelection ();
                            if (sel && sel.length > 0) {
                                if (sel.match ('^\\*[^\\*](.*)[^\\*]\\*$')) {
                                    return;
                                }

                                var rep = undefined;
                                if (sel.match ('^\\*\\*(.*)\\*\\*$')) {
                                    rep = sel.replace (/^\*\*/g,'');
                                    rep = rep.replace (/\*\*$/g,'');
                                } else {
                                    rep = String.format ('**{0}**', sel);
                                }

                                cm.replaceSelection (rep);
                            }
                        }
                    },

                    'Ctrl-I' : function (cm) {
                        var mode = cm.getOption ('mode')
                        if (mode == 'rst' || mode == 'rst-plus') {
                            var cur = cm.getCursor ()
                            var tok = cm.getTokenAt (cur)

                            if (tok.className == 'em' && tok.string != '*') {
                                return; // no em toggle if not all selected
                            }
                            if (tok.className == 'strong') {
                                return; // no em toggle if not em
                            }

                            var sel = cm.getSelection ();
                            if (sel && sel.length > 0) {
                                if (sel.match ('^\\*\\*(.*)\\*\\*$')) {
                                    return;
                                }

                                var rep = undefined;
                                if (sel.match ('^\\*(.*)\\*$')) {
                                    rep = sel.replace (/^\*/g,'');
                                    rep = rep.replace (/\*$/g,'');
                                } else {
                                    rep = String.format ('*{0}*', sel);
                                }

                                cm.replaceSelection (rep);
                            }
                        }
                    }
                }

                this.codeEditor = new CodeMirror.fromTextArea (this.el.dom, {
                    autofocus: true,
                    matchBrackets: true,
                    autoClearEmptyLines: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    mode: this.initialConfig.mode,
                    extraKeys: keymap,

                    onCursorActivity: function (self) {
                        self.matchHighlight ("CodeMirror-matchhighlight");
                        self.setLineClass (self.hlLine, null, null);
                        var cursor = self.getCursor ();
                        self.hlLine = self.setLineClass (
                            cursor.line, null, "activeline"
                        );
                    }
                });

                this.codeEditor.hlLine = this.codeEditor.setLineClass (
                    0, "activeline"
                );

                this.codeEditor.setValue (this.initialConfig.value);
                this.setFontSize (this.initialConfig.fontSize);
            }
        });
    },

    getValue: function () {
        if (this.codeEditor) {
            return this.codeEditor.getValue ();
        } else {
            return this.initialConfig.value;
        }
    },

    setValue: function (value) {
        if (this.codeEditor) {
            this.codeEditor.setValue (value);
        }
    },

    setFontSize: function (value) {
        if (this.codeEditor) {
            var codeEditorEl = this.el.next ();
            if (codeEditorEl) {
                codeEditorEl.setStyle ('font-size', value);
                this.codeEditor.refresh ();
            }
        }
    },

    listeners: {
        refresh: function (self) {
            if (self.codeEditor) {
                self.codeEditor.refresh ();
            }
        },

        focus: function (self) {
            if (self.codeEditor && self.codeEditor.lastCursor) {
                self.codeEditor.setCursor (self.codeEditor.lastCursor);
                Ext.defer (function () { self.codeEditor.focus (); }, 25);
            }
        },

        blur: function (self) {
            if (self.codeEditor) {
                self.codeEditor.lastCursor = self.codeEditor.getCursor ();
            }
        }
    }
});

Ext.reg ('ux-codemirror', Ext.ux.form.CodeMirror);