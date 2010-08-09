var pnlEditorTabs = new Ext.TabPanel({

    activeTab       : 0
  , id              : 'pnlEditorTabsId'
  , enableTabScroll : true
  , tabPosition     : 'bottom'

  , listeners : {

        createTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

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
                      , html   : String.format (divTag, tabInfo.text)

                      , enableFont       : false
                      , enableAlignments : false
                      , enableSourceEdit : false
                    }]
                });
                
                this.activate (tab)
            } else {
                this.activate (tab)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }

      , readTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            return (fn != undefined) ? fn (tab) : undefined
        }

      , updateTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            if (tabInfo.uuid != undefined) {

                var ti = {
                    id      : tabInfo.id
                  , title   : tab.title
                  , text    : tab.getData ()
                  , iconCls : tab.iconCls
                }

                this.remove (tab)

                Ext.getCmp (
                    'pnlEditorTabsId'
                ).fireEvent (
                    'createTab', ti
                )
            }

            return (fn != undefined) ? fn (tab) : undefined
        }
        
      , deleteTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )
            
            if (tab) {
                this.remove (tab, true)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }
    }
})
