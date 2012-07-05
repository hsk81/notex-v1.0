var reportManagerTree = function () {

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

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

    function _selectNode (node) {
        if (node && !node.isSelected()) { node.select (); }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function _click (node, event) {
        if (this.isLeaf (node)) {
            var tabInfo = {
                id : node.id,
                title : node.attributes['text'],
                text : node.attributes['data'],
                iconCls : node.attributes['iconCls']
            }

            if (this.isText (node)) {
                Ext.getCmp ('editor.id').fireEvent ('createTextTab', tabInfo)
            }

            if (this.isImage (node)) {
                Ext.getCmp ('editor.id').fireEvent ('createImageTab', tabInfo)
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function _isOfClass (node, cls) {
        if (node && node.attributes) {
            var attribute = node.attributes['cls']
            if (attribute) {
                return attribute.match (String.format ('^{0}$', cls)) != null;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    function _isOfIconClass (node, cls) {
        if (node && node.attributes) {
            var attribute = node.attributes['iconCls']
            if (attribute) {
                return attribute.match (
                    String.format ('^{0}$|^{0}-16$|^{0}-32$', cls)
                ) != null;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    return new Ext.tree.TreePanel ({

        loader : new Ext.tree.TreeLoader ({url : urls.read}),
        id : 'reportManager.tree.id',
        autoScroll : true,
        rootVisible : false,

        root : {
            text : 'Root',
            id : 'LMRHE33POQRCYIC3LVOQ====', //[u'root', []]
            cls : 'folder',
            iconCls : 'icon-folder',
            expanded : true
        },

        listeners : {
            createNode : _createNode,
            updateNode : _updateNode,
            readNode : _readNode,
            deleteNode : _deleteNode,
            selectNode : _selectNode,
            click : _click
        },

        ////////////////////////////////////////////////////////////////////////

        isRootNode : function (node) {
            if (node && node.id) {
                return this.rood.id == node.id;
            } else {
                return undefined;
            }
        },

        isReport : function (node) {
            return _isOfIconClass (node, 'icon-report');
        },

        isFolder : function (node) {
            return _isOfIconClass (node, 'icon-folder');
        },

        isText : function (node) {
            return _isOfIconClass (node, 'icon-page');
        },

        isImage : function (node) {
            return _isOfIconClass (node, 'icon-image');
        },

        isLeaf : function (node) {
            return _isOfClass (node, 'file');
        },

        isNotLeaf : function (node) {
            return _isOfClass (node, 'folder'); // includes root!
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
}();
