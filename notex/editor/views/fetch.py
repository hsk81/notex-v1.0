__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:14:46 AM$"

################################################################################
################################################################################

from cStringIO import StringIO
from django.http import HttpResponse
from django.core.cache import cache
from editor.models import NODE
from editor.models import LEAF

import translator
import logging
import zipfile
import base64
import json

################################################################################
################################################################################

logger = logging.getLogger (__name__)

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

    object_key = hash ((request.session.session_key, node.id))
    object_val = cache.get (object_key)

    if object_val:
        if not 'refresh' in request.GET:
            http_response = HttpResponse (object_val)
            http_response['Content-Disposition'] = \
                'attachment;filename="%s.zip"' % node.name

            cache.delete (object_key); return http_response
        else:
            cache.delete (object_key)

    strBuffer = StringIO ()
    zipBuffer = zipfile.ZipFile (strBuffer, 'w', zipfile.ZIP_DEFLATED)

    try:
        fnTranslate (node, node.name, zipBuffer);
        js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : True}])
    except Exception as ex:
        js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : False}])
        logger.error (ex, exc_info=True, extra={'request': request})

    zipBuffer.close ()
    cache.set (object_key, strBuffer.getvalue ())
    strBuffer.close ()

    return HttpResponse (js_string, mimetype='application/json')

def fetchText (request, id):
    return compress (request, id, translator.processToText)

def fetchLatex (request, id):
    return compress (request, id, translator.processToLatex)

def fetchPdf (request, id):
    return compress (request, id, translator.processToPdf)

################################################################################
################################################################################
