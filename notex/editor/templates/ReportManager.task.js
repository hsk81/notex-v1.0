var reportManagerTask = {
    
    run: function () {
        var reportManager = Ext.getCmp ('reportManager.id')
        if (reportManager != undefined) {
            
            var editor = Ext.getCmp ('editor.id')
            if (editor != undefined) {
                
                var tabs = editor.items.items
                for (var i=0; i<tabs.length; i++) {
                    if (tabs[i] != undefined) {
                        reportManager.fireEvent ('saveTextTab', tabs[i])
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
