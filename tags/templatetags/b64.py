__author__ = "hsk81"
__date__ = "$Apr 20, 2012 16:06:45 PM$"

################################################################################
################################################################################

from django import template
from django.template.defaultfilters import stringfilter

import base64

################################################################################
################################################################################

register = template.Library ()

################################################################################
################################################################################

@register.filter
@stringfilter
def b64_encode (value, urlsafe = False):
    if urlsafe:
        return base64.urlsafe_b64encode (value)
    else:
        return base64.b64encode (value)

b64_encode.is_safe = True

@register.filter
@stringfilter
def b64_decode (value, urlsafe = False):
    if urlsafe:
        return base64.urlsafe_b64decode (value)
    else:
        return base64.b64decode (value)

b64_decode.is_safe = True

################################################################################
################################################################################
