__author__ = "hsk81"
__date__ = "$Mar 10, 2012 1:07:38 AM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT
from django.http import HttpResponse

from editor.models import ROOT
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import os.path
import base64
import json
import cgi
import os

################################################################################
################################################################################

def createProject (request, path = MEDIA_ROOT + 'app/editor/'):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    root = ROOT.objects.get (_usid=request.session.session_key)

    node = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = request.POST['name'],
        rank = request.POST['rank'])

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = node,
        name = 'index.rst',
        text = cgi.escape (open (os.path.join (path,'generic/index.rst')) \
            .read ()),
        rank = 0)

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = node,
        name = 'index.yml',
        text = cgi.escape (open (os.path.join (path,'generic/index.yml')) \
            .read () \
            .replace ('${PROJECT}', request.POST['name']) \
            .replace ('${AUTHORs}', 'AUTHORs')),
        rank = 1)

    js_string = json.dumps ([{
        'success' : 'true',
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

def createFolder (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    node = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='folder'),
        root = ROOT.objects.get (_usid=request.session.session_key),
        node = NODE.objects.get (pk=ids[0]),
        name = request.POST['name'],
        rank = request.POST['rank'],
    )

    js_string = json.dumps ([{
        'success' : 'true',
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

def createText (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    leaf = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = NODE.objects.get (pk=ids[0]),
        name = request.POST['name'],
        text = request.POST['data'],
        rank = int (request.POST['rank']))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : 'true',
            'uuid' : request.POST['leafId'],
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : 'true',
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

def createImage (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    leaf = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = NODE.objects.get (pk=ids[0]),
        name = request.POST['name'],
        text = request.POST['data'],
        rank = int (request.POST['rank']))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : 'true',
            'uuid' : request.POST['leafId'],
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : 'true',
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
