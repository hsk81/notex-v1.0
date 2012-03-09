__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:30:40 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse
from editor.models import NODE
from editor.models import LEAF

import base64
import json

###############################################################################################
###############################################################################################

def rename (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    if type == 'node':
        try:
            node = NODE.objects.get (pk = ids[0])
            node.name = request.POST['name']
            node.save ()

            js_string = json.dumps ([{
                'success' : 'true',
                'id'      : request.POST['nodeId'],
                'name'    : request.POST['name']
            }])

        except:
            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['nodeId']
            }])

    elif type == 'leaf':
        try:
            leaf = LEAF.objects.get (pk = ids[1])
            leaf.name = request.POST['name']
            leaf.save ()

            js_string = json.dumps ([{
                'success' : 'true',
                'id'      : request.POST['nodeId'],
                'name'    : request.POST['name']
            }])

        except:
            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['nodeId'],
            }])

    else:
        js_string = json.dumps ([{
            'success' : 'false',
            'id'      : request.POST['nodeId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
