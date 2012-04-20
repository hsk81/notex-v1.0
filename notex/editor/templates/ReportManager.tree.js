var reportManagerTree = function () {

    function _createNode (node, args, fn) {
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

    function _updateNode (node, args, fn) {
        if (node != undefined && args != undefined) {
            node.setText (node.text.replace('<i>','').replace('</i>',''))
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

    function _readNode (node, args, fn) {
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

    function _deleteNode (node, args, fn) {
        if (node != undefined && args != undefined && 
            args.destroy != undefined) {
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

    return new Ext.tree.TreePanel ({

        id : 'reportManager.tree.id',
        autoScroll : true,
        rootVisible : false,

        loader : new Ext.tree.TreeLoader({
            url : '{% url editor:read %}'
        }),

        root : {
            text : 'Root',
            id : 'LMRHE33POQRCYIC3LVOQ====', //[u'root', []]
            cls : 'folder',
            iconCls : 'icon-folder',
            expanded : true
        },

        listeners : {
            createNode: _createNode,
            updateNode: _updateNode,
            readNode: _readNode,
            deleteNode: _deleteNode
        }
    })
}();

Ext.getCmp ('reportManager.tree.id').on ('click', function (node, event) {
    if (node.attributes['cls'] == "file") {
        var tabInfo = {
            id : node.id,
            title : node.attributes['text'].replace ('<i>','').replace ('</i>',''),
            text : node.attributes['data'],
            iconCls : node.attributes['iconCls']
        }

        if (String (tabInfo.iconCls).match ("^icon-image$") == "icon-image") {
            Ext.getCmp ('editor.id').fireEvent ('createImageTab', tabInfo)
        } else {
            Ext.getCmp ('editor.id').fireEvent ('createTextTab', tabInfo)
        }
    }
});
