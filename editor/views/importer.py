__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:07:16 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import subprocess
import mimetypes
import tempfile
import logging
import zipfile
import os.path
import base64
import json
import cgi
import os
import re

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

@transaction.commit_manually
def import_file (request, fid):

    with os.tmpfile() as zip_file:
        zip_file.write (''.join (request.readlines ()))
        zip_file.flush ()

        return from_zip (request, fid, zip_file)

def from_zip (request, fid, zip_file):

    if not zipfile.is_zipfile (zip_file):
        return failure (message = 'ZIP format expected', file_id = fid)

    try:
        with zipfile.ZipFile (zip_file, 'r') as zip_buffer:

            root = ROOT.objects.get (
                _type = ROOT_TYPE.objects.get (_code='root'),
                _usid = request.session.session_key)

            return create_project (root, fid, zip_buffer)

    except Exception as ex:
        logger.error (ex, exc_info = True, extra =
        {
            'request' : request,
            'file_id' : fid
        })

        return failure (message = 'Unknown reason', file_id = fid)

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

    prefix = os.path.commonprefix (namelist)
    common = ''
    origin = ''
    parent = {}

    while prefix != '':

        common += prefix
        origin = os.path.normpath (common)
        parent[origin] = node

        prefix = os.path.commonprefix (filter (lambda el: el != '',
            map (lambda el: re.subn ('^' + common, '', el)[0], namelist)))

    latex_path = os.path.join (origin, 'latex')
    html_path = os.path.join (origin, 'html')
    pdf_path = os.path.join (origin, 'pdf')

    for zip_info in infolist:
        with zip_buffer.open (zip_info) as file:

            if zip_info.filename.startswith (latex_path): continue
            if zip_info.filename.startswith (html_path): continue
            if zip_info.filename.startswith (pdf_path): continue

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

    path, name = os.path.split (zip_info.filename)
    path = os.path.normpath (path)

    if not parent.has_key (path): ## no parent node/is folder?
        zi = fake_zip_info (zip_info, rankdict, filename = path)
        create_folder (zi, rankdict, parent)

    if not mimetypes.inited: mimetypes.init
    mimetype, encoding = mimetypes.guess_type (name)

    txt_exts = ['.txt','.rst','.cfg','.yml','.text','.rest','.conf','.yaml']
    img_exts = ['.png','.jpg','.tif','.bmp','.jpeg','.tiff','.exif','.gif']

    if mimetype:
        if mimetype == 'text/plain':
            create_text (zip_info, rankdict, parent, file)
        elif mimetype.startswith ('image'):
            create_image (zip_info, rankdict, parent, file)
        else:
            _, ext = os.path.splitext (name)
            if ext.lower () in txt_exts:
                create_text (zip_info, rankdict, parent, file)
            if ext.lower () in img_exts:
                create_image (zip_info, rankdict, parent, file)
    else:
        _, ext = os.path.splitext (name)
        if ext.lower () in txt_exts:
            create_text (zip_info, rankdict, parent, file)
        if ext.lower () in img_exts:
            create_image (zip_info, rankdict, parent, file)

################################################################################

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
    path = os.path.normpath (path)
    
    if not parent.has_key (path): ## no parent node?
        zi = fake_zip_info (zip_info, rankdict, filename = path)
        create_folder (zi, rankdict, parent)

    parent[zip_info.filename] = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='folder'),
        root = parent[path].root,
        node = parent[path],
        name = name,
        rank = rankdict[zip_info])

def create_image (zip_info, rankdict, parent, file):

    path, name = os.path.split (zip_info.filename)
    path = os.path.normpath (path)

    mimetype, encoding = mimetypes.guess_type (name)
    text = 'data:%s;base64,%s' % \
        (mimetype, base64.encodestring (file.read ()))

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = parent[path],
        name = name,
        text = text,
        rank = rankdict[zip_info])

def create_text (zip_info, rankdict, parent, file):

    path, name = os.path.split (zip_info.filename)
    path = os.path.normpath (path)

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = parent[path],
        name = name,
        text = file.read ().replace ('\r\n','\n'),
        rank = rankdict[zip_info])

################################################################################
################################################################################
