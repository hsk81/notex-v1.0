__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:12:13 PM$"

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
    ## info : general app information
    ##

    url (r'^json/info/$', views.info, name='json.info'),

    ##
    ## crud : create, read, update & delete
    ##

    url (r'^post/create/project$', views.createProject, name='post.createProject'),
    url (r'^post/create/folder$', views.createFolder, name='post.createFolder'),
    url (r'^post/create/text$', views.createText, name='post.createText'),
    url (r'^post/create/image$', views.createImage, name='post.createImage'),
    url (r'^post/read/$', views.read, name='post.read'),
    url (r'^post/update/text$', views.updateText, name='post.updateText'),
    url (r'^post/update/image$', views.updateImage, name='post.updateImage'),
    url (r'^post/update/swap-rank/$', views.swapRank, name='post.swapRank'),
    url (r'^post/rename/$', views.rename, name='post.rename'),
    url (r'^post/delete/$', views.delete, name='post.delete'),

    ##
    ## fetch & store: text, html, latex, pdf, file
    ##

    url (r'^data/fetch-text/(?P<id>.*=)/$', views.fetchText, name='data.fetchText'),
    url (r'^data/fetch-latex/(?P<id>.*=)/$', views.fetchLatex, name='data.fetchLatex'),
    url (r'^data/fetch-pdf/(?P<id>.*=)/$', views.fetchPdf, name='data.fetchPdf'),
    url (r'^data/store-file/(?P<fid>.*)/$', views.storeFile, name='data.storeFile'),
)

################################################################################
################################################################################
