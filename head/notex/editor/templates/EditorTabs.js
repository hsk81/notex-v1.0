var pnlEditorTabs = new Ext.TabPanel({

    activeTab       : 0
  , id              : 'pnlEditorTabsId'
  , enableTabScroll : true
  , tabPosition     : 'bottom'

  , listeners : {

        insertTab : function (tabInfo) {
            var tab = this.findById (tabInfo.id)
            if (!tab) {
                tab = this.add({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , layout     : 'fit'
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true

                  , getEditor: function () {
                        return this.findById ('htmlEditorId')
                    }

                  , getData: function () {
                        return this.getEditor ().getValue ()
                    }

                  , items : [{
                        xtype  : 'htmleditor'
                      , id     : 'htmlEditorId'
                      , anchor : '100% 100%'
                      , html   : tabInfo.text
                  }]
                })
            }

            this.activate (tab)
        }

      , getTab : function (id, fn) {
            //@TODO!?
        }

      , updateTab : function (uuid, id, fn) {

            var tab = this.findById (
                (uuid != undefined) ? uuid : id
            )

            if (id != undefined) {
                tab.id = id
            }

            return fn (tab)
        }
        
      , removeTab : function (tabInfo) {

            var tab = this.findById (tabInfo.id)
            if (tab) {
                this.remove (tab, true)
            }

        }

    }
});
