__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:57 PM$"

################################################################################
################################################################################

from settings import SITE_NAME
from django.shortcuts import redirect
from django.views.generic.simple import direct_to_template

################################################################################
################################################################################

def page_not_found (request):

    return redirect ('/%s/editor/' % SITE_NAME)

def robots (request):

    return direct_to_template (
        request, template ='robots.txt', mimetype = 'text/plain'
    )

################################################################################
################################################################################
