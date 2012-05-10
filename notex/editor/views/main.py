__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:02:55 PM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT
from datetime import datetime

from django.views.generic.simple import direct_to_template

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import mimetypes
import os.path
import base64
import sys
import cgi
import os

################################################################################
################################################################################

def main (request):

    if request.session.has_key ('timestamp') != True:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        init (request)

    else:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

    print >> sys.stderr, "Session ID: %s" % request.session.session_key
    print >> sys.stderr, "Time Stamp: %s" % request.session['timestamp']

    return direct_to_template (
        request, template ='Viewport.html', extra_context = {
            'sid': request.session.session_key,
            'timestamp': request.session['timestamp']
        }
    )

################################################################################

def init (request):

    root = ROOT.objects.create (
        type = ROOT_TYPE.objects.get (_code='root'),
        usid = request.session.session_key,
    )

    media_path = os.path.join (MEDIA_ROOT, 'app', 'editor')

    init_prj01 (root, media_path, prj_rank = 0)
    init_prj02 (root, media_path, prj_rank = 1)
    init_prj03 (root, media_path, prj_rank = 2)
    init_prj04 (root, media_path, prj_rank = 3)

################################################################################

def init_prj01 (root, path, prj_rank = 0):

    prj_name = 'Quickstart'
    prj_path = 'quickstart'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = get_text_data (path, os.path.join (prj_path,'index.yml')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = get_text_data (path, os.path.join (prj_path,'index.rst')),
        rank = rank,
    ), rank + 1

def init_prj02 (root, path, prj_rank = 0):

    prj_name = 'Simple Article'
    prj_path = 'simple-article'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = get_text_data (path, os.path.join (prj_path,'index.yml')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = get_text_data (path, os.path.join (prj_path,'index.rst')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'math.txt',
        text = get_text_data (path, os.path.join (prj_path,'math.rst')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = 'emcc.jpg',
        text = get_image_data (path, os.path.join (prj_path,'emcc.jpg')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = "tm'49.jpg",
        text = get_image_data (path, os.path.join (prj_path,"tm'49.jpg")),
        rank = rank,
    ), rank + 1

def init_prj03 (root, path, prj_rank = 0):

    prj_name = 'Complex Article'
    prj_path = 'complex-article'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = get_text_data (path, os.path.join (prj_path,'index.yml')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = get_text_data (path, os.path.join (prj_path,'index.rst')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'math.txt',
        text = get_text_data (path, os.path.join (prj_path,'math.rst')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = 'emcc.jpg',
        text = get_image_data (path, os.path.join (prj_path,'emcc.jpg')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = "tm'49.jpg",
        text = get_image_data (path, os.path.join (prj_path,"tm'49.jpg")),
        rank = rank,
    ), rank + 1

def init_prj04 (root, path, prj_rank = 0):

    prj_name = 'Report'
    prj_path = 'report'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = get_text_data (path, os.path.join (prj_path,'index.yml')),
        rank = rank,
    ), rank + 1

    _, rank  = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = get_text_data (path, os.path.join (prj_path,'index.rst')),
        rank = rank,
    ), rank + 1

    _, rank  = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'math.txt',
        text = get_text_data (path, os.path.join (prj_path,'math.rst')),
        rank = rank,
    ), rank + 1

    for index in range (9):
    
        name = 'chapter-%02d.txt' % index
        rest = 'chapter-%02d.rst' % index

        _, rank  = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = name,
            text = get_text_data (path, os.path.join (prj_path, rest)),
            rank = rank,
        ), rank + 1

    _, rank  = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'footnotes.txt',
        text = get_text_data (path, os.path.join (prj_path,'footnotes.rst')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = 'emcc.jpg',
        text = get_image_data (path, os.path.join (prj_path,'emcc.jpg')),
        rank = rank,
    ), rank + 1

    _, rank = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='image'),
        node = prj,
        name = "tm'49.jpg",
        text = get_image_data (path, os.path.join (prj_path,"tm'49.jpg")),
        rank = rank,
    ), rank + 1

################################################################################

def get_text_data (path, filename):

    with open (os.path.join (path, filename)) as file:

        return file.read ()

def get_image_data (path, filename):

    with open (os.path.join (path, filename)) as file:

        path, name = os.path.split (filename)
        mimetype, encoding = mimetypes.guess_type (name)

        return 'data:%s;base64,%s' % \
            (mimetype, base64.encodestring (file.read ()))

################################################################################
################################################################################
