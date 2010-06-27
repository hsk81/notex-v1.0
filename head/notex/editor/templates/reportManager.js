/**
 * pnlTree --------------------------------------------------------------------
 */

var pnlTree = new Ext.tree.TreePanel ({
    id          : 'pnlTreeId'
  , autoScroll  : true
  , rootVisible : false

  , loader : new Ext.tree.TreeLoader({
        url : '{% url editor:post.tree %}'
    })

  , root : {
        text     : 'Root'
      , id       : 'LMRHE33POQRCYIC3LVOQ====' //[u'root', []]
      , cls      : 'folder'
      , iconCls  : 'icon-folder'
      , expanded : true
    }

  , listeners : {
        dblclick : function (node, event) {
            if (node.attributes['cls'] == "file") {

                var tabInfo = {
                    id      : node.id,
                    title   : node.attributes['text'],
                    text    : node.attributes['data'],
                    iconCls : node.attributes['iconCls']
                }

                Ext.getCmp ('pnlEditorTabsId').fireEvent (
                    'insertTab', tabInfo
                )
            }
        }

      , insertNode : function (nodeInfo) {

            var selectionModel = this.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()

            if (selectedNode != undefined) {
                if (selectedNode.isLeaf ()) {
                    var parentNode = selectedNode.parentNode
                    if (parentNode != undefined) {

                        var node = new Ext.tree.TreeNode ({
                            'text'     : nodeInfo.title,
                            'data'     : nodeInfo.text,
                            'id'       : nodeInfo.id,
                            'cls'      : "file",
                            'iconCls'  : nodeInfo.iconCls,
                            'leaf'     : true,
                            'expanded' : false
                        })

                        parentNode.insertBefore(node, null)
                    } else {
                        //
                        // @TODO!
                        //
                    }
                } else {
                    //
                    // @TODO!
                    //
                }
            } else {
                //
                // @TODO!
                //
            }
        }
    }
});

/**
 * wndOpenFile ----------------------------------------------------------------
 */

var wndOpenFile = new Ext.Window ({

    layout    : 'fit'
  , id        : 'wndOpenFileId'
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
            wndOpenFile.hide ();
        }
    },{
        text    : 'Open'
      , style   : 'padding: 5 0 5 0;'
      , iconCls : 'icon-folder_page'
      , handler : function (btn) {

            var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
            var pnlTree = Ext.getCmp ('pnlTreeId')

            var cmp = Ext.getCmp("inputOpenFileId");
            if (cmp.el.dom.files.length > 0) {

                wndOpenFile.el.mask (
                    'Please wait', 'x-mask-loading'
                )

                var file = cmp.el.dom.files[0]
                var fileText = file.getAsBinary ()

                if (fileText != undefined) {

                    var fileInfo = {
                        id      : 0,
                        title   : String.format (
                            "<i>{0}</i>", file.name
                        ),
                        text    : fileText.replace (
                            "\n", "<br>", 'g'
                        ),
                        iconCls : 'icon-page'
                    }

                    pnlTree.fireEvent (
                        'insertNode', fileInfo
                    )

                    pnlEditorTabs.fireEvent (
                        'insertTab', fileInfo
                    )
                }

                wndOpenFile.el.unmask ()
                wndOpenFile.hide ()
            }
        }
    }]

  , execute : function () {

        var inputOpenFile = Ext.getCmp ('inputOpenFileId')
        inputOpenFile.setValue ('')
        this.show ()

    }
});

/**
 * pnlReportManager -----------------------------------------------------------
 */

var pnlReportManager = {
    title  : 'Report Manager'
  , layout : 'fit'

  , tools  : [{
        id      : 'refresh'
      , qtip    : '<b>Refresh</b><br/>Refresh report manager\'s view'
      , handler : function (event, toolEl, panel) {
            //@TODO!
        }
    }]

  , tbar : {
        items : [{
            iconCls : 'icon-disk_download'
          , tooltip : '<b>Import</b><br/>Open a report (from <i>local</i> storage)'
        },{
            iconCls : 'icon-disk_upload'
          , tooltip : '<b>Export</b><br/>Save selected report (to <i>local</i> storage)'
        },'-',{
            iconCls : 'icon-folder_page'
          , tooltip : '<b>Open</b><br/>Open a text or image file (from <i>local</i> storage)'
          , handler : function (button, event) {

                wndOpenFile.execute ()

            }
        },{
            iconCls : 'icon-disk'
          , tooltip : '<b>Save</b><br/>Save selected file (to <i>remote</i> storage)'
          , handler : function (button, event) {

                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')
                var tab = pnlEditorTabs.getActiveTab ()
                if (tab != undefined)
                {
                    tab.el.mask ('Please wait', 'x-mask-loading')

                    var tree = Ext.getCmp ('pnlTreeId')
                    var node = tree.getNodeById (tab.id)

                    Ext.Ajax.request ({
                        url: urls.save
                      , params: {
                            'id'   : node.id
                          , 'data' : tab.findById ('htmlEditorId').getValue ()
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )
                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            var tree = Ext.getCmp ('pnlTreeId')
                            var node = tree.getNodeById (tab.id)
                            node.attributes['data'] = tab.getData ()
                        }

                      , failure: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )
                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            Ext.MessageBox.show ({
                                title    : 'Saving failed'
                              , msg      : String.Format(
                                    "Saving failed for tab '{0}'!"
                                  , tab.title)
                              , closable : false
                              , width    : 256
                              , buttons  : Ext.MessageBox.OK
                            })
                        }
                    })
                }
            }
        },{
            iconCls : 'icon-disk_multiple'
          , tooltip : '<b>Save All</b><br/>Save all files (to <i>remote</i> storage)'
          , handler : function (button, event) {

                var pnlEditorTabs = Ext.getCmp ('pnlEditorTabsId')

                for (var jdx=0; jdx<pnlEditorTabs.items.length; jdx++) {
                    pnlEditorTabs.items.items[jdx].el.mask (
                        'Please wait', 'x-mask-loading'
                    )
                }

                for (var idx=0; idx<pnlEditorTabs.items.length; idx++) {
                    var tab = pnlEditorTabs.items.items[idx]
                    Ext.Ajax.request ({
                        url: urls.save
                      , params: {
                            'id'   : tab.id
                          , 'data' : tab.getData ()
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )
                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            var tree = Ext.getCmp ('pnlTreeId')
                            var node = tree.getNodeById (tab.id)
                            node.attributes['data'] = tab.getData ()
                        }

                      , failure: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )
                            var tab = pnlEditorTabs.findById (res.id)
                            tab.el.unmask ()

                            Ext.MessageBox.show ({
                                title    : 'Saving failed'
                              , msg      : String.Format(
                                    "Saving failed for tab '{0}'!"
                                  , tab.title
                              )
                              , closable : false
                              , width    : 256
                              , buttons  : Ext.MessageBox.OK
                            })
                        }
                    })
                }
            }
        },'-',{
            iconCls : 'icon-add'
          , tooltip : '<b>Add</b><br/>Add a new report, folder or file'
          , split   : true
          , menu    : {
              xtype : 'menu'
            , plain : true

            , items : [{
                  iconCls : 'icon-report'
                , text    : 'Report'
              },{
                  iconCls : 'icon-folder'
                , text    : 'Folder'
              },{
                  iconCls : 'icon-page'
                , text    : 'Plain Text'
              },'-',{
                  iconCls : 'icon-image'
                , text    : 'Image'
              }]

            }
        },{
            iconCls : 'icon-pencil'
          , tooltip : '<b>Rename</b><br/>Rename selected report, folder or file'
        },{
            iconCls : 'icon-delete'
          , tooltip : '<b>Delete</b><br/>Delete selected report, folder or file'
        },'-',{
            iconCls : 'icon-arrow_up'
          , tooltip : '<b>Move Up</b><br/>Move selected report, folder or file up in tree'
        },{
            iconCls : 'icon-arrow_down'
          , tooltip : '<b>Move Down</b><br/>Move selected report, folder or file down in tree'
        }]
    }

  , items : [pnlTree]
}
