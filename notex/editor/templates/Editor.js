var editor = function () {

    function createTextTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )

        if (!tab) {

            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                layout : 'fit',
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,

                getEditor : function () {
                    return this.findById ('htmlEditorId')
                },

                getData : function () {
                    return this.getEditor ().getValue ()
                },

                items : [{
                    xtype : 'textarea',
                    id : 'htmlEditorId',
                    anchor : '100% 100%',
                    value : tabInfo.text,
                    style :"font-family:monospace; font-size:12px;"
                }]
            });

            this.activate (tab)
        } else {
            this.activate (tab)
        }

        return (fn != undefined) ? fn (tab) : undefined
    }

    function createImageTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )

        if (!tab) {

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
        } else {
            this.activate (tab)
        }

        return (fn != undefined) ? fn (tab) : undefined
    }

    function readTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )

        return (fn != undefined) ? fn (tab) : undefined
    }

    function updateTab (tabInfo, fn) {

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

    function deleteTab (tabInfo, fn) {

        var tab = this.findById (
            (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
        )
        
        if (tab) {
            this.remove (tab, true)
        }

        return (fn != undefined) ? fn (tab) : undefined
    }

    return new Ext.TabPanel ({

        activeTab : 0,
        id : 'editor.id',
        enableTabScroll : true,
        tabPosition : 'bottom',

        listeners : {
            createTextTab : createTextTab,
            createImageTab : createImageTab,
            readTab : readTab,
            updateTab : updateTab,
            deleteTab : deleteTab
        }, 
    })
}();
