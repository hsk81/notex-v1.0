var dialogOpenFile = new Ext.Window ({

    layout : 'fit',
    id : 'dialog.openFile.id',

    border : false,
    iconCls : 'icon-add-16',
    modal : true,
    resizable : false,
    title : 'Open file',
    width : 320,

    items : [{
        width : 320,
        height : 36,
        layout : 'hbox',
        frame : true,
        layoutConfig : {
            pack : 'left',
            align : 'middle'
        },
        items : [{
            xtype : 'textfield',
            id : 'inputOpenFileId',
            width : 296,
            autoCreate : {
                tag: 'input', type: 'file', size: '24', autocomplete: 'off'
            }
        }]
    }],

    buttons : [{
        text : 'Open',
        iconCls : 'icon-tick-16',
        handler : function (btn) {

            var cmp = Ext.getCmp("inputOpenFileId");
            if (cmp.el.dom.files.length > 0) {

                dialogOpenFile.el.mask ('Please wait', 'x-mask-loading');

                var file = cmp.el.dom.files[0];
                if (file != null) {
                    dialogOpenFile.fireEvent ('openSuccess', file);
                } else {
                    dialogOpenFile.fireEvent ('openFailure');
                }

                dialogOpenFile.el.unmask ();
                dialogOpenFile.hide ();
            }
        }
    },{
        text : 'Cancel',
        iconCls : 'icon-cross-16',
        handler : function (btn) {
            dialogOpenFile.hide ();
            dialogOpenFile.fireEvent ('cancelSuccess');
        }
    }],

    execute : function (fnOpen, fnCancel) {

        if (fnOpen != undefined) {
            if (fnOpen.success != undefined) {
                this.on ('openSuccess', fnOpen.success, this, {single:true});
            }
            if (fnOpen.failure != undefined) {
                this.on ('openFailure', fnOpen.failure, this, {single:true});
            }
        }

        if (fnCancel != undefined) {
            if (fnCancel.success != undefined) {
                this.on (
                    'cancelSuccess', fnCancel.success, this, {single:true}
                );
            }
            if (fnOpen.failure != undefined) {
                this.on (
                    'cancelFailure', fnCancel.failure, this, {single:true}
                );
            }
        }

        var inputOpenFile = Ext.getCmp ('inputOpenFileId');
        inputOpenFile.setValue ('');
        this.show ();
    }
});