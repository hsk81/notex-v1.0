from django.conf.urls.defaults   import *
from django.views.generic.simple import direct_to_template

from views import VIEW
from views import DATA
from views import POST

urlpatterns = patterns('',

    url(
        r'^$', VIEW.main, name='view.main'
    ),

    ##
    ## javascript 'includes'
    ##

    url(
        r'^Math.uuid.js$',
        direct_to_template, {
            'template'      : 'Math.uuid.js',
            'extra_context' : {}
        },
        name='Math.uuid.js'
    ),

    url(
        r'^DAL.js$',
        direct_to_template, {
            'template'      : 'DAL.js',
            'extra_context' : {}
        },
        name='DAL.js'
    ),

    url(
        r'^OpenFileDialog.js$',
        direct_to_template, {
            'template'      : 'OpenFileDialog.js',
            'extra_context' : {}
        },
        name='OpenFileDialog.js'
    ),

    url(
        r'^ReportManager.js$',
        direct_to_template, {
            'template'      : 'ReportManager.js',
            'extra_context' : {}
        },
        name='ReportManager.js'
    ),

    url(
        r'^ReportManagerTree.js$',
        direct_to_template, {
            'template'      : 'ReportManagerTree.js',
            'extra_context' : {}
        },
        name='ReportManagerTree.js'
    ),

    url(
        r'^EditorTabs.js$',
        direct_to_template, {
            'template'      : 'EditorTabs.js',
            'extra_context' : {}
        },
        name='EditorTabs.js'
    ),

    ##
    ## info : general app information
    ##

    url(
        r'^json/info/$', DATA.info, name='json.info'
    ),

    ##
    ## crud : create, read, update & delete
    ##

    url(
        r'^post/create/project$', POST.createNodeOfTypeProject, name='post.createNodeOfTypeProject'
    ),
    url(
        r'^post/create/folder$', POST.createNodeOfTypeFolder, name='post.createNodeOfTypeFolder'
    ),
    url(
        r'^post/create/text$', POST.createLeafOfTypeText, name='post.createLeafOfTypeText'
    ),
    url(
        r'^post/create/image$', POST.createLeafOfTypeImage, name='post.createLeafOfTypeImage'
    ),

    url(
        r'^post/read/$', POST.read, name='post.read'
    ),

    url(
        r'^post/update/text$', POST.updateLeafOfTypeText, name='post.updateLeafOfTypeText'
    ),
    url(
        r'^post/update/image$', POST.updateLeafOfTypeImage, name='post.updateLeafOfTypeImage'
    ),

    url(
        r'^post/rename/$', POST.rename, name='post.rename'
    ),

    url(
        r'^post/delete/$', POST.delete, name='post.delete'
    ),

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
    