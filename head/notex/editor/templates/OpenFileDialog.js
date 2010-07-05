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
            wndOpenFileDialog.hide ();
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
                var fileText = file.getAsBinary ()

                if (fileText != null) {

                    var fileInfo = {
                        id      : Math.uuid ()
                      , title   : file.name
                      , text    : fileText.replace (
                            "\n", "<br>", 'g'
                        )
                      , iconCls : 'icon-page'
                    }

                    Ext.getCmp ('pnlReportManagerTreeId').fireEvent (
                        'insertNode', fileInfo, function (result, msg) {
                            if (!result) {
                                Ext.Msg.alert (
                                    "Error",
                                    "No report selected; select a report!"
                                )
                            }
                        }
                    )
                } else {

                    //
                    // @TODO!?
                    //

                }

                wndOpenFileDialog.el.unmask ()
                wndOpenFileDialog.hide ()
            }
        }
    }]

  , execute : function () {

        var inputOpenFile = Ext.getCmp ('inputOpenFileId')
        inputOpenFile.setValue ('')
        this.show ()

    }
});
