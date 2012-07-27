///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.namespace ('Ext.ux.form');

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.ux.form.CodeMirror.yaml = function () {

    function onAfterRenderBeg (textarea) {

        CodeMirror.defineMode ("yaml-plus", function (config, parserConfig) {
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
        });

        return {
            indentUnit: 4,
            tabSize: 4
        }
    }

    function onAfterRenderEnd (textarea) {}

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    return Ext.extend (Ext.ux.form.CodeMirror, {
        onAfterRenderBeg: onAfterRenderBeg,
        onAfterRenderEnd: onAfterRenderEnd
    });
}();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Ext.reg ('ux-codemirror-yaml', Ext.ux.form.CodeMirror.yaml);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
