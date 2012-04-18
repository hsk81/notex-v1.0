__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:13 PM$"

################################################################################
################################################################################

from django.conf.urls.defaults   import *
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
            'template'      : 'ReportManager.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.js'),
    url (r'^ReportManager.tree.js$', direct_to_template, {
            'template'      : 'ReportManager.tree.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.tree.js'),
    url (r'^ReportManager.util.js$', direct_to_template, {
            'template'      : 'ReportManager.util.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.util.js'),
    url (r'^ReportManager.task.js$', direct_to_template, {
            'template'      : 'ReportManager.task.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='ReportManager.task.js'),

    url (r'^Editor.js$', direct_to_template, {
            'template'      : 'Editor.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='Editor.js'),

    url (r'^Dialog.js$', direct_to_template, {
            'template'      : 'dialog/Dialog.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='Dialog.js'),
    url (r'^Dialog.openFile.js$', direct_to_template, {
            'template'      : 'dialog/Dialog.openFile.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='Dialog.openFile.js'),

    url (r'^Math.uuid.js$', direct_to_template, {
            'template'      : 'lib/Math.uuid.js',
            'mimetype'      : 'text/javascript',
            'extra_context' : {}
        }, name='Math.uuid.js'),
    url (r'^Base64.js$', direct_to_template, {
            'template'      : 'lib/Base64.js',
            'mimetype'      : 'text/javascript',
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
    url (r'^swap-rank/$', views.swap_rank, name='swap-rank'),
    url (r'^rename/$', views.rename, name='rename'),
    url (r'^delete/$', views.delete, name='delete'),

    ##
    ## fetch & store: text, html, latex, pdf, file
    ##

    url (r'^fetch-text/(?P<id>.*=)/$', views.fetchText, name='fetch-text'),
    url (r'^fetch-latex/(?P<id>.*=)/$', views.fetchLatex, name='fetch-latex'),
    url (r'^fetch-pdf/(?P<id>.*=)/$', views.fetchPdf, name='fetch-pdf'),
    url (r'^store-file/(?P<fid>.*)/$', views.storeFile, name='store-file'),
)

################################################################################
################################################################################
