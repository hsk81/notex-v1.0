var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                            enc4 = 64;
                    }

                    output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
    },

    // public method for decoding
    decode : function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                    }

            }

            output = Base64._utf8_decode(output);

            return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                            utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                    }

            }

            return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length ) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                            string += String.fromCharCode(c);
                            i++;
                    }
                    else if((c > 191) && (c < 224)) {
                            c2 = utftext.charCodeAt(i+1);
                            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                            i += 2;
                    }
                    else {
                            c2 = utftext.charCodeAt(i+1);
                            c3 = utftext.charCodeAt(i+2);
                            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                    }

            }

            return string;
    }

}

var pnlEditorTabs = new Ext.TabPanel({

    activeTab       : 0
  , id              : 'pnlEditorTabsId'
  , enableTabScroll : true
  , tabPosition     : 'bottom'

  , divAndaleMono   :
  
        '<div style="' +
            'font-family: andale mono; ' +
            'font-size: 13px; ' +
            'text-align: justify;">{0}' +
        '</div>'

  , listeners : {

        //
        // createTextTab ------------------------------------------------------
        //

        createTextTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            var tpl = function () {
                tpl = ''; for (var idx=0; idx<tabInfo.text.length; idx++) {
                    tpl += '{' + idx + '}'
                } return tpl;
            }();

            var tplHtmlEditor = new Ext.Template (
                String.format (pnlEditorTabs.divAndaleMono, tpl)
            )

            if (!tab) {

                tab = this.add ({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , layout     : 'fit'
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true

                  , getEditor: function () {
                        return this.findById ('htmlEditorId')
                    }

                  , getData: function () {
                        return this.getEditor ().getValue ()
                            .replace('<div style="' +
                                 'font-family: andale mono; ' +
                                 'font-size: 13px; ' +
                                 'text-align: justify;">','')
                            .replace('</div>','')
                    }

                  , items : [{
                        xtype  : 'htmleditor'
                      , id     : 'htmlEditorId'
                      , anchor : '100% 100%'
                      , data   : tabInfo.text
                      , tpl    : tplHtmlEditor

                      , enableFont       : false
                      , enableAlignments : false
                      , enableSourceEdit : true
                    }]
                });

                this.activate (tab)
            } else {
                this.activate (tab)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // createImageTab -----------------------------------------------------
        //

      , createImageTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            if (!tab) {

                tab = this.add ({
                    title      : tabInfo.title
                  , id         : tabInfo.id
                  , autoScroll : true
                  , iconCls    : tabInfo.iconCls
                  , closable   : true
                  , bodyStyle  : 'background-color: grey;'

                  , layout : 'hbox'
                  , layoutConfig : {
                        align : 'middle'
                      , pack  : 'center'
                  }

                  , items : [{
                        html : String.format (
                            '<img src="{0}" />', tabInfo.src
                        )
                    }]
                });

                this.activate (tab)
            } else {
                this.activate (tab)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // readTab ------------------------------------------------------------
        //

      , readTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            return (fn != undefined) ? fn (tab) : undefined
        }

        //
        // updateTab ----------------------------------------------------------
        //

      , updateTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )

            if (tabInfo.uuid != undefined) {

                var ti = {
                    id      : tabInfo.id
                  , title   : tab.title
                  , text    : tab.getData ()
                  , iconCls : tab.iconCls
                }

                this.remove (tab)

                Ext.getCmp (
                    'pnlEditorTabsId'
                ).fireEvent (
                    'createTab', ti
                )
            }

            return (fn != undefined) ? fn (tab) : undefined
        }
        
        //
        // deleteTab ----------------------------------------------------------
        //

      , deleteTab : function (tabInfo, fn) {

            var tab = this.findById (
                (tabInfo.uuid != undefined) ? tabInfo.uuid : tabInfo.id
            )
            
            if (tab) {
                this.remove (tab, true)
            }

            return (fn != undefined) ? fn (tab) : undefined
        }
    }
})
