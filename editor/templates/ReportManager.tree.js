var reportManagerTree = function () {

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function createNode (node, args, fn) {
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

    function updateNode (node, args, fn) {
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

    function readNode (node, args, fn) {
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

    function deleteNode (node, args, fn) {
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

    function selectNode (node) {
        if (node && !node.isSelected()) { node.select (); }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function click (node, event) {
        if (this.isLeaf (node)) {
            var tabInfo = {
                id : node.id,
                title : node.attributes['text'],
                text : node.attributes['data'],
                mime : node.attributes['mime'],
                iconCls : node.attributes['iconCls']
            }

            if (this.isImage (node)) {
                Ext.getCmp ('editor.id').fireEvent ('createImageTab', tabInfo)
            } else {
                Ext.getCmp ('editor.id').fireEvent ('createTextTab', tabInfo)
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function isOfClass (node, cls) {
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

    function isOfIconClass (node, cls) {
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
            createNode : createNode,
            updateNode : updateNode,
            readNode : readNode,
            deleteNode : deleteNode,
            selectNode : selectNode,
            click : click
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
            return isOfIconClass (node, 'icon-report');
        },

        isFolder : function (node) {
            return isOfIconClass (node, 'icon-folder');
        },

        isText : function (node) {
            return isOfIconClass (node, 'icon-page');
        },

        isImage : function (node) {
            return isOfIconClass (node, 'icon-picture');
        },

        isLeaf : function (node) {
            return isOfClass (node, 'file');
        },

        isNotLeaf : function (node) {
            return isOfClass (node, 'folder'); // includes root!
        },

        ////////////////////////////////////////////////////////////////////////

        getAllLeafs : function (node, fn) {

            function gn (child) {
                if (child.isLeaf ()) {
                    fn (node, child);
                } else {
                    child.expand (false, true, function (expandedChild) {
                        expandedChild.eachChild (gn);
                    });
                }
            }

            return node.eachChild (gn);
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
}();
