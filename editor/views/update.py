__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:40:30 AM$"

################################################################################
################################################################################

from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from django.core import cache

from editor.models import LEAF
from uuid import UUID
from uuid import uuid4 as uuid

import editor.views
import translator
import os.path
import logging
import base64
import shutil
import json
import os

################################################################################
################################################################################

logger = logging.getLogger (__name__)
cache = cache.get_cache ('memcached')

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

    try: id = UUID (request.POST['leafId'])
    except: id = None

    if id is not None:
        return create_on_update (request, create_leaf)

    (type, ids) = json.loads (base64.b32decode (request.POST['leafId']))
    if type == 'leaf':
        leaf = LEAF.objects.get (pk = ids[1])

        if os.path.islink (leaf.file): ## copy-on-write
            source = os.readlink (leaf.file)
            os.remove (leaf.file)
            shutil.copy (source, leaf.file)

        with open (leaf.file, 'w') as uuid_file:
            uuid_file.write (request.POST['data'].encode ("utf-8"))
            leaf.name = request.POST['name']
            leaf.save ()

        while leaf.node.node: leaf.node = leaf.node.node
        object_key = hex (hash ((request.session.session_key,
            translator.processToReport, leaf.node.id)))
        cache.delete (object_key) ## invalidate cache
        object_key = hex (hash ((request.session.session_key,
            translator.processToText, leaf.node.id)))
        cache.delete (object_key) ## invalidate cache
        object_key = hex (hash ((request.session.session_key,
            translator.processToLatex, leaf.node.id)))
        cache.delete (object_key) ## invalidate cache
        object_key = hex (hash ((request.session.session_key,
            translator.processToHtml, leaf.node.id)))
        cache.delete (object_key) ## invalidate cache
        object_key = hex (hash ((request.session.session_key,
            translator.processToPdf, leaf.node.id)))
        cache.delete (object_key) ## invalidate cache

        response = success (request)
    else:
        response = failure (request)

    return response

@transaction.commit_manually
def create_on_update (request, create_leaf):

    if create_leaf is not None:
        response = create_leaf (request)
    else:
        response = failure (request)
        logger.error (ex, exc_info = True, extra = {'request': request})

    return response

################################################################################

def get_path (session_key, filename = None):

    if not filename: filename = str (uuid ())
    path_to = os.path.join (settings.MEDIA_DATA, session_key)
    if not os.path.exists (path_to): os.mkdir (path_to)

    return os.path.join (path_to, filename)

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
