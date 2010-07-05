var pnlReportManagerTree = new Ext.tree.TreePanel ({
    
    id          : 'pnlReportManagerTreeId'
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

      , updateNode : function (uuid, id, fn) {
            var node = this.getNodeById (
                (uuid != undefined) ? uuid : id
            )

            if (id != undefined) {
                node.id = id
            }

            return fn (node)
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
