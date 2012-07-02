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
                this.codeEditor = new CodeMirror.fromTextArea (this.el.dom, {
                    autofocus: true,
                    matchBrackets: true,
                    autoClearEmptyLines: true,
                    lineWrapping: true,
                    lineNumbers: true,
                    mode: this.initialConfig.mode,

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