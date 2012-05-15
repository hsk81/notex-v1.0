var editor = function () {

    function _createTextTab (tabInfo) {

        var tab = this.findById (tabInfo.id)
        if (tab) {
            this.activate (tab)
        } else {
            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                layout : 'fit',
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,

                getEditor : function () {
                    return this.findById ('editorId' + tabInfo.id)
                },

                getData : function () {
                    return this.getEditor ().getValue ()
                },

                items : [{
                    xtype : 'textarea',
                    id : 'editorId' + tabInfo.id,
                    anchor : '100% 100%',
                    value : tabInfo.text,
                    style :"font-family:monospace; font-size:12px;"
                }]
            });

            this.activate (tab)
        }

        if (tabInfo.save) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveTextTab', tab)
        }
    }

    function _createImageTab (tabInfo) {

        var tab = this.findById (tabInfo.id)
        if (tab) {
            this.activate (tab)
        } else {
            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,
                bodyStyle : 'background-color: grey;',

                layout : 'hbox',
                layoutConfig : {
                    align : 'middle',
                    pack : 'center'
                },

                getData : function () {
                    return $('#imageId' + tabInfo.id).attr ('src')
                },

                items : [{
                    html : String.format (
                        '<img id="imageId{0}" src="{1}" width="100%" />',
                        tabInfo.id, tabInfo.text
                    )
                }]
            });

            this.activate (tab)
        }

        if (tabInfo.save) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab', tab)
        }
    }

    function _deleteTab (tabInfo) {

        var tab = this.findById (tabInfo.id)
        if (tab) {
            this.remove (tab, true)
        }
    }

    return new Ext.TabPanel ({

        activeTab : 0,
        id : 'editor.id',
        enableTabScroll : true,
        tabPosition : 'bottom',

        listeners : {
            createTextTab : _createTextTab,
            createImageTab : _createImageTab,
            deleteTab : _deleteTab
        }
    })
}();
