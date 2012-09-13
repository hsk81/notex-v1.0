var statusBar = function () {

    function change (slider, newValue, thumb) {
        Ext.util.Cookies.set ('zoom', newValue);
        Ext.getCmp ('slider.zoom.id').setText (newValue + '%');
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

    var zoom = new Ext.Button ({
        id : 'slider.zoom.id',
        width : 48,
        text : getInitialValue () + '%',
        handler : function () {
            Ext.getCmp ('slider.id').setValue (100);
        }
    });

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
            else if (mode == 'load')
                this.mode = 'Loading'
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
                } else {
                    this.setText ('1:0:0');
                }
            }
        }
    });

    var langStore = new Ext.data.ArrayStore ({
        fields: ['code', {name:'l2c', convert: function (v, record) {
                var r = record.split ('_');
                return String.format ('{0} {1}',
                    statusBarLang.map2language (r[0]),
                    statusBarLang.map2country (r[1])
                );
            }
        }],

        data : ['de_AT', 'de_BE', 'de_CH', 'de_DE', 'de_LI', 'de_LU', 'en_AG', 'en_AU', 'en_BS', 'en_BW', 'en_BZ', 'en_CA', 'en_DK', 'en_GB', 'en_GH', 'en_HK', 'en_IE', 'en_IN', 'en_JM', 'en_NA', 'en_NG', 'en_NZ', 'en_PH', 'en_SG', 'en_TT', 'en_US', 'en_ZA', 'en_ZW', 'es_AR', 'es_BO', 'es_CL', 'es_CO', 'es_CR', 'es_CU', 'es_DO', 'es_EC', 'es_ES', 'es_GT', 'es_HN', 'es_MX', 'es_NI', 'es_PA', 'es_PE', 'es_PR', 'es_PY', 'es_SV', 'es_UY', 'es_VE']
    });

    var langCombo = new Ext.form.ComboBox ({
        store: langStore,
        displayField: 'l2c',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Spell checking ..',
        selectOnFocus: true,
        width: 164,

        listeners:{
            'select': function (self, record, index) {
                var lingua = record.json;
                assert (lingua);

                var engine = Ext.ux.form.CodeMirror.typo[lingua];
                if (engine) {
                    Ext.ux.form.CodeMirror.typo_engine = engine;
                } else {
                    var worker = new Worker (location.static_url +
                        'app/editor/js/CodeMirror.typo.worker.js'
                    );

                    worker.onmessage = function (event) {
                        var typo = Typo.prototype.load (event.data);
                        assert (typo);

                        Ext.ux.form.CodeMirror.typo[lingua] = typo;
                        Ext.ux.form.CodeMirror.typo_engine = typo;

                        progressBar.reset (true);
                        statusBar.clearStatus ({useDefaults:true});
                    };

                    Ext.ux.form.CodeMirror.typo_engine = null;

                    statusBar.showBusy ({text: 'Please wait ..'});
                    progressBar.show ();
                    progressBar.setMode ('loading');
                    progressBar.wait ({
                        increment : progressBar.increment,
                        interval : progressBar.interval
                    });

                    worker.postMessage ({
                        lingua: record.json,
                        static: location.static_url
                    });
                }
            }
        }
    });

    return new Ext.ux.StatusBar ({
        id: 'status-bar.id',
        defaultText: 'NoTex',
        text: 'NoTex',
        items: [
            progressBar, '-', infoButton, '-', langCombo, '-', zoom, slider
        ],

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
        },

        lang: statusBarLang
    });
}();
