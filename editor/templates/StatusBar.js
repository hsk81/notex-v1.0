var statusBar = function () {

    function _change (slider, newValue, thumb) {
        Ext.getCmp ('editor.id').fireEvent ('zoom', newValue)
    }

    var tip = new Ext.slider.Tip ({
        getText: function (thumb){
            return String.format ('<b>Zoom {0}%</b>', thumb.value);
        }
    });

    var slider = new Ext.Slider ({
        id : 'sliderId',
        width : 128,
        increment : 25,
        value : 100,
        minValue : 50,
        maxValue : 150,
        plugins : tip,

        listeners : {
            change : _change
        }
    });

    return new Ext.ux.StatusBar({

        id: 'statusBarId',
        defaultText: 'NoTex',
        text: 'NoTex',

        items: ['-', slider]

        /*items: [{
            text: 'Error',
            handler: function (){
                var sb = Ext.getCmp ('statusBarId');
                sb.setStatus({
                    text: 'Error',
                    iconCls: 'x-status-error',
                    clear: true // auto-clear after a set interval
                });
            }
        },{
            text: 'Busy',
            handler: function (){
                var sb = Ext.getCmp ('statusBarId');
                sb.showBusy ();
            }
        },{
            text: 'Clear',
            handler: function (){
                var sb = Ext.getCmp ('statusBarId');
                sb.clearStatus ({useDefaults:true});
            }
        }]*/
    });
}();