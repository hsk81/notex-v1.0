from django.conf.urls.defaults   import *
from django.views.generic.simple import direct_to_template

from views import VIEW
from views import DATA
from views import POST

urlpatterns = patterns ('',

    url (r'^$', VIEW.main, name='view.main'),

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

    url (r'^json/info/$', DATA.info, name='json.info'),

    ##
    ## crud : create, read, update & delete
    ##

    url (r'^post/create/project$', POST.createNodeOfTypeProject, name='post.createNodeOfTypeProject'),
    url (r'^post/create/folder$', POST.createNodeOfTypeFolder, name='post.createNodeOfTypeFolder'),
    url (r'^post/create/text$', POST.createLeafOfTypeText, name='post.createLeafOfTypeText'),
    url (r'^post/create/image$', POST.createLeafOfTypeImage, name='post.createLeafOfTypeImage'),
    url (r'^post/read/$', POST.read, name='post.read'),
    url (r'^post/update/text$', POST.updateLeafOfTypeText, name='post.updateLeafOfTypeText'),
    url (r'^post/update/image$', POST.updateLeafOfTypeImage, name='post.updateLeafOfTypeImage'),
    url (r'^post/update/swap-rank/$', POST.swapRank, name='post.swapRank'),
    url (r'^post/rename/$', POST.rename, name='post.rename'),
    url (r'^post/delete/$', POST.delete, name='post.delete'),
    url (r'^post/delete/$', POST.delete, name='post.delete'),

    url (r'^data/fetch-text/(?P<id>.*=)/$', DATA.fetchText, name='data.fetchText'),
    url (r'^data/fetch-html/(?P<id>.*=)/$', DATA.fetchHtml, name='data.fetchHtml'),
    url (r'^data/fetch-latex/(?P<id>.*=)/$', DATA.fetchLatex, name='data.fetchLatex'),
    url (r'^data/fetch-pdf/(?P<id>.*=)/$', DATA.fetchPdf, name='data.fetchPdf'),

    url (r'^data/store-file/(?P<fid>.*)/$', DATA.storeFile, name='data.storeFile'),
)

if __name__ == "__main__":

    pass

else:

    from svc.urls import data_urlpatterns
    from models   import *

    #
    # TODO: Security/Session information validation required! ..
    #

    urlpatterns += data_urlpatterns (ROOT)
    urlpatterns += data_urlpatterns (NODE)
    urlpatterns += data_urlpatterns (LEAF)
    