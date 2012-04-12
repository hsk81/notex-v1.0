__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:26:29 AM$"

################################################################################
################################################################################

from django.http import HttpResponse
from editor.models import NODE
from editor.models import LEAF

import base64
import json
import uuid

################################################################################
################################################################################

def delete (request):

    try:    id = uuid.UUID (request.POST['id'])
    except: id = None

    if id != None: ## not created yet
        js_string = json.dumps ([{
            'success' : False
        }])

    else:

        (type, ids) = json.loads (base64.b32decode (request.POST['id']))
        if type == 'leaf':
            try:
                leaf = LEAF.objects.get (pk = ids[1])
                leaf.delete ()

                js_string = json.dumps ([{
                    'success' : True,
                    'id'      : request.POST['id']
                }])

            except:
                js_string = json.dumps ([{
                    'success' : False,
                    'id'      : request.POST['id']
                }])

        elif type == 'node':
                node = NODE.objects.get (pk = ids[0])
                node.delete ()

                js_string = json.dumps ([{
                    'success' : True,
                    'id'      : request.POST['id']
                }])

        else:
            js_string = json.dumps ([{
                'success' : False,
                'id'      : request.POST['id']
            }])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
