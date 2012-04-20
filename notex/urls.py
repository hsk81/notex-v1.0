__author__ = "hsk81"
__date__ = "$Apr 20, 2012 11:35:45 AM$"

################################################################################
################################################################################

from django.conf.urls.defaults import *
from django.contrib import admin
from django.http import HttpResponse

import settings
import views

################################################################################
################################################################################

admin.autodiscover ()

urlpatterns = patterns ('',

    (r'^robots\.txt$', lambda r:
        HttpResponse ("User-agent: *\nDisallow: /", mimetype="text/plain")),

    (r'^svc/', include('svc.urls', namespace='svc')),
    (r'^editor/', include('editor.urls', namespace='editor')),
    (r'^admin/doc/', include ('django.contrib.admindocs.urls')),
    (r'^admin/', include (admin.site.urls)),

)

if not settings.DEBUG:
    handler404 = views.page_not_found

################################################################################
################################################################################
