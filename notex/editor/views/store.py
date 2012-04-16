__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:07:16 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.lib import PathUtil

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import subprocess
import mimetypes
import tempfile
import zipfile
import os.path
import base64
import json
import cgi
import os
import re

################################################################################
################################################################################

@transaction.commit_manually
def storeFile (request, fid):

    with os.tmpfile() as zip_file:
        zip_file.write (''.join (request.readlines ()))
        zip_file.flush ()

        if not zipfile.is_zipfile (zip_file):
            return failure (message = 'ZIP format expected', file_id = fid)

        root = ROOT.objects.get (
            _type = ROOT_TYPE.objects.get (_code='root'),
            _usid = request.session.session_key)

        with zipfile.ZipFile (zip_file, 'r') as zip_buffer:
            return create_project (root, fid, zip_buffer)

def create_project (root, fid, zip_buffer):

    node = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = os.path.splitext (fid)[0],
        rank = NODE.objects.filter (_root = root).count ())

    infolist = zip_buffer.infolist ()
    rankdict = dict (zip (infolist, range (len (infolist))))
    infolist = sorted (infolist, key=lambda zip_info: zip_info.filename)
    namelist = map (lambda zi: zi.filename, infolist)

    base = os.path.commonprefix (namelist)
    if base == '':
        return failure (message = 'Single report root expected', file_id = fid)

    origin = os.path.join (PathUtil.head (base), 'report')
    parent = {origin: node}

    if not any (map (lambda i: i.filename.startswith (origin), infolist)):
        return failure (message = 'Sub-directory "report" expected',
            file_id = fid)

    for zip_info in infolist:
        with zip_buffer.open (zip_info) as file:
            if not zip_info.filename.startswith (origin): continue
            process_zip_info (zip_info, rankdict, parent, file)

    return success (message = None, file_id = fid)

################################################################################

def success (message, file_id):
    transaction.commit ()
    return http_response (True, message, file_id)

def failure (message, file_id):
    transaction.rollback ()
    return http_response (False, message, file_id)

def http_response (success, message, file_id):

    js_string = json.dumps ({
        'success' : success,
        'message' : message,
        'file_id' : file_id
    })

    return HttpResponse (js_string, mimetype='application/json')

################################################################################

def process_zip_info (zip_info, rankdict, parent, file):

    basename = os.path.basename (zip_info.filename)
    if basename != '': ## is file?
        if not mimetypes.inited:
            mimetypes.init

        path, name = os.path.split (zip_info.filename)
        mimetype, encoding = mimetypes.guess_type (name)

        if not parent.has_key (path): ## no parent node/is folder?
            zi = fake_zip_info (zip_info, rankdict, filename = path)
            create_folder (zi, rankdict, parent)

        if mimetype and mimetype.startswith ('image'):
            create_image (zip_info, rankdict, parent, file)
        else: ## assume text!
            create_text (zip_info, rankdict, parent, file)

################################################################################

## TODO: If sub-folders or PDF file then the ranks get messed up; fix!
def fake_zip_info (zip_info, rankdict, filename):

    for zi in rankdict:
        if rankdict[zi] >= rankdict[zip_info]:
            rankdict[zi] += 1

    zi = zipfile.ZipInfo (filename = filename)
    rankdict[zi] = rankdict[zip_info] - 1

    return zi

################################################################################

def create_folder (zip_info, rankdict, parent):

    path, name = os.path.split (zip_info.filename)
    parent[zip_info.filename] = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='folder'),
        root = parent[path].root,
        node = parent[path],
        name = name,
        rank = rankdict[zip_info])

def create_image (zip_info, rankdict, parent, file):
    create_leaf (zip_info, rankdict, parent, file, code = 'image')

def create_text (zip_info, rankdict, parent, file):
    create_leaf (zip_info, rankdict, parent, file, code = 'text')

def create_leaf (zip_info, rankdict, parent, file, code):

    path, name = os.path.split (zip_info.filename)
    mimetype, encoding = mimetypes.guess_type (name)

    if code == 'image':
        text = 'data:%s;base64,%s' % (mimetype, base64.encodestring \
            (''.join (file.readlines ())))
    else:
        text = cgi.escape (''.join (file.readlines ()), quote=True)

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code=code),
        node = parent[path],
        name = name,
        text = text,
        rank = rankdict[zip_info])

################################################################################
################################################################################
