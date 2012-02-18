var reportManagerTree = new Ext.tree.TreePanel ({
    
    id          : 'reportManager.tree.id'
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

        createNode: function (node, args, fn) {

            if (node != null && args != null && args.refNode != null) {

                var gn = function (refNode) {

                    refNode.insertBefore (node, null)

                    if (fn != undefined && fn.success != undefined) {
                        return fn.success ({'node': node,'refNode': refNode})
                    } else {
                        return {'node': node,'refNode': refNode}
                    }
                }

                if (args.refNode.isLeaf ()) {
                    return gn (args.refNode.parentNode)
                } else {
                    if (!args.refNode.expanded) {
                        args.refNode.on ('expand', gn, this, {single: true})
                        args.refNode.expand ()
                        return {'node': node,'refNode': args.refNode}
                    } else {
                        return gn (args.refNode)
                    }
                }

            } else {
                if (fn != undefined && fn.failure != undefined) {
                    return fn.failure ({})
                } else {
                    return {}
                }
            }
        }

      , updateNode: function (node, args, fn) {

            if (node != undefined && args != undefined) {

                node.setText (
                    node.text.replace('<i>','').replace('</i>','')
                )

                if (fn != undefined && fn.success != undefined) {
                    return fn.success ({'node': node})
                } else {
                    return {'node': node}
                }

            } else {
                if (fn != undefined && fn.failure != undefined) {
                    return fn.failure ({})
                } else {
                    return {}
                }
            }
        }

      , readNode: function (node, args, fn) {

            if (node != undefined && args != undefined) {
                
                if (fn != undefined && fn.success != undefined) {
                    return fn.success ({'node': node})
                } else {
                    return {'node': node}
                }

            } else {
                if (fn != undefined && fn.failure != undefined) {
                    return fn.failure ({})
                } else {
                    return {}
                }
            }
        }

      , deleteNode: function (node, args, fn) {

            if (node != undefined
             && args != undefined && args.destroy != undefined) {

                var nodeId = node.id
                node.remove (args.destroy)

                if (fn != undefined && fn.success != undefined) {
                    return fn.success ({'node': {'id': nodeId}})
                } else {
                    return {'node': {'id': nodeId}}
                }

            } else {
                if (fn != undefined && fn.failure != undefined) {
                    return fn.failure ({})
                } else {
                    return {}
                }
            }
        }

    }
});

Ext.getCmp ('reportManager.tree.id').on ('dblclick', function (node, event) {
    if (node.attributes['cls'] == "file") {

        var tabInfo = {
            id      : node.id
          , title   : node.attributes['text'].replace ('<i>','').replace ('</i>','')
          , text    : node.attributes['data']
          , iconCls : node.attributes['iconCls']
        }

        if (String.match(tabInfo.iconCls, "^icon-page$") == "icon-page") {
            Ext.getCmp ('editor.id').fireEvent ('createTextTab', tabInfo)
        } else if (String.match(tabInfo.iconCls, "^icon-image$") == "icon-image") {
            tabInfo.src = 'http://icon-image.jpg' //@TODO!
            Ext.getCmp ('editor.id').fireEvent ('createImageTab', tabInfo)
        }
    }
});