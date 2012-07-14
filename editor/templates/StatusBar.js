var statusBar = function () {

    function change (slider, newValue, thumb) {
        Ext.util.Cookies.set ('zoom', newValue);
        Ext.getCmp ('editor.id').fireEvent ('zoom', newValue);
    }

    var tip = new Ext.slider.Tip ({
        getText: function (thumb){
            return String.format ('<b>Zoom {0}%</b>', thumb.value);
        }
    });

    function getInitialValue () {
        var strValue = Ext.util.Cookies.get ('zoom')
        var value = null;

        if (strValue) {
            value = parseInt (strValue);
        } else {
            value = 125;
        }

        var editor = Ext.getCmp ('editor.id');
        if (editor) {
            editor.fireEvent ('zoom', value);
        }

        return value;
    }

    var slider = new Ext.Slider ({
        id : 'slider.id',
        width : 128,
        increment : 25,
        value : getInitialValue (),
        minValue : 50,
        maxValue : 150,
        plugins : tip,

        listeners : {
            change : change
        }
    });

    var progressBar = new Ext.ProgressBar ({
        id : 'progress-bar.id',
        width : 256,
        value : 0.0,
        hidden : true,

        interval : 125, //[ms]
        total : 0, //[ms]
        increment : 100, // #segments

        setMode : function (mode) {
            if (mode == 'import')
                this.mode = 'Importing'
            else if (mode == 'export')
                this.mode = 'Exporting'
            else
                this.mode = 'Waiting'
        },

        listeners : {
            update : function (self, value, text) {
                self.total += self.interval
                self.updateText (sprintf (
                    '%s ..  %0.3f [s]', self.mode, self.total / 1000.0
                ));
            },

            hide : function (self) {
                self.total = 0
            }
        }
    });

    var infoButton = new Ext.Button ({
        tooltip: '<b>Line:Char</b> or <b>Lines:Words:Chars</b>',
        text: '', disabled: true, width: 64, handler: function () {
            if (this.editor) {
                var value = this.editor.getValue ();
                if (value) {
                    this.setText (String.format ('{0}:{1}:{2}',
                        value.split (/\n/).length,
                        value.split (/\s+[^\s+$]/).length,
                        value.length
                    ));
                }
            }
        }
    });

    return new Ext.ux.StatusBar ({
        id: 'status-bar.id',
        defaultText: 'NoTex',
        text: 'NoTex',
        items: [progressBar, '-', infoButton, '-', slider],

        listeners: {
            initComponent: function  () {
                Ext.ux.form.StatusBar.superclass.initComponent.apply (
                    this, arguments
                );

                this.addEvents ('cursor');
            },

            cursor: function (position) {
                if (position) {
                    infoButton.setText (String.format (
                        '{0}:{1}', position.line+1, position.ch+1
                    ));
                } else {
                    infoButton.setText (null);
                }
            }
        },

        setEditor: function (value) {
            if (value) infoButton.enable ();
            else infoButton.disable ();
            infoButton.editor = value;
        }
    });
}();