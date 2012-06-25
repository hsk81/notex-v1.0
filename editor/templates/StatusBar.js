var statusBar = function () {

    function _change (slider, newValue, thumb) {
        Ext.util.Cookies.set ('zoom', newValue);
        Ext.getCmp ('editor.id').fireEvent ('zoom', newValue);
    }

    var tip = new Ext.slider.Tip ({
        getText: function (thumb){
            return String.format ('<b>Zoom {0}%</b>', thumb.value);
        }
    });

    function _getInitialValue () {
        var strValue = Ext.util.Cookies.get ('zoom')
        var value = null;

        if (strValue) {
            value = parseInt (strValue);
        } else {
            value = 100;
        }

        Ext.getCmp ('editor.id').fireEvent ('zoom', value);
        return value;
    }

    var slider = new Ext.Slider ({
        id : 'sliderId',
        width : 128,
        increment : 25,
        value : _getInitialValue (),
        minValue : 50,
        maxValue : 150,
        plugins : tip,

        listeners : {
            change : _change
        }
    });

    var progressBar = new Ext.ProgressBar({
        id : 'progressBarId',
        width : 256,
        value : 0.0,
        hidden : true,

        interval : 125, //[ms]
        total : 0, //[ms]
        increment : 100, // #segments

        listeners : {
            update : function (self, value, text) {
                self.total += self.interval
                self.updateText (sprintf ('Exporting ..  %0.3f [s]', self.total / 1000.0));
            },

            hide : function (self) {
                self.total = 0
            }
        }
    });

    return new Ext.ux.StatusBar({
        id: 'statusBarId',
        defaultText: 'NoTex',
        text: 'NoTex',
        items: [progressBar, '-', slider]
    });
}();