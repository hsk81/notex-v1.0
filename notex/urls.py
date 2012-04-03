from django.conf.urls.defaults import *
from django.contrib import admin
import views

admin.autodiscover ()

urlpatterns = patterns ('',

    (r'^util/', include('util.urls',namespace='util')),
    (r'^svc/', include('svc.urls', namespace='svc')),
    (r'^base/', include('base.urls', namespace='base')),
    (r'^editor/', include('editor.urls', namespace='editor')),

    (r'^admin/doc/', include ('django.contrib.admindocs.urls')),
    (r'^admin/', include (admin.site.urls)),

    url (
        r'^json/info/$', info, name='json.info'
    ),

)
