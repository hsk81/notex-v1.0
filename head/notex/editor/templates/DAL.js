var DAL = {

    //
    // CRUD: Create -----------------------------------------------------------
    //

    fnSuccessCreate : function (xhr, opts) {
        //@TODO!
    }

  , fnFailureCreate : function (xhr, opts) {
        //@TODO!
    }

  , crudCreate : function (crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url : urls.create

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

                var pnlReportManagerTree = Ext.getCmp (
                    'pnlReportManagerTreeId'
                )

                var node = pnlReportManagerTree.getNodeById (
                    (res.uuid != undefined) ? res.uuid : res.id
                )

                pnlReportManagerTree.fireEvent (
                    'updateNode', node, {nodeInfo:{id:res.id}}, {

                        success : function (args) {
                            args.node.attributes['data'] = tab.getData ()
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

  , crudUpdate : function (crudInfo, fn) {
        Ext.Ajax.request ({

            params : crudInfo
          , url : urls.update

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
        if (node != undefined) {
            node.setText (res.name)
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
