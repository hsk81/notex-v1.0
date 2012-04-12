__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:40:30 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.models import LEAF

import editor.views
import logging
import base64
import json
import uuid

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

@transaction.commit_manually
def updateText (request):

    from editor.views import create
    return update (request, editor.views.create.createText)

@transaction.commit_manually
def updateImage (request):

    from editor.views import create
    return update (request, create.createImage)

@transaction.commit_manually
def update (request, create_leaf = None):

    try:    id = uuid.UUID (request.POST['leafId'])
    except: id = None

    if id != None:
        return create_on_update (request, create_leaf)
        
    (type, ids) = json.loads (base64.b32decode (request.POST['leafId']))
    if type == 'leaf':
        try:
            leaf = LEAF.objects.get (pk = ids[1])
            leaf.name = request.POST['name']
            leaf.text = request.POST['data']
            leaf.save ()

            response = success (request)
        except:
            response = failure (request)
    else:
        response = failure (request)

    return response

@transaction.commit_manually
def create_on_update (request, create_leaf):

    if create_leaf != None:
        response = create_leaf (request)
    else:
        logger.error (
            "create_leaf not set, function expected",
            exc_info=True,
            extra={'request': request})

        response = failure (request)

    return response

################################################################################

def success (request):
    transaction.commit ()
    return http_response (request, success = True)

def failure (request):
    transaction.rollback ()
    return http_response (request, success = False)

def http_response (request, success):

    js_string = json.dumps ([{
        'success' : success,
        'id' : request.POST['leafId']
    }])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################

