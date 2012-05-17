__author__ = "hsk81"
__date__ = "$Mar 10, 2012 1:07:38 AM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT

from django.db import transaction
from django.http import HttpResponse
from django.db.models import Max

from editor.models import ROOT
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import os.path
import base64
import json
import os

################################################################################
################################################################################

@transaction.commit_on_success
def createProject (request, path = MEDIA_ROOT + 'app/editor/'):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    type = NODE_TYPE.objects.get (_code='project')
    root = ROOT.objects.get (_usid=request.session.session_key)

    node = NODE.objects.create (
        type = type,
        root = root,
        name = request.POST['name'],
        rank = get_next_rank (root))

    type = LEAF_TYPE.objects.get (_code='text')
    text = open (os.path.join (path,'generic/content.rst')).read () \
        .replace ('${PROJECT}', request.POST['name'])

    _ = LEAF.objects.create (
        type = type,
        node = node,
        name = 'content.txt',
        text = text,
        rank = 0)

    type = LEAF_TYPE.objects.get (_code='text')
    text = open (os.path.join (path,'generic/options.yml')).read () \
        .replace ('${PROJECT}', request.POST['name']) \
        .replace ('${AUTHORs}', 'AUTHORs')

    _ = LEAF.objects.create (
        type = type,
        node = node,
        name = 'options.cfg',
        text = text,
        rank = 1)

    js_string = json.dumps ([{
        'success' : True,
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createFolder (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    root = ROOT.objects.get (_usid=request.session.session_key)
    type = NODE_TYPE.objects.get (_code='folder')
    node = NODE.objects.get (pk=ids[0])

    node = NODE.objects.create (
        type = type,
        root = root,
        node = node,
        name = request.POST['name'],
        rank = get_next_rank (node))

    js_string = json.dumps ([{
        'success' : True,
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createText (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    type = LEAF_TYPE.objects.get (_code='text')
    node = NODE.objects.get (pk=ids[0])

    leaf = LEAF.objects.create (
        type = type,
        node = node,
        name = request.POST['name'],
        text = request.POST['data'].replace ('\r\n','\n'),
        rank = get_next_rank (node))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : True,
            'uuid' : request.POST['leafId'],
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : True,
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createImage (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    type = LEAF_TYPE.objects.get (_code='image')
    node = NODE.objects.get (pk=ids[0])

    leaf = LEAF.objects.create (
        type = type,
        node = node,
        name = request.POST['name'],
        text = request.POST['data'],
        rank = get_next_rank (node))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : True,
            'uuid' : request.POST['leafId'],
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : True,
            'id' :  base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################

def get_next_rank (node):

    leaf_rank = None
    leafs = LEAF.objects.filter (_node=node)
    if leafs.count () > 0:
        aggregate = leafs.aggregate (Max ('_rank'))
        if aggregate.has_key ('_rank__max'):
            leaf_rank = aggregate['_rank__max']

    node_rank = None
    nodes = NODE.objects.filter (_node=node)
    if nodes.count () > 0:
        aggregate = nodes.aggregate (Max ('_rank'))
        if aggregate.has_key ('_rank__max'):
            node_rank = aggregate['_rank__max']

    if leaf_rank:
        if node_rank:
            return 1 + max (leaf_rank, node_rank)
        else:
            return 1 + leaf_rank
    else:
        if node_rank:
            return 1 + node_rank
        else:
            return 1

################################################################################
################################################################################
