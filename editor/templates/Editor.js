var editor = function () {

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function restoreScrollPosition (pnlTab) {
        if (pnlTab.scroll) {
            var editorEl = pnlTab.getEditor ().getEl ();
            editorEl.scroll ('down', pnlTab.scroll.top);
            editorEl.scroll ('right', pnlTab.scroll.left);
        }
    }

    function refreshEditor (pnlTab) {
        pnlTab.getEditor ().fireEvent ('refresh', editor);
    }

    function focusEditor (pnlTab) {
        pnlTab.getEditor ().fireEvent ('focus', editor);
    }

    function blurEditor (pnlTab) {
        pnlTab.getEditor ().fireEvent ('blur', editor);
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function createTextTab (tabInfo) {

        var tab = this.findById (tabInfo.id);
        if (tab) {
            this.activate (tab)
        } else {
            var mode = mapExtToMode(
                getFilenameWithExt (tabInfo.title).extension
            );

            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                layout : 'fit',
                autoScroll : false,
                iconCls : tabInfo.iconCls,
                closable : true,

                getEditor : function () {
                    return this.findById ('editorId' + tabInfo.id);
                },

                getData : function () {
                    return this.getEditor ().getValue ()
                },

                tbar : getEditorTBar (mode),

                items : [{
                    xtype : 'ux-codemirror',
                    anchor : '100% 100%',
                    value : tabInfo.text,

                    initialConfig : {
                        id : 'editorId' + tabInfo.id,
                        value : tabInfo.text,
                        fontSize : this.fontSize,
                        mode : mode
                    }
                }],

                listeners : {
                    activate : function (pnlTab) {
                        restoreScrollPosition (pnlTab);
                        selectTreeNode (pnlTab);
                        refreshEditor (pnlTab);
                        focusEditor (pnlTab);
                    },

                    deactivate : function (pnlTab) {
                        blurEditor (pnlTab);
                    }
                }
            });

            this.activate (tab);
        }
    }

    function beforeTabChange (tabPanel, newTab, curTab) {
        if (curTab) {
            if (curTab.getEditor) {
                var editor = curTab.getEditor ();
                if (editor && editor.getEl) {
                    var element = editor.getEl ();
                    if (element && element.getScroll) {
                        var scroll = element.getScroll ();
                        if (scroll) {
                            curTab.scroll = scroll
                        }
                    }
                }
            }
        }
    }

    function getFilenameWithExt (filename_ext, delimiter) {

        if (!filename_ext) return {}
        if (!delimiter) { delimiter = '.' }

        var array = filename_ext.split (delimiter)
        if (array.length == 0) {
            return {};
        }
        else if (array.length == 1) {
            return { filename: array[0] };
        }
        else {
            return { filename: array[0], extension: array[1] };
        }
    }

    function mapExtToMode (extension) {
        if (extension == 'cfg') {
            return 'yaml-plus';
        } else {
            return 'rst-plus';
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function createImageTab (tabInfo) {

        var tab = this.findById (tabInfo.id);
        if (tab) {
            this.activate (tab)
        } else {
            tab = this.add ({
                title : tabInfo.title,
                id : tabInfo.id,
                autoScroll : true,
                iconCls : tabInfo.iconCls,
                closable : true,
                bodyStyle : 'background-color: grey;',

                layout : 'hbox',
                layoutConfig : {
                    align : 'middle',
                    pack : 'center'
                },

                getViewer : function () {
                    return Ext.getCmp ('imageBoxId' + tabInfo.id)
                },

                getImage : function () {
                    return Ext.get ('imageId' + tabInfo.id)
                },

                getData : function () {
                    return this.getImage ().dom.src
                },

                items : [{
                    xtype : 'box',
                    id : 'imageBoxId' + tabInfo.id,
                    autoEl : {
                        tag : 'img',
                        id : 'imageId' + tabInfo.id,
                        src : tabInfo.text
                    }
                }],

                listeners : {
                    activate : function (pnlTab) {
                        centerImage (pnlTab);
                        selectTreeNode (pnlTab);
                    }
                }
            });

            this.activate (tab)
        }
    }

    /**
     * @see http://stackoverflow.com/questions/4776670/
     *      should-setting-an-image-src-to-data-url-be-available-immediately
     */
    function centerImage (pnlTab) {

        var imageEl = pnlTab.getImage ()
        imageEl.dom.onload = function (event) {

            var imgView = pnlTab.getViewer ()
            var innerEl = imgView.el
            var outerEl = Ext.get (innerEl.up ('div').id)

            var W = outerEl.getWidth ()
            var H = outerEl.getHeight ()
            var w = innerEl.getWidth ()
            var h = innerEl.getHeight ()

            var innerDx = (W - w) / 2.0
            var innerDy = (H - h) / 2.0

            imgView.setPosition (innerDx, innerDy)
        }
    }

    function selectTreeNode (pnlTab) {
        var tree = Ext.getCmp ('reportManager.tree.id');
        var node = tree.getNodeById (pnlTab.id);
        tree.fireEvent ('selectNode', node);
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function deleteTab (tabInfo) {
        var tab = this.findById (tabInfo.id);
        if (tab) { this.remove (tab, true); }
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    function zoom (value) {

        var def_font_size_px = this.defaults.fontSize;
        var def_font_size = def_font_size_px.replace ('px','');
        var new_font_size = def_font_size * value / 100.0;
        if (new_font_size == NaN) { return; }
        var new_font_size_px = new_font_size + 'px';

        var textareas = this.findByType ('ux-codemirror');
        Ext.each (textareas, function (textarea, index) {
            textarea.setFontSize (new_font_size_px)
        });

        this.fontSize = new_font_size_px
    }

    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    return new Ext.TabPanel ({

        defaults : { fontSize: '12px' },

        activeTab : 0,
        id : 'editor.id',
        enableTabScroll : true,
        tabPosition : 'bottom',

        tbar : editorRibbon,

        listeners : {
            beforetabchange : beforeTabChange,
            createTextTab : createTextTab,
            createImageTab : createImageTab,
            deleteTab : deleteTab,
            zoom : zoom
        }
    });
}();
