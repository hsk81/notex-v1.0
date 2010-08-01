var pnlEditorTabs = new Ext.TabPanel({

    activeTab       : 0
  , id              : 'pnlEditorTabsId'
  , enableTabScroll : true
  , tabPosition     : 'bottom'

  , listeners : {

        createTab : function (tabInfo) {
            var tab = this.findById (tabInfo.id)
            if (!tab) {

                var divTag = '<div style="'
                    + 'font-family: andale mono; '
                    + 'font-size: 13px; '
                    + 'text-align: justify;">{0}</div>'

                tab = this.add ({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , layout     : 'fit'
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true

                  , divTag     : divTag

                  , getEditor: function () {
                        return this.findById ('htmlEditorId')
                    }

                  , getData: function () {
                        return this.getEditor ().getValue ()
                            .replace (new RegExp('^<div style="[^>]*">','g'),'')
                            .replace (new RegExp('</div>$','g'),'')
                    }

                  , items : [{
                        xtype  : 'htmleditor'
                      , id     : 'htmlEditorId'
                      , anchor : '100% 100%'
                      , html   : String.format(divTag, tabInfo.text)

                      , enableFont       : false
                      , enableAlignments : false
                      , enableSourceEdit : false
                  }]
                })
            }

            this.activate (tab)
        }

      , readTab : function (id, fn) {
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
        
      , deleteTab : function (tabInfo) {

            var tab = this.findById (tabInfo.id)
            if (tab) {
                this.remove (tab, true)
            }

        }

    }
});
