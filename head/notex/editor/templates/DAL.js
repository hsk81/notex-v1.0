var DAL = {

    //
    // CRUD: Create -----------------------------------------------------------
    //

    fnSuccessCreate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        var tree = Ext.getCmp ('pnlReportManagerTreeId')

        tree.getLoader().load(tree.root, null)
        tree.el.unmask ()
    }

  , fnFailureCreate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        var tree = Ext.getCmp ('pnlReportManagerTreeId')
        tree.el.unmask ()
    }

  , crudCreate : function (url, crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url    : url

          , success : function (xhr, opts) {
                fn.success (xhr, opts)
            }

          , failure : function (xhr, opts) {
                fn.failure (xhr, opts)
            }

        });
    }

    //
    // CRUD: Read -------------------------------------------------------------
    //

  , fnSuccessRead : function (xhr, opts) {
        //@TODO!?
    }

  , fnFailureRead : function (xhr, opts) {
        //@TODO!?
    }

  , crudRead : function (crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url: urls.read

          , success : function (xhr, opts) {
                fn.success (xhr, opts)
            }

          , failure : function (xhr, opts) {
                fn.failure (xhr, opts)
            }

        });
    }

    //
    // CRUD: Update -----------------------------------------------------------
    //

  , fnSuccessUpdate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        Ext.getCmp ('pnlEditorTabsId').fireEvent (
            'updateTab', {uuid:res.uuid, id:res.id}, function (tab) {

                var tree = Ext.getCmp ('pnlReportManagerTreeId')
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
                        }

                      , failure : function (args) {
                            //@TODO!?
                        }
                    }
                )

                tab.el.unmask ()
            }
        )
    }

  , fnFailureUpdate : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]
        Ext.getCmp ('pnlEditorTabsId').fireEvent (
            'updateTab', undefined, res.id, function (tab) {
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
        )
    }

  , crudUpdate : function (crudInfo, fn, url) {
        Ext.Ajax.request ({

            params : crudInfo
          , url    : url

          , success : function (xhr, opts) {
                fn.success (xhr, opts)
            }

          , failure : function (xhr, opts) {
                fn.failure (xhr, opts)
            }

        });
    }

    //
    // CRUD: Rename -----------------------------------------------------------
    //

  , fnSuccessRename : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]

        var tabs = Ext.getCmp ('pnlEditorTabsId')
        var tab = tabs.findById (res.id)
        if (tab != undefined) {
            tab.setTitle (res.name)
            tab.el.unmask ()
        }

        var tree = Ext.getCmp ('pnlReportManagerTreeId')
        var node = tree.getNodeById (res.id)
        if (node) {
            node.setText (res.name)
            tree.el.unmask ()
        } else {
            tree.el.unmask ()
        }
    }

  , fnFailureRename : function (xhr, opts) {
        //@TODO
    }

  , crudRename : function (crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url : urls.rename

          , success : function (xhr, opts) {
                fn.success (xhr, opts)
            }

          , failure : function (xhr, opts) {
                fn.failure (xhr, opts)
            }

        })
    }

    //
    // CRUD: Delete -----------------------------------------------------------
    //

  , fnSuccessDelete : function (xhr, opts) {
        //@DONE!
    }

  , fnFailureDelete : function (xhr, opts) {
        var res = Ext.decode (xhr.responseText)[0]

        Ext.MessageBox.show ({
            title    : 'Deleting failed'
          , msg      : String.Format (
                "Deleting for '{0}' failed!", res.id
            )
          , closable : false
          , width    : 256
          , buttons  : Ext.MessageBox.OK
        });
    }

  , crudDelete : function (crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url : urls.del

          , success: function (xhr, opts) {
                fn.success (xhr, opts)
            }

          , failure: function (xhr, opts) {
                fn.failure (xhr, opts)
            }

        });
    }

}
