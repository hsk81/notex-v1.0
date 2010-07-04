/**
 * pnlTree --------------------------------------------------------------------
 */

var pnlTree = new Ext.tree.TreePanel ({
    id          : 'pnlTreeId'
  , autoScroll  : true
  , rootVisible : false

  , loader : new Ext.tree.TreeLoader({
        url : '{% url editor:post.read %}'
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
                    id      : node.id
                  , title   : node.attributes['text']
                  , text    : node.attributes['data']
                  , iconCls : node.attributes['iconCls']
                }

                Ext.getCmp ('pnlEditorTabsId').fireEvent (
                    'insertTab', tabInfo
                )
            }
        }

      , removeNode : function (fnCallback) {

            var selectionModel = this.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()

            if (selectedNode != null) {

                selectedNode.remove (false)
                if (fnCallback != undefined) {
                    fnCallback (true, {'nodeId': selectedNode.id})
                }                
                selectedNode.remove (true)

            } else {
                if (fnCallback != undefined) {
                    fnCallback (false, {'msg': 'no node selected'})
                }
            }
        }

      , insertNode : function (nodeInfo, fnCallback) {

            var selectionModel = this.getSelectionModel ()
            var selectedNode = selectionModel.getSelectedNode ()

            if (selectedNode != null) {

                var fn = function (nodeInfo, node) {

                    node.insertBefore(
                        new Ext.tree.TreeNode ({
                            'text'     : nodeInfo.title
                          , 'data'     : nodeInfo.text
                          , 'id'       : nodeInfo.id
                          , 'cls'      : "file"
                          , 'iconCls'  : nodeInfo.iconCls
                          , 'leaf'     : true
                          , 'expanded' : false
                        }), null
                    )

                    Ext.getCmp ('pnlEditorTabsId').fireEvent (
                        'insertTab', nodeInfo
                    )

                    if (fnCallback != undefined) {
                        fnCallback (true, null)
                    }
                }

                if (selectedNode.isLeaf ()) {
                    fn (nodeInfo, selectedNode.parentNode)
                } else {
                    if (!selectedNode.expanded) {
                        selectedNode.addListener ('expand', function () {
                            fn (nodeInfo, selectedNode)
                            selectedNode.purgeListeners ()
                        })
                        selectedNode.expand ()
                    } else {
                        fn (nodeInfo, selectedNode)
                    }
                }

            } else {
                if (fnCallback != undefined) {
                    fnCallback (false, 'no node selected')
                }
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

            var cmp = Ext.getCmp("inputOpenFileId");
            if (cmp.el.dom.files.length > 0) {

                wndOpenFile.el.mask (
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

                    Ext.getCmp ('pnlTreeId').fireEvent (
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

            //
            // @TODO!
            //

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
                        url: urls.update
                      , params: {
                            'leafId' : node.id
                          , 'nodeId' : node.parentNode.id
                          , 'name'   : node.text
                          , 'data'   : tab.getData ()
                          , 'rank'   : node.parentNode.indexOf (node)
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )

                            var tab = pnlEditorTabs.findById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            tab.el.unmask ()
                            if (res.id != undefined) {
                                tab.id = res.id
                            }

                            var tree = Ext.getCmp ('pnlTreeId')
                            var node = tree.getNodeById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            node.attributes['data'] = tab.getData ()
                            if (res.id != undefined) { 
                                node.id = res.id
                            }
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
                              , msg      : String.Format (
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
                    var tree = Ext.getCmp ('pnlTreeId')
                    var node = tree.getNodeById (tab.id)

                    Ext.Ajax.request ({
                        url: urls.update
                      , params: {
                            'leafId' : node.id
                          , 'nodeId' : node.parentNode.id
                          , 'name'   : node.text
                          , 'data'   : tab.getData ()
                          , 'rank'   : node.parentNode.indexOf (node)
                        }

                      , success: function (xhr, opts) {
                            var res = Ext.decode (xhr.responseText)[0]
                            var pnlEditorTabs = Ext.getCmp (
                                'pnlEditorTabsId'
                            )

                            var tab = pnlEditorTabs.findById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            tab.el.unmask ()
                            if (res.id != undefined) {
                                tab.id = res.id
                            }

                            var tree = Ext.getCmp ('pnlTreeId')
                            var node = tree.getNodeById (
                                (res.uuid != undefined) ? res.uuid : res.id
                            )

                            node.attributes['data'] = tab.getData ()
                            if (res.id != undefined) {
                                node.id = res.id
                            }
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
                              , msg      : String.Format (
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
          , handler : function (button, event) {
              
                Ext.getCmp ('pnlTreeId').fireEvent (
                    'removeNode', function (result, args) {

                        if (!result) {
                            Ext.Msg.alert (
                                "Error", "No node selected; select a node!"
                            )
                        } else {
                            
                            Ext.getCmp ('pnlEditorTabsId').fireEvent (
                                'removeTab', {'id': args.nodeId }
                            )
                            
                            Ext.Ajax.request ({
                                url: urls.del

                              , params: {
                                    'id' : args.nodeId
                                }

                              , success: function (xhr, opts) {
                                    // @DONE!
                                }

                              , failure: function (xhr, opts) {
                                    var res = Ext.decode (xhr.responseText)[0]

                                    Ext.MessageBox.show ({
                                        title    : 'Deleting failed'
                                      , msg      : String.Format (
                                            "Deleting for '{0}' failed!", res.id
                                        )
                                      , closable : false
                                      , width    : 256
                                      , buttons  : Ext.MessageBox.OK
                                    })
                                }
                            })
                        }
                    }
                )

            }
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
