var reportManagerCrud = function () {

    var error_msg = reportManagerUtil.error_message;
    var resource = reportManagerUtil.resource;

    // #########################################################################
    // #########################################################################

    function _create () {

        function _onSuccess (xhr, opts) {
            var tree = Ext.getCmp ('reportManager.tree.id')

            var rootId = opts.params.nodeId
            var root = tree.getNodeById (rootId)
            var nodeId = Ext.decode (xhr.responseText)[0].id

            tree.getLoader ().load (root, function (root) {
                var createdNode = tree.getNodeById (nodeId);
                var path = createdNode.getPath ();
                tree.expandPath (path, undefined, function (success, node) {
                    if (success) { node.select (); }
                });
            });

            tree.el.unmask ();
        }

        function _onFailure (xhr, opts) {
            var tree = Ext.getCmp ('reportManager.tree.id')
            tree.el.unmask ()
        }

        return function (url, crudInfo) {
            Ext.Ajax.request ({
                params : crudInfo,
                url : url,
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)[0]
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts)
                        }
                    } else {
                        _onFailure (xhr, opts)
                    }
                }
            })
        }
    }

    // #########################################################################
    // #########################################################################

    function _read () {

        function _onSuccess (xhr, opts) {
            //@DONE!
        }

        function _onFailure (xhr, opts) {
            //@DONE!
        }

        return function (crudInfo) {
            Ext.Ajax.request ({
                params : crudInfo,
                url : urls.read,
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)[0]
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts)
                        }
                    } else {
                        _onFailure (xhr, opts)
                    }
                }
            })
        }
    }

    // #########################################################################
    // #########################################################################

    function _update () {

        function _onSuccess (xhr, opts) {
            var res = Ext.decode (xhr.responseText)[0];
            var id = (res.uuid != undefined) ? res.uuid : res.id;

            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (id)

            tree.fireEvent (
                'updateNode', node, {uuid:res.uuid, id:res.id}, {
                    success : function (args) {

                        var tab = Ext.getCmp ('editor.id').findById (id);
                        if (tab) { // sync tab with node
                            args.node.attributes['data'] = tab.getData ();
                            tab.el.unmask ();
                        } else { // tab not open yet
                            function _select (refNode) {
                                tree.fireEvent ('click',
                                    tree.getNodeById (res.id)
                                );
                            }

                            function _expand (refNode) {
                                refNode.expand (false, true, _select);
                            }

                            tree.getLoader().load(
                                args.node.parentNode, _expand
                            );
                        }

                    }
                }
            );

        }

        function _onFailure (xhr, opts) {
            var res = Ext.decode (xhr.responseText)[0]
            var id = (res.uuid != undefined) ? res.uuid : res.id
            var tab = Ext.getCmp ('editor.id').findById (id)

            if (tab) {
                tab.el.unmask ();
                error_msg (String.format (resource.UPDATE_ERROR, tab.title));
            } else {
                error_msg (String.format (resource.UPDATE_ERROR, undefined));
            }
        }

        return function (crudInfo, url) {
            Ext.Ajax.request ({
                params : crudInfo,
                url : url,
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)[0]
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts)
                        }
                    } else {
                        _onFailure (xhr, opts)
                    }
                }
            })
        }
    }

    // #########################################################################
    // #########################################################################

    function _rename () {

        function _onSuccess (xhr, opts) {
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
            }

            tree.el.unmask ()
        }

        function _onFailure (xhr, opts) {
            var res = Ext.decode (xhr.responseText)
            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (res.id)

            if (node) {
                error_msg (String.format (
                    resource.UPDATE_ERROR, node.getText ()
                ));
            } else {
                error_msg (String.format (
                    resource.UPDATE_ERROR, undefined
                ));
            }
        }

        return function (crudInfo) {
            Ext.Ajax.request ({
                params  : crudInfo,
                url : urls.rename,
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts)
                        }
                    } else {
                        _onFailure (xhr, opts)
                    }
                }
            })
        }
    }

    // #########################################################################
    // #########################################################################

    function _delete () {

        function _onSuccess (xhr, opts) {
        }

        function _onFailure (xhr, opts) {
            var res = Ext.decode (xhr.responseText)
            var tree = Ext.getCmp ('reportManager.tree.id')
            var node = tree.getNodeById (res.id)

            if (node) {
                error_msg (String.format (
                    resource.DELETE_ERROR, node.getText ()
                ));
            } else {
                error_msg (String.format (
                    resource.DELETE_ERROR, undefined
                ));
            }
        }

        return function (crudInfo) {
            Ext.Ajax.request ({
                params : crudInfo,
                url : urls.del,
                callback : function (opts, status, xhr) {
                    if (status) {
                        var res = Ext.decode (xhr.responseText)
                        if (res.success) {
                            _onSuccess (xhr, opts)
                        } else {
                            _onFailure (xhr, opts)
                        }
                    } else {
                        _onFailure (xhr, opts)
                    }
                }
            })
        }
    }

    // #########################################################################
    // #########################################################################

    return {
        create: _create (),
        read: _read (),
        update: _update (),
        rename: _rename (),
        del: _delete ()
    };

    // #########################################################################
    // #########################################################################
}();