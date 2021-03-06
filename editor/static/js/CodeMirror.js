///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.namespace ('Ext.ux.form');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.ux.form.CodeMirror = function () {

    function initComponent () {

        Ext.ux.form.CodeMirror.superclass.initComponent.apply (
            this, arguments
        );

        this.addEvents ('cursor');
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function afterrender (textarea) {

        var configuration = this.onAfterRenderBeg (textarea);

        function onCursorActivity (cm) {
            cm.setLineClass (cm.hlLine, null, null);
            var cursor = cm.getCursor ();
            cm.hlLine = cm.setLineClass (cursor.line, null, "activeline");
            textarea.fireEvent ('cursor', cm.getCursor ());
        }

        var options = {
            autoClearEmptyLines: true,
            lineWrapping: true,
            lineNumbers: true,
            matchBrackets: true,
            mode: this.initialConfig.mode,
            onCursorActivity: onCursorActivity,
            onChange: function (cm, ctx) {
                cm.dirty = true;
            }
        }

        if (configuration)
            for (var key in configuration)
                options[key] = configuration[key];

        this.codeEditor = new CodeMirror.fromTextArea (
            this.el.dom, options
        );

        this.codeEditor.hlLine = this.codeEditor.setLineClass (
            0, "activeline"
        );

        this.codeEditor.setValue (this.initialConfig.value);
        this.setFontSize (this.initialConfig.fontSize);

        this.onAfterRenderEnd (textarea);
    }

    function onAfterRenderBeg (textarea) {}
    function onAfterRenderEnd (textarea) {}

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function focus (ms) {
        if (this.codeEditor) {

            if (this.codeEditor.lastCursor) {
                this.codeEditor.setCursor (this.codeEditor.lastCursor);
            } else {
                this.codeEditor.setCursor (this.codeEditor.getCursor ());
            }

            if (ms) {
                Ext.defer (function () { this.codeEditor.focus (); }, ms, this);
            } else {
                Ext.defer (function () { this.codeEditor.focus (); }, 25, this);
            }
        }
    }

    function blur () {
        if (this.codeEditor) {
            this.codeEditor.lastCursor = this.codeEditor.getCursor ();
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    function refresh () {
        if (this.codeEditor) {
            this.codeEditor.refresh ();
        }
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

    function getCursor (flag) {
        if (this.codeEditor) {
            return this.codeEditor.getCursor (flag);
        }
    }

    function setCursor (value) {
        if (this.codeEditor) {
            return this.codeEditor.setCursor (value);
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
        CodeMirror.commands['find'] (this.codeEditor, 'alpha');
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

    function setFontSize (value, index) {
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

        onAfterRenderBeg: onAfterRenderBeg,
        onAfterRenderEnd: onAfterRenderEnd,

        listeners: {
            afterrender: afterrender,
            blur: blur,
            focus: focus,
            refresh: refresh,
            resize: refresh
        },

        getValue: getValue,
        setValue: setValue,

        getCursor: getCursor,
        setCursor: setCursor,

        undo: undo,
        redo: redo,

        cmdFind: cmdFind,
        cmdFindNext: cmdFindNext,
        cmdFindPrev: cmdFindPrev,
        cmdReplace: cmdReplace,
        cmdReplaceAll: cmdReplaceAll,

        setFontSize: setFontSize
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror', Ext.ux.form.CodeMirror);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
