__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:26:29 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.models import NODE
from editor.models import LEAF

import base64
import json
import uuid

################################################################################
################################################################################

@transaction.commit_manually
def delete (request):

    try:
        id = uuid.UUID (request.POST['id'])
    except:
        id = None

    if id != None: ## not created yet
        response = failure (id = None)

    else:
        (type, ids) = json.loads (base64.b32decode (request.POST['id']))
        if type == 'leaf':
            leaf = LEAF.objects.get (pk = ids[1])
            leaf.delete ()
            response = success (id = request.POST['id'])

        elif type == 'node':
            node = NODE.objects.get (pk = ids[0])
            node.delete ()
            response = success (id = request.POST['id'])

        else:
            response = failure (id = request.POST['id'])

    return response

################################################################################

def success (id):
    transaction.commit ()
    return http_response (True, id)

def failure (id):
    transaction.rollback ()
    return http_response (False, id)

def http_response (success, id):

    js_string = json.dumps ({
        'success' : success,
        'id' : id
    })

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
