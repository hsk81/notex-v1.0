__author__ = "hsk81"
__date__ = "$Apr 20, 2012 11:35:45 AM$"

################################################################################
################################################################################

from django.conf.urls.defaults import *
from django.contrib import admin

import settings
import views

################################################################################
################################################################################

admin.autodiscover ()

urlpatterns = patterns ('',

    (r'^svc/', include('svc.urls', namespace='svc')),
    (r'^editor/', include('editor.urls', namespace='editor')),
    (r'^admin/doc/', include ('django.contrib.admindocs.urls')),
    (r'^admin/', include (admin.site.urls)),

    (r'^robots\.txt$', views.robots),
)

if not settings.DEBUG:
    handler404 = views.page_not_found

################################################################################
################################################################################
