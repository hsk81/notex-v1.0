from django.conf.urls.defaults import *
from django.contrib            import admin
from views                     import DATA

admin.autodiscover()

urlpatterns = patterns('',

    (r'^svc/', include('svc.urls', namespace='svc')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs'
    # to INSTALLED_APPS to enable admin documentation:
    
    (r'^admin/doc/', include('django.contrib.admindocs.urls')),
    (r'^admin/', include(admin.site.urls)),

  # url(
  #     r'^$',
  #     direct_to_template,
  #     {'template': 'base.html',
  #      'extra_context': {}
  #     },
  #     name="base"
  # ),

    url(
        r'^json/info/$',
        DATA.info,
        name='json.info'
    ),

)
