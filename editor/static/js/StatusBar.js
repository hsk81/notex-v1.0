var statusBar = function () {

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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

        plugins : new Ext.slider.Tip ({
            getText: function (thumb){
                return String.format ('<b>Zoom {0}%</b>', thumb.value);
            }
        }),

        listeners : {
            change : function (slider, newValue, thumb) {
                Ext.util.Cookies.set ('zoom', newValue);
                Ext.getCmp ('slider.zoom.id').setText (newValue + '%');
                Ext.getCmp ('editor.id').fireEvent ('zoom', newValue);
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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
                self.total = 0;
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    var langStore = new Ext.data.ArrayStore ({
        fields: [{name:'code'}, {name:'l2c', convert: function (v, r) {
                var record = r.code.split ('_');
                return String.format ('{0}: {1}',
                    statusBarLang.map2language (record[0]),
                    statusBarLang.map2country (record[1])
                );
            }
        }],

        sortInfo: {
            field: 'l2c', direction: 'ASC'
        },

        data : [
            {code: 'de_AT'},
            {code: 'de_BE'},
            {code: 'de_CH'},
            {code: 'de_DE'},
            {code: 'de_LI'},
            {code: 'de_LU'},
            {code: 'en_AG'},
            {code: 'en_AU'},
            {code: 'en_BS'},
            {code: 'en_BW'},
            {code: 'en_BZ'},
            {code: 'en_CA'},
            {code: 'en_DK'},
            {code: 'en_GB'},
            {code: 'en_GH'},
            {code: 'en_HK'},
            {code: 'en_IE'},
            {code: 'en_IN'},
            {code: 'en_JM'},
            {code: 'en_NA'},
            {code: 'en_NG'},
            {code: 'en_NZ'},
            {code: 'en_PH'},
            {code: 'en_SG'},
            {code: 'en_TT'},
            {code: 'en_US'},
            {code: 'en_ZA'},
            {code: 'en_ZW'},
            {code: 'es_AR'},
            {code: 'es_BO'},
            {code: 'es_CL'},
            {code: 'es_CO'},
            {code: 'es_CR'},
            {code: 'es_CU'},
            {code: 'es_DO'},
            {code: 'es_EC'},
            {code: 'es_ES'},
            {code: 'es_GT'},
            {code: 'es_HN'},
            {code: 'es_MX'},
            {code: 'es_NI'},
            {code: 'es_PA'},
            {code: 'es_PE'},
            {code: 'es_PR'},
            {code: 'es_PY'},
            {code: 'es_SV'},
            {code: 'es_UY'},
            {code: 'es_VE'}
        ]
    });

    var langCombo = new Ext.form.ComboBox ({
        id: 'status-bar.cmb-lang.id',
        store: langStore,
        displayField: 'l2c',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Spell check language ..',
        selectOnFocus: true,
        forceSelection: true,
        width: 164,

        listeners: {
            change: function (self, newValue, oldValue) {
                if (oldValue && !newValue) {
                    Ext.ux.form.CodeMirror.typo_engine = null;
                    Ext.util.Cookies.set ('lang', 'cleared');
                }
            },

            select: function (self, record, index) {
                var lingua = record.json.code;
                assert (lingua);

                var worker = new Worker (location.static_url +
                    'app/editor/js/CodeMirror.typo.worker.js'
                );

                worker.onmessage = function (event) {
                    if (event.data) {
                        var typo = Typo.prototype.load (event.data);
                        Ext.ux.form.CodeMirror.typo_engine = typo;
                        Ext.util.Cookies.set ('lang', lingua);
                    } else {
                        self.reset ();
                    }

                    progressBar.reset (true);
                    statusBar.clearStatus ({useDefaults:true});
                };

                statusBar.showBusy ({text: 'Please wait ..'});

                progressBar.show ();
                progressBar.setMode ('load');
                progressBar.wait ({
                    increment : progressBar.increment,
                    interval : progressBar.interval
                });

                worker.postMessage ({
                    lingua: record.json.code, static: location.static_url
                });
            }
        },

        setValueFor: function (item) {
            var store = this.getStore ();
            var index = store.findBy (function (r) {
                return r.json.code == item;
            });

            if (index >= 0) {
                var record = store.getAt (index);
                var value = record.get ('l2c');
                this.setValue (value);
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

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
                        '{0}:{1}', position.line + 1, position.ch + 1
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

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

}();
