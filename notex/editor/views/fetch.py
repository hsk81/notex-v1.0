__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:14:46 AM$"

################################################################################
################################################################################

from cStringIO import StringIO
from django.http import HttpResponse
from editor.models import NODE
from editor.models import LEAF

import translator
import zipfile
import base64
import json

################################################################################
################################################################################

def compress (request, id, fnTranslate):

    (type, ids) = json.loads (base64.b32decode (id))
    if type == 'leaf':
        leaf = LEAF.objects.get (id = ids[1])
        node = leaf.node
    else:
        node = NODE.objects.get (id = ids[0])

    while node.node:
        node = node.node

    if _cache.has_key (node.id):
        if not 'refresh' in request.GET:
            return _cache.pop (node.id)
        else:
            del (_cache[node.id])

    strBuffer = StringIO ()
    zipBuffer = zipfile.ZipFile (strBuffer, 'w', zipfile.ZIP_DEFLATED)

    try:
        fnTranslate (node, node.name, zipBuffer); js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : True
        }])
    except: ## TODO: Log exceptions!
        js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : False
        }])

    zipBuffer.close ()
    str_value = strBuffer.getvalue ()
    strBuffer.close ()

    _cache[node.id] = HttpResponse (str_value)
    _cache[node.id]['Content-Disposition'] = 'attachment;filename="%s.zip"' % \
        node.name

    return HttpResponse (js_string, mimetype='application/json')

_cache = {} ## TODO: Replace with memcached!

def fetchText (request, id):
    return compress (request, id, translator.processToText)

def fetchLatex (request, id):
    return compress (request, id, translator.processToLatex)

def fetchPdf (request, id):
    return compress (request, id, translator.processToPdf)

################################################################################
################################################################################
