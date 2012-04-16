var reportManagerUtil = {
    
    // #########################################################################
    // CRUD: Create
    // #########################################################################

    fnSuccessCreate : function (xhr, opts) {
        var tree = Ext.getCmp ('reportManager.tree.id')
        var model = tree.getSelectionModel ()
        var node = model.getSelectedNode ()

        if (node != undefined) {
            tree.getLoader ().load (node, function (node) {
                var path = node.getPath ()
                tree.getLoader ().load (tree.root, function (root) {
                    tree.expandPath (path, null, function (success, node) {
                        if (success) { tree.getSelectionModel ().select (node) }
                        tree.el.unmask ()
                    })
                })
            })
        } else {
            tree.getLoader ().load (tree.root)
            tree.el.unmask ()
        }
    },

    fnFailureCreate : function (xhr, opts) {
        var tree = Ext.getCmp ('reportManager.tree.id')
        tree.el.unmask ()
    },

    crudCreate : function (url, crudInfo, fn) {
        Ext.Ajax.request ({
            params : crudInfo,
            url : url,
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)[0]
                    if (res.success) {
                        fn.success (xhr, opts)
                    } else {
                        fn.failure (xhr, opts)
                    }
                } else {
                    fn.failure (xhr, opts)
                }
            }
        })
    },

    // #########################################################################
    // CRUD: Read
    // #########################################################################

    fnSuccessRead : function (xhr, opts) {
        //@DONE!
    },

    fnFailureRead : function (xhr, opts) {
        //@DONE!
    },

    crudRead : function (crudInfo, fn) {
        Ext.Ajax.request ({
            params : crudInfo, 
            url : urls.read,
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)[0]
                    if (res.success) {
                        fn.success (xhr, opts)
                    } else {
                        fn.failure (xhr, opts)
                    }
                } else {
                    fn.failure (xhr, opts)
                }
            }
        })
    }, 

    // #########################################################################
    // CRUD: Update
    // #########################################################################

    fnSuccessUpdate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        Ext.getCmp ('editor.id').fireEvent (
            'updateTab', {uuid:res.uuid, id:res.id}, function (tab) {

                var tree = Ext.getCmp ('reportManager.tree.id')
                var node = tree.getNodeById (
                    (res.uuid != undefined) ? res.uuid : res.id
                )

                tree.fireEvent (
                    'updateNode', node, {uuid:res.uuid, id:res.id}, {

                        success : function (args) {
                            if (Math.uuidMatch (node.id)) {
                                var refNode = args.node.parentNode
                                tree.getLoader().load(
                                    refNode, function () { refNode.expand() }
                                );
                            } else {
                                args.node.attributes['data'] = tab.getData ()
                            }
                        },

                        failure : function (args) {
                            //@TODO!?
                        }
                    }
                )

                tab.el.unmask ()
            }
        )
    },

    fnFailureUpdate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        Ext.getCmp ('editor.id').fireEvent (
            'updateTab', undefined, res.id, function (tab) {
                tab.el.unmask ()
                Ext.MessageBox.show ({
                    title : 'Saving failed',
                    msg : String.Format ("Saving failed for tab '{0}'!", tab.title),
                    closable : false,
                    width : 256,
                    buttons : Ext.MessageBox.OK
                })
            }
        )
    },

    crudUpdate : function (crudInfo, fn, url) {
        Ext.Ajax.request ({
            params : crudInfo,
            url : url,
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)[0]
                    if (res.success) {
                        fn.success (xhr, opts)
                    } else {
                        fn.failure (xhr, opts)
                    }
                } else {
                    fn.failure (xhr, opts)
                }
            }
        })
    },

    // #########################################################################
    // CRUD: Rename
    // #########################################################################

    fnSuccessRename : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)

        var tabs = Ext.getCmp ('editor.id')
        var tab = tabs.findById (res.id)
        if (tab != undefined) {
            tab.setTitle (res.name)
            tab.el.unmask ()
        }

        var tree = Ext.getCmp ('reportManager.tree.id')
        var node = tree.getNodeById (res.id)
        if (node) {
            node.setText (res.name)
            tree.el.unmask ()
        } else {
            tree.el.unmask ()
        }
    },

    fnFailureRename : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)
        var tree = Ext.getCmp ('reportManager.tree.id')
        var node = tree.getNodeById (res.id)
        
        Ext.MessageBox.show ({
            title : 'Renaming failed',
            msg : String.Format ("Renaming failed for node '{0}'!",
                (node != undefined) ? node.getText () : 'unknown'),
            closable : false,
            width : 256,
            buttons : Ext.MessageBox.OK
        })
    },

    crudRename : function (crudInfo, fn) {
        Ext.Ajax.request ({
            params  : crudInfo,
            url : urls.rename,
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)
                    if (res.success) {
                        fn.success (xhr, opts)
                    } else {
                        fn.failure (xhr, opts)
                    }
                } else {
                    fn.failure (xhr, opts)
                }
            }
        })
    },

    // #########################################################################
    // CRUD: Delete
    // #########################################################################

    fnSuccessDelete : function (xhr, opts) {
        //@DONE!
    },

    fnFailureDelete : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)
        Ext.MessageBox.show ({
            title : 'Deleting failed',
            msg : String.Format ("Deleting for '{0}' failed!", res.id),
            closable : false,
            width : 256,
            buttons : Ext.MessageBox.OK
        })
    },

    crudDelete : function (crudInfo, fn) {
        Ext.Ajax.request ({
            params : crudInfo,
            url : urls.del,
            callback : function (opts, status, xhr) {
                if (status) {
                    var res = Ext.decode (xhr.responseText)
                    if (res.success) {
                        fn.success (xhr, opts)
                    } else {
                        fn.failure (xhr, opts)
                    }
                } else {
                    fn.failure (xhr, opts)
                }
            }
        })
    }

}
