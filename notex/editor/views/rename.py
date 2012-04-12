__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:30:40 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.models import NODE
from editor.models import LEAF

import base64
import json

################################################################################
################################################################################

@transaction.commit_manually
def rename (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    if type == 'node':
        node = NODE.objects.get (pk = ids[0])
        node.name = request.POST['name']
        node.save ()

        response = success (
            nodeId = request.POST['nodeId'],
            name = request.POST['name'])

    elif type == 'leaf':
        leaf = LEAF.objects.get (pk = ids[1])
        leaf.name = request.POST['name']
        leaf.save ()

        response = success (
            nodeId = request.POST['nodeId'],
            name = request.POST['name'])

    else:
        response = failure (nodeId = request.POST['nodeId'], name = None)

    return response

################################################################################

def success (nodeId, name):
    transaction.commit ()
    return http_response (True, nodeId, name)

def failure (nodeId, name):
    transaction.rollback ()
    return http_response (False, nodeId, name)

def http_response (success, nodeId, name):

    js_string = json.dumps ({
        'success' : success,
        'id' : nodeId,
        'name' : name
    })

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
