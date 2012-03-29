__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:14:46 AM$"

###############################################################################################
###############################################################################################

from cStringIO import StringIO
from django.http import HttpResponse
from editor.models import NODE
from editor.models import LEAF

import translator
import zipfile
import base64
import json

###############################################################################################
###############################################################################################

def compress (request, id, fnTranslate):

    (type, ids) = json.loads (base64.b32decode (id))

    if type == 'leaf':
        leaf = LEAF.objects.get (id = ids[1])
        node = leaf.node

    else:
        node = NODE.objects.get (id = ids[0])

    while node.node:
        node = node.node

    strBuffer = StringIO ()
    zipBuffer = zipfile.ZipFile (strBuffer, 'w', zipfile.ZIP_DEFLATED)
    fnTranslate (node, node.name, zipBuffer)
    zipBuffer.close ()
    str_value = strBuffer.getvalue ()
    strBuffer.close ()

    response = HttpResponse (str_value)
    response['Content-Disposition'] = 'attachment;filename="%s.zip"' % node.name

    return response

def fetchText (request, id):
    return compress (request, id, translator.processToText)

def fetchLatex (request, id):
    return compress (request, id, translator.processToLatex)

def fetchPdf (request, id):
    return compress (request, id, translator.processToPdf)

###############################################################################################
###############################################################################################
