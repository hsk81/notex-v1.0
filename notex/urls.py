__author__ = "hsk81"
__date__ = "$Apr 20, 2012 11:35:45 AM$"

################################################################################
################################################################################

from django.conf.urls import *
from django.contrib import admin

import settings
import views

################################################################################
################################################################################

admin.autodiscover ()

urlpatterns = patterns ('',
    (r'^editor/', include('editor.urls', namespace='editor')),
    (r'^admin/doc/', include ('django.contrib.admindocs.urls')),
    (r'^admin/', include (admin.site.urls)),

    url (r'^checkout/', views.checkout, name='checkout'),
)

if settings.DEBUG:
    urlpatterns += patterns ('',
        url (r'^(?P<path>favicon.ico)$', 'django.views.static.serve', {
            'document_root': settings.STATIC_ROOT,
        }),
    )

else:
    handler404 = views.page_not_found

################################################################################
################################################################################
