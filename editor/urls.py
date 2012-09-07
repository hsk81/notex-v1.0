__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:13 PM$"

################################################################################
################################################################################

from django.conf.urls import url, patterns
import views

################################################################################
################################################################################

urlpatterns = patterns ('',

    url (r'^$', views.main, name='main'),

    ##
    ## navigation menu
    ##

    url (r'^home/$', views.home, name='home'),
    url (r'^overview/$', views.overview, name='overview'),
    url (r'^tutorial/$', views.tutorial, name='tutorial'),
    url (r'^rest/$', views.rest, name='rest'),
    url (r'^faq/$', views.faq, name='faq'),
    url (r'^download/$', views.download, name='download'),

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
    url (r'^decrease-rank/$', views.decrease_rank, name='decrease-rank'),
    url (r'^increase-rank/$', views.increase_rank, name='increase-rank'),
    url (r'^rename/$', views.rename, name='rename'),
    url (r'^delete/$', views.delete, name='delete'),

    ##
    ## export & import: text, html, latex, pdf, file
    ##

    url (r'^export-report/(?P<id>.*)/$', views.export_report, name='export-report'),
    url (r'^export-text/(?P<id>.*)/$', views.export_text, name='export-text'),
    url (r'^export-latex/(?P<id>.*)/$', views.export_latex, name='export-latex'),
    url (r'^export-pdf/(?P<id>.*)/$', views.export_pdf, name='export-pdf'),
    url (r'^export-html/(?P<id>.*)/$', views.export_html, name='export-html'),
    url (r'^import-file/(?P<fid>.*)/$', views.import_file, name='import-file'),

)

################################################################################
################################################################################
