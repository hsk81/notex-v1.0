__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:40:30 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse
from editor.models import LEAF
from editor.views import create

import base64
import json
import uuid

###############################################################################################
###############################################################################################

def updateText (request):

    return update (request, updateText)

def updateImage (request):

    return update (request, updateImage)

def update (request, fnCreateLeaf = None):

    try:    id = uuid.UUID (request.POST['leafId'])
    except: id = None

    if id != None: ## create upon update

        if fnCreateLeaf != None:
            return fnCreateLeaf (request)
        else:
            return create.createText (request)

    (type, ids) = json.loads (base64.b32decode (request.POST['leafId']))
    if type == 'leaf':
        try:
            leaf = LEAF.objects.get (pk = ids[1])
            leaf.name = request.POST['name']
            leaf.text = request.POST['data']
            leaf.save ()

            js_string = json.dumps ([{
                'success' : 'true',
                'id'      : request.POST['leafId']
            }])

        except:
            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['leafId']
            }])

    else:
        js_string = json.dumps ([{
            'success' : 'false',
            'id'      : request.POST['leafId']
        }])

    return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
