Ext.ux.form.CodeMirror.mime = function () {

    /**
     * The server backend uses Python's *mimetypes* library to determine the
     * filename to MIME type mapping; unfortunately these do not always
     * correspond the the MIME types with which a particular mode has been
     * registered with.
     *
     * Therefore in such cases we need to fix this by looking up mimetypes'
     * result and manually registering it with the correct mode.
     */

    CodeMirror.defineMIME ('application/x-javascript','javascript');
    CodeMirror.defineMIME ('text/x-tex', 'stex');

    /**
     * First try to map from file extension to mode; if that fails then fall -
     * back to mode resolution from MIME. Improve this list over time if some
     * modes are not activated correctly.
     */

    return {
        ext2mode: function (extension, mime, result) {

            switch (extension) {
                case 'md':
                    result = 'markdown';
                    break;
                default:
                    var mode = CodeMirror.resolveMode (mime);
                    if (mode) { result = mode.name; }
            }

            console.debug ('[ext2mode]', extension, mime, result);
            return result;
        }
    }
}();