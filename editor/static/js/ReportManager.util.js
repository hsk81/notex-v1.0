var reportManagerUtil = function () {

    function prompt_message (title, message, callback, text, iconCls) {
        if (iconCls == undefined) {
            iconCls = 'icon-document-16';
        }

        Ext.MessageBox.show({
            title: title,
            msg: message,
            buttons: Ext.MessageBox.OKCANCEL,
            iconCls: iconCls,
            minWidth: 256,
            prompt: true,
            value: text,
            fn: callback
        });
    }

    function error_message (message) {
        Ext.MessageBox.show ({
            title : "Error",
            msg : message,
            buttons: Ext.Msg.OK,
            iconCls : 'icon-error-16'
        });
    }

    var resource = {
        INVALID_FILE: 'no file or invalid file type',
        LARGE_FILE: 'file size exceeds 512 KB',
        NO_REPORT: 'no report selected',
        NO_NEW_NODE: 'no new node created',
        NO_NODE: 'no node selected',
        MOVE_FAILED: 'moving failed',
        READ_ERROR: 'cannot read file',
        UNKNOWN_ERROR: 'unknown error',

        CREATE_ERROR: 'create error for <i>{0}</i>',
        READ_ERROR: 'read error for <i>{0}</i>',
        UPDATE_ERROR: 'update error for <i>{0}</i>',
        DELETE_ERROR: 'delete error for <i>{0}</i>'
    }

    return {
        prompt_message: prompt_message,
        error_message: error_message,
        resource: resource
    };

}();