var wndOpenFileDialog = new Ext.Window ({

    layout    : 'fit'
  , id        : 'wndOpenFileDialogId'
  , title     : 'Open File'
  
  , frame     : true
  , modal     : true
  , draggable : true
  , plain     : false
  , border    : false
  , closable  : false
  , resizable : false

  , items : [{
        
        layout : 'hbox'
      , frame  : true
      , width  : 267
      , height : 36
      , layoutConfig : {
            pack  : 'center'
          , align : 'middle'
        }
      , items : [{
            xtype     : 'textfield'
          , inputType : 'file'
          , id        : 'inputOpenFileId'
        }]
    }]

  , bbar : ['->', {
        text    : 'Cancel'
      , style   : 'padding: 5 0 5 0;'
      , iconCls : 'icon-cross'
      , handler : function (btn) {
            wndOpenFileDialog.hide ()
            wndOpenFileDialog.fireEvent ('cancelSuccess')
        }
    },{
        text    : 'Open'
      , style   : 'padding: 5 0 5 0;'
      , iconCls : 'icon-folder_page'
      , handler : function (btn) {

            var cmp = Ext.getCmp("inputOpenFileId");
            if (cmp.el.dom.files.length > 0) {

                wndOpenFileDialog.el.mask (
                    'Please wait', 'x-mask-loading'
                )

                var file = cmp.el.dom.files[0]
                if (file != null) {
                    wndOpenFileDialog.fireEvent ('openSuccess', file)
                } else {
                    wndOpenFileDialog.fireEvent ('openFailure')
                }

                wndOpenFileDialog.el.unmask ()
                wndOpenFileDialog.hide ()
            }
        }
    }]

  , execute : function (fnOpen, fnCancel) {

        if (fnOpen != undefined) {
            if (fnOpen.success != undefined) {
                this.on ('openSuccess', fnOpen.success, this, {single:true})
            }
            if (fnOpen.failure != undefined) {
                this.on ('openFailure', fnOpen.failure, this, {single:true})
            }
        }

        if (fnCancel != undefined) {
            if (fnCancel.success != undefined) {
                this.on ('cancelSuccess', fnCancel.success, this, {single:true})
            }
            if (fnOpen.failure != undefined) {
                this.on ('cancelFailure', fnCancel.failure, this, {single:true})
            }
        }

        var inputOpenFile = Ext.getCmp ('inputOpenFileId')
        inputOpenFile.setValue ('')
        this.show ()
    }
    
});
