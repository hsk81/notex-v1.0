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

    while node.node: node = node.node
    object_key = hex (hash ((request.session.session_key, translate, node.id)))
    object_val = cache.get (object_key)

    if object_val:
        if 'fetch' in request.GET:
            if hook: object_val = hook (object_val)

            size = len (object_val)
            temp = tempfile.SpooledTemporaryFile (max_size = size)
            temp.write (object_val)

            http_response = HttpResponse (
                FileWrapper (temp), content_type = 'application/%s' % ext)
            http_response['Content-Disposition'] = \
                'attachment;filename="%s.%s"' % (node.name.encode ("utf-8"), ext)
            http_response['Content-Length'] = size

            temp.seek (0);

        else:
            js_string = json.dumps ([{'id' : node.id, 'name' : node.name, 'success' : True}])
            http_response = HttpResponse (js_string, mimetype='application/json')
            cache.set (object_key, object_val, timeout=15*60) ## refresh

    else:
        http_response, object_val, success = to_zip (request, translate, node)
        if success: cache.set (object_key, object_val, timeout=15*60) ## 15mins

    return http_response

def to_zip (request, translate, node):

    str_buffer = StringIO ()
    zip_buffer = zipfile.ZipFile (str_buffer, 'w', zipfile.ZIP_DEFLATED)

    try:
        translate (node, node.name, zip_buffer);
        success = True

    except Exception as ex:
        logger.error (ex, exc_info = True, extra = {
            'request' : request,
            'stderr_log' : getattr (ex, 'stderr_log', None),
            'stdout_log' : getattr (ex, 'stdout_log', None)
        }); success = False

    js_string = json.dumps ([{'id' : node.id, 'name' : node.name, 'success' : success}])
    http_response = HttpResponse (js_string, mimetype='application/json')

    zip_buffer.close ()
    object_value = str_buffer.getvalue ()
    str_buffer.close ()

    return http_response, object_value, success

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
        zip_buffer.close ()

        return object_vals.pop (0)
        
    return compress (request, id, translator.processToPdf, ext = 'pdf',
        hook = zip2pdf)

################################################################################
################################################################################
