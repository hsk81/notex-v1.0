__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:13 PM$"

################################################################################
################################################################################

from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

import views

################################################################################
################################################################################

urlpatterns = patterns ('',

    url (r'^$', views.main, name='view.main'),

    ##
    ## javascript 'includes'
    ##

    url (r'^ReportManager.js$', direct_to_template, {
            'template' : 'ReportManager.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.js'),
    url (r'^ReportManager.util.js$', direct_to_template, {
        'template' : 'ReportManager.util.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='ReportManager.util.js'),
    url (r'^ReportManager.tbar.js$', direct_to_template, {
        'template' : 'ReportManager.tbar.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='ReportManager.tbar.js'),
    url (r'^ReportManager.tree.js$', direct_to_template, {
        'template' : 'ReportManager.tree.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='ReportManager.tree.js'),
    url (r'^ReportManager.crud.js$', direct_to_template, {
            'template' : 'ReportManager.crud.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.crud.js'),
    url (r'^ReportManager.task.js$', direct_to_template, {
            'template' : 'ReportManager.task.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.task.js'),

    url (r'^Editor.js$', direct_to_template, {
        'template' : 'Editor.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='Editor.js'),
    url (r'^Editor.tbar.js$', direct_to_template, {
        'template' : 'Editor.tbar.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='Editor.tbar.js'),

    url (r'^StatusBar.js$', direct_to_template, {
        'template' : 'StatusBar.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='StatusBar.js'),

    url (r'^Dialog.js$', direct_to_template, {
            'template' : 'dialog/Dialog.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='Dialog.js'),
    url (r'^Dialog.openFile.js$', direct_to_template, {
            'template' : 'dialog/Dialog.openFile.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='Dialog.openFile.js'),

    url (r'^CodeMirror.js$', direct_to_template, {
        'template' : 'lib/CodeMirror.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='CodeMirror.js'),
    url (r'^CodeMirror.css$', direct_to_template, {
        'template' : 'lib/CodeMirror.css',
        'mimetype' : 'text/css',
        'extra_context' : {}
    }, name='CodeMirror.css'),

    url (r'^Math.uuid.js$', direct_to_template, {
        'template' : 'lib/Math.uuid.js',
        'mimetype' : 'text/javascript',
        'extra_context' : {}
    }, name='Math.uuid.js'),
    url (r'^Base64.js$', direct_to_template, {
            'template' : 'lib/Base64.js',
            'mimetype' : 'text/javascript',
            'extra_context' : {}
        }, name='Base64.js'),

    ##
    ## crud : create, read, update & delete
    ##

    url (r'^create-project$', views.createProject, name='create-project'),
    url (r'^create-folder$', views.createFolder, name='create-folder'),
    url (r'^create-text$', views.createText, name='create-text'),
    url (r'^create-image$', views.createImage, name='create-image'),
    url (r'^read/$', views.read, name='read'),
    url (r'^update-text$', views.updateText, name='update-text'),
    url (r'^update-image$', views.updateImage, name='update-image'),
    url (r'^decrease-rank/$', views.decrease_rank, name='decrease-rank'),
    url (r'^increase-rank/$', views.increase_rank, name='increase-rank'),
    url (r'^rename/$', views.rename, name='rename'),
    url (r'^delete/$', views.delete, name='delete'),

    ##
    ## export & import: text, html, latex, pdf, file
    ##

    url (r'^export-report/(?P<id>.*)/$', views.export_report, name='export-report'),
    url (r'^export-text/(?P<id>.*)/$', views.export_text, name='export-text'),
    url (r'^export-latex/(?P<id>.*)/$', views.export_latex, name='export-latex'),
    url (r'^export-pdf/(?P<id>.*)/$', views.export_pdf, name='export-pdf'),
    url (r'^export-html/(?P<id>.*)/$', views.export_html, name='export-html'),
    url (r'^import-file/(?P<fid>.*)/$', views.import_file, name='import-file'),

)

################################################################################
################################################################################
