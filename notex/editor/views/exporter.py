__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:14:46 AM$"

################################################################################
################################################################################

from cStringIO import StringIO

from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
from django.core.cache import cache

from editor.models import NODE
from editor.models import LEAF

import translator
import tempfile
import logging
import zipfile
import base64
import json

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

def compress (request, id, translate, ext = 'zip', hook = None):

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
            if hook:
                object_val = hook (object_val)

            size = len (object_val)
            temp = tempfile.SpooledTemporaryFile (max_size = size)
            temp.write (object_val)

            http_response = HttpResponse (FileWrapper (temp))
            http_response['Content-Disposition'] = \
                'attachment;filename="%s.%s"' % (node.name, ext)
            http_response['Content-Length'] = size

            temp.seek (0)
            cache.delete (object_key)

            return http_response
        else:
            cache.delete (object_key)

    str_buffer = StringIO ()
    zip_buffer = zipfile.ZipFile (str_buffer, 'w', zipfile.ZIP_DEFLATED)

    try:
        translate (node, node.name, zip_buffer);
        js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : True}])
    except Exception as ex:
        js_string = json.dumps ([{
            'id' : node.id, 'name' : node.name, 'success' : False}])

        logger.error (ex, exc_info = True, extra =
        {
            'request' : request,
            'stderr_log' : getattr (ex, 'stderr_log', None),
            'stdout_log' : getattr (ex, 'stdout_log', None)
        })

    zip_buffer.close ()
    cache.set (object_key, str_buffer.getvalue ())
    str_buffer.close ()

    return HttpResponse (js_string, mimetype='application/json')

def export_report (request, id):
    return compress (request, id, translator.processToReport)

def export_text (request, id):
    return compress (request, id, translator.processToText)

def export_latex (request, id):
    return compress (request, id, translator.processToLatex)

def export_html (request, id):
    return compress (request, id, translator.processToHtml)

def export_pdf (request, id):

    def zip2pdf (object_val):

        str_buffer = StringIO (object_val)
        zip_buffer = zipfile.ZipFile (str_buffer, 'r', zipfile.ZIP_STORED)
        object_vals = [zip_buffer.read (info) for info in zip_buffer \
            .infolist () if info.filename.lower ().endswith ('pdf')]
        result_val = object_vals.pop (0)
        zip_buffer.close ()

        return result_val
        
    return compress (request, id, translator.processToPdf, ext = 'pdf',
        hook = zip2pdf)

################################################################################
################################################################################
