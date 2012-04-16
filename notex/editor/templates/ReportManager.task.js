var reportManagerTask = {
    
    run: function () {
        var reportManager = Ext.getCmp ('reportManager.id')
        if (reportManager != undefined) {
            
            var editor = Ext.getCmp ('editor.id')
            if (editor != undefined) {
                
                var tabs = editor.items.items
                for (var i=0; i<tabs.length; i++) {
                    if (tabs[i] != undefined) {

                        var tree = Ext.getCmp ('reportManager.tree.id')
                        var node = tree.getNodeById (tabs[i].id)
                        var attr = node.attributes

                        if (String (attr['iconCls']).match ("^icon-image$") == 
                            "icon-image") {
                            reportManager.fireEvent ('saveImageTab', tabs[i])
                        } else {
                            reportManager.fireEvent ('saveTextTab', tabs[i])
                        }
                    }
                }
                
            }
        }
    }
    
}

Ext.TaskMgr.start({
    run: reportManagerTask.run,
    interval: 15 * 60 * 1000 // [ms]
});
