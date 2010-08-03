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
            if (node != undefined && args != undefined &&
                args.nodeInfo != undefined) {

                for (var property in args.nodeInfo) {
                    node[property] = args.nodeInfo[property]
                }

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
