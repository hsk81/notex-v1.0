var editor = new Ext.TabPanel ({

    activeTab       : 0
  , id              : 'editor.id'
  , enableTabScroll : true
  , tabPosition     : 'bottom'

  , divAndaleMono   :
  
        '<div style="' +
            'font-family: andale mono; ' +
            'font-size: 13px; ' +
            'text-align: justify;">{0}' +
        '</div>'

  , listeners : {

        //
        // createTextTab ------------------------------------------------------
        //

        createTextTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            var tpl = function () {
                tpl = ''; for (var idx=0; idx<tabInfo.text.length; idx++) {
                    tpl += '{' + idx + '}'
                } return tpl;
            }();

            var tplHtmlEditor = new Ext.Template (
                String.format (editor.divAndaleMono, tpl)
            )

            if (!tab) {

                tab = this.add ({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , layout     : 'fit'
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true

                  , getEditor  : function () {
                        return this.findById ('htmlEditorId')
                    }

                  , getData    : function () {
                        return this.getEditor ().getValue ()
                            .replace('<div style="' +
                                 'font-family: andale mono; ' +
                                 'font-size: 13px; ' +
                                 'text-align: justify;">','')
                            .replace('</div>','')
                    }

                  , items : [{
                        xtype  : 'htmleditor'
                      , id     : 'htmlEditorId'
                      , anchor : '100% 100%'
                      , data   : tabInfo.text
                      , tpl    : tplHtmlEditor

                      , enableFont       : false
                      , enableAlignments : false
                      , enableSourceEdit : true
                    }]
                });

                this.activate (tab)
            } else {
                this.activate (tab)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // createImageTab -----------------------------------------------------
        //

      , createImageTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            if (!tab) {

                tab = this.add ({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true
                  , bodyStyle  : 'background-color: grey;'

                  , layout : 'hbox'
                  , layoutConfig : {
                        align : 'middle'
                      , pack  : 'center'
                  }

                  , getData   : function () {
                        return $('#imageId').attr ('src')
                    }

                  , items : [{
                        html : String.format (
                            '<img id="imageId" src="{0}" width="100%" />', tabInfo.text
                        )
                    }]
                });

                this.activate (tab)
            } else {
                this.activate (tab)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // readTab ------------------------------------------------------------
        //

      , readTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // updateTab ----------------------------------------------------------
        //

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

                if (ti.iconCls == 'icon-image') {
                    Ext.getCmp ('editor.id').fireEvent ('createImageTab', ti)
                } else {
                    Ext.getCmp ('editor.id').fireEvent ('createTextTab', ti)
                }
            }

            return (fn != undefined) ? fn (tab) : undefined
        }
        
        //
        // deleteTab --------------------------------------------------------------------------
        //

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
