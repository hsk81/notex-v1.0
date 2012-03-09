__author__ = "hsk81"
__date__ = "$Mar 10, 2012 1:07:38 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse

from editor.models import ROOT
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import base64
import json

###############################################################################################
###############################################################################################

def createProject (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    try:
        root = ROOT.objects.get (_usid=request.session.session_key)

        node = NODE.objects.create (
            type = NODE_TYPE.objects.get (_code='project'),
            root = root,
            name = request.POST['name'],
            rank = request.POST['rank'],
        )

        js_string = json.dumps ([{
            'success' : 'true',
            'id' : base64.b32encode (json.dumps (('node', [node.pk])))
        }])

    except:
        js_string = json.dumps ([{
            'success' : 'false',
            'id' : request.POST['nodeId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

def createFolder (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    try:
        node = NODE.objects.create (
            type = NODE_TYPE.objects.get (_code='folder'),
            root = ROOT.objects.get (_usid=request.session.session_key),
            node = NODE.objects.get (pk=ids[0]),
            name = request.POST['name'],
            rank = request.POST['rank'],
        )

        js_string = json.dumps ([{
            'success' : 'true',
            'id' : base64.b32encode (json.dumps (('node', [node.pk])))
        }])

    except:
        js_string = json.dumps ([{
            'success' : 'false',
            'id' : request.POST['nodeId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

def createText (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    try:
        leaf = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = NODE.objects.get (pk=ids[0]),
            name = request.POST['name'],
            text = request.POST['data'],
            rank = int (request.POST['rank'])
        )

        if 'leafId' in request.POST:
            js_string = json.dumps ([{
                'success' : 'true',
                'uuid' : request.POST['leafId'],
                'id' :  base64.b32encode (
                    json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                )
            }])

        else:
            js_string = json.dumps ([{
                'success' : 'true',
                'id' :  base64.b32encode (
                    json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                )
            }])

    except:
        js_string = json.dumps ([{
            'success' : 'false',
            'uuid' : request.POST['leafId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

def createImage (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    try:
        leaf = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = NODE.objects.get (pk=ids[0]),
            name = request.POST['name'],
            text = request.POST['data'],
            rank = int (request.POST['rank'])
        )

        if 'leafId' in request.POST:
            js_string = json.dumps ([{
                'success' : 'true',
                'uuid' : request.POST['leafId'],
                'id' :  base64.b32encode (
                    json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                )
            }])

        else:
            js_string = json.dumps ([{
                'success' : 'true',
                'id' :  base64.b32encode (
                    json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                )
            }])

    except:
        js_string = json.dumps ([{
            'success' : 'false',
            'uuid' : request.POST['leafId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
