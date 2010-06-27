from django.conf.urls.defaults   import *
from django.views.generic.simple import direct_to_template

from views import VIEW
from views import DATA
from views import POST

urlpatterns = patterns('',

    url(
        r'^$', VIEW.main, name='view.main'
    ),

    url(
        r'^reportManager.js$',
        direct_to_template, {
            'template'      : 'reportManager.js',
            'extra_context' : {}
        },
        name='reportManager.js'
    ),

    url(
        r'^editorTabs.js$',
        direct_to_template, {
            'template'      : 'editorTabs.js',
            'extra_context' : {}
        },
        name='editorTabs.js'
    ),

    url(
        r'^json/info/$', DATA.info, name='json.info'
    ),

    url(
        r'^post/tree/$', POST.tree, name='post.tree'
    ),

    url(
        r'^post/save/$', POST.save, name='post.save'
    ),

    url(
        r'^post/save/all/$', POST.save, name='post.save_all'
    ),

    url(
        r'^post/create/$', POST.create, name='post.create'
    ),

    url(
        r'^post/read/$', POST.read, name='post.read'
    ),

    url(
        r'^post/update/$', POST.update, name='post.update'
    ),

    url(
        r'^post/delete/$', POST.delete, name='post.delete'
    ),

    url(
        r'^post/crud/$', POST.crud, name='post.crud'
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
    