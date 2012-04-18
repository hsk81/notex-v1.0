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
                    return this.findById ('editor' + tabInfo.id)
                },

                getData : function () {
                    return this.getEditor ().getValue ()
                },

                items : [{
                    xtype : 'textarea',
                    id : 'editor' + tabInfo.id,
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
                    return $('#imageId').attr ('src')
                },

                items : [{
                    html : String.format (
                        '<img id="imageId" src="{0}" width="100%" />',
                        tabInfo.text
                    )
                }]
            });

            this.activate (tab)
        }

        if (tabInfo.save) {
            Ext.getCmp ('reportManager.id').fireEvent ('saveImageTab', tab)
        }
    }

    function _readTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )

        return (fn != undefined) ? fn (tab) : undefined
    }

    function _updateTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )

        if (tabInfo.uuid != undefined) {
            var ti = {
                id : tabInfo.id,
                title : tab.title,
                text : tab.getData (),
                iconCls : tab.iconCls
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
            readTab : _readTab,
            updateTab : _updateTab,
            deleteTab : _deleteTab
        }, 
    })
}();
