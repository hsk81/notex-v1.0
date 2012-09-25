var reportManagerCrud = function () {

    var error_msg = reportManagerUtil.error_message;
    var resource = reportManagerUtil.resource;

    // #########################################################################
    // #########################################################################

    function create () {

        function _onSuccess (xhr, opts) {
            var tree = Ext.getCmp ('reportManager.tree.id')

            var rootId = opts.params.nodeId
            var root = tree.getNodeById (rootId)
            var nodeId = Ext.decode (xhr.responseText)[0].id

            tree.getLoader ().load (root, function (root) {
                var createdNode = tree.getNodeById (nodeId);
                var path = createdNode.getPath ();

                tracker.event ({category: 'CRUD', action: 'Create',
                    label: createdNode.attributes['cls'], value: 1
                });

                tree.expandPath (path, undefined, function (success, node) {
                    if (success) { node.select (); }
                });
            });

            tree.el.unmask ();
        }

        function _onFailure (xhr, opts) {
            var tree = Ext.getCmp ('reportManager.tree.id')
            tracker.event ({category: 'CRUD', action: 'Create', value: 0});
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

    function read () {

        function _onSuccess (xhr, opts) {
            var tree = Ext.getCmp ('reportManager.tree.id');
            var nodeId = Ext.decode (xhr.responseText)[0].id;
            var node = tree.getNodeById (nodeId);

            tracker.event ({category: 'CRUD', action: 'Read',
                label: node.attributes['cls'], value: 1
            });
        }

        function _onFailure (xhr, opts) {
            tracker.event ({category: 'CRUD', action: 'Read',
                value: 0
            });
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

    function update () {

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

            tracker.event ({category: 'CRUD', action: 'Update',
                label: node.attributes['cls'], value: 1
            });
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

            tracker.event ({category: 'CRUD', action: 'Update',
                value: 0
            });
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

    function rename () {

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

            tracker.event ({category: 'CRUD', action: 'Rename',
                label: node ? node.attributes['cls'] : null, value: 1
            });

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

            tracker.event ({category: 'CRUD', action: 'Rename',
                value: 0
            });
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

    function del () {

        function _onSuccess (xhr, opts) {
            tracker.event ({category: 'CRUD', action: 'Delete',
                value: 1
            });
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

            tracker.event ({category: 'CRUD', action: 'Delete',
                label: node ? node.attributes['cls'] : null, value: 0
            });
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
        create: create (),
        read: read (),
        update: update (),
        rename: rename (),
        del: del ()
    };

    // #########################################################################
    // #########################################################################
}();
