__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:40:30 AM$"

################################################################################
################################################################################

from django.conf import settings
from django.db import transaction
from django.http import HttpResponse

from editor.models import LEAF
from uuid import uuid4 as uuid

import editor.views
import os.path
import logging
import base64
import json
import os

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

@transaction.commit_manually
def updateText (request):

    return update (request, editor.views.create.createText)

@transaction.commit_manually
def updateImage (request):

    return update (request, editor.views.create.createImage)

@transaction.commit_manually
def update (request, create_leaf = None):

    try: id = uuid.UUID (request.POST['leafId'])
    except: id = None

    if id != None:
        return create_on_update (request, create_leaf)
        
    (type, ids) = json.loads (base64.b32decode (request.POST['leafId']))
    if type == 'leaf':

        uuid_path = os.path.join (settings.MEDIA_ROOT, 'dat', str (uuid ()))
        with open (uuid_path, 'w') as uuid_file:

            uuid_file.write (request.POST['data'].encode ("utf-8"))

            leaf = LEAF.objects.get (pk = ids[1])
            leaf.name = request.POST['name']
            leaf.file = uuid_file.name
            leaf.save ()

            response = success (request)
    else:
        response = failure (request)

    return response

@transaction.commit_manually
def create_on_update (request, create_leaf):

    if create_leaf != None:
        response = create_leaf (request)
    else:
        response = failure (request)
        logger.error (ex, exc_info = True, extra = {'request': request})

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
