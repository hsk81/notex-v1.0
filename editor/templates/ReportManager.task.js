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

                        if (tree.isText (node)) {
                            reportManager.fireEvent ('saveTextTab', tabs[i], true)
                        }
                    }
                }
                
            }
        }
    }

}

Ext.TaskMgr.start ({
    run: reportManagerTask.run,
    interval: 3 * 60 * 1000 // [ms]
});
