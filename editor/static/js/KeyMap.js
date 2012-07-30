new Ext.KeyMap (Ext.get(document), [{
    key: "o",
    ctrl: true,
    stopEvent: true,
    fn: function () {
        Ext.getCmp ('reportManager.id').fireEvent ('openFile');
    }
},{
    key: "s",
    ctrl: true,
    stopEvent: true,
    fn: function () {
        Ext.getCmp ('reportManager.id').fireEvent ('saveTab');
    }
}]);
