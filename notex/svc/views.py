__author__ = "hsk81"
__date__ = "$Apr 17, 2012 12:03:15 PM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT

from django.http import HttpResponse
from django.http import Http404
from django.views.generic.simple import direct_to_template
from django.template import TemplateDoesNotExist
from django.core import serializers

from numpy import array
from numpy import transpose

import inspect
import os.path
import json
import re
import os

################################################################################
################################################################################

def direct_to_template_with_query (request, template, extra_context):
    '''
    Directs to a template and includes the get query parameters (from the url)
    into the extra_context dictionary. If in extra_context a key is already
    present, it's value remains *unchanged*.
    '''
    extra_context = dict (zip (
        request.GET.keys () + extra_context.keys (),
        request.GET.values () + extra_context.values ()))

    try: 
        return direct_to_template (
            request, template = template, extra_context = extra_context)

    except TemplateDoesNotExist:
        raise Http404 ()

def lorem_ipsum (request, path = MEDIA_ROOT+'app/svc/txt/lorem-ipsum.txt'):

    mimetype = request.GET.get('mimetype', 'text/plain')
    if mimetype == 'text/html':
        eop = '<br>'
    else:
        eop = '\n'

    if os.path.exists (path):
        with open (path) as f:
            content = re.sub ('\s?\n', eop, ''.join (f.readlines ()))

    else: content = ''

    return HttpResponse (content, mimetype)

##
## TODO: Enable filtering and caching for object[s] and implement proper
##       serialization for *given* queries!
##

def parse (request):

    in_list = request.GET.get ('in', '*')
    in_list = request.GET.get ('include', in_list)
    ex_list = request.GET.get ('ex', [ ])
    ex_list = request.GET.get ('exclude', ex_list)
    rs_list = request.GET.get ('rs', [ ])
    rs_list = request.GET.get ('resolve', rs_list)

    in_regexs = in_list and in_list.split (',')
    ex_regexs = ex_list and ex_list.split (',')
    rs_regexs = rs_list and rs_list.split (',')

    return in_regexs, ex_regexs, rs_regexs

def object (request, id, cls, format = 'json'):

    in_regexs, ex_regexs, rs_regexs = parse (request)

    ##
    ## TODO: * Include 'include', 'exclude' and 'resolve' options for
    ##       tweaking the returned json:
    ##
    ##       * include|in: list of regular expressions for fields to be in-
    ##       cluded in serialization, default: ['*'], over exclude!
    ##
    ##       * resolve|rs: list of regular expressions for fields to be re-
    ##       solved in serialization, default: [], extends include!
    ##
    ##       * exclude|ex: list of regular expressions for fields to be ex-
    ##       cluded from serialization, default: [], below include or resolve!
    ##

    try:
        querysets = [bas.objects.get (id=id)
            for bas in inspect.getmro (cls) if hasattr (bas,'objects')]

        js_string = serializers.serialize (format, querysets)
    except:
        js_string = json.dumps (None)

    return HttpResponse(u'%s\n' %  js_string, mimetype='application/json')

def set2xml_string (qs):
    return ''.join (serializers.serialize ('xml', qs).split('\n')[1:])

def set2json_string (qs):
    return serializers.serialize ('json', qs)

def objects (request, cls, format='json'):

    in_regexs, ex_regexs, rs_regexs = parse (request)

    ##
    ## TODO: * Include 'include' and 'exclude' options for tweaking the
    ##       returned json!
    ##
    ##       * Include 'start', 'limit', 'sort' and 'direction' for tweaking
    ##       the returned json!
    ##

    try:
        querysets = array ([bas.objects.all ()
            for bas in inspect.getmro (cls) if hasattr (bas,'objects')]) \
                .transpose () ## TODO: Check python's std lib for transpose!

        if (format == 'xml') :
            js_string = '<?xml version="1.0" encoding="utf-8"?>\n' \
                '<django-objects version="1.0">%s</django-objects>' % \
                    ''.join (map (set2xml_string, querysets))

        if (format == 'json'):
            js_string = '[%s]' % ', '.join (map (set2json_string, querysets))

    except:
        js_string = json.dumps (None)

    return HttpResponse(u'%s\n' %  js_string, mimetype='application/json')

################################################################################
################################################################################

if __name__ == "__main__":

    pass
