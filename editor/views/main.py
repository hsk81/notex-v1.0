__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:02:55 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.views.generic.simple import direct_to_template

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

from datetime import datetime
from uuid import uuid4 as uuid

import mimetypes
import os.path
import base64
import sys
import os

################################################################################
################################################################################

def main (request):

    if request.session.has_key('timestamp'):
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

    else:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        init (request)

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

    type = ROOT_TYPE.objects.get (_code='root')
    usid = request.session.session_key
    root = ROOT.objects.create (type = type, usid = usid)

    source_path = os.path.join (settings.STATIC_ROOT, 'app', 'editor')

    init_prj01 (root, source_path, prj_rank = 0)
    init_prj02 (root, source_path, prj_rank = 1)
    init_prj03 (root, source_path, prj_rank = 2)
    init_prj04 (root, source_path, prj_rank = 3)

################################################################################

def init_prj01 (root, source_path, prj_rank = 0):

    prj_name = 'Quickstart'
    prj_path = 'quickstart'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'options.yml')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'options.cfg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'content.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'content.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,"quill.jpg")))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "quill.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

def init_prj02 (root, source_path, prj_rank = 0):

    prj_name = 'Simple Article'
    prj_path = 'simple-article'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'options.yml')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'options.cfg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'content.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'content.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'math.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'math.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'emcc.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = 'emcc.jpg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,"tm'49.jpg")))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "tm'49.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'wiki.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "wiki.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

def init_prj03 (root, source_path, prj_rank = 0):

    prj_name = 'Complex Article'
    prj_path = 'complex-article'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'options.yml')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'options.cfg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'content.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'content.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'math.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'math.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'emcc.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = 'emcc.jpg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,"tm'49.jpg")))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "tm'49.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'wiki.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "wiki.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

def init_prj04 (root, source_path, prj_rank = 0):

    prj_name = 'Report'
    prj_path = 'report'

    prj, rank = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = prj_name,
        rank = prj_rank
    ), 0

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'options.yml')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'options.cfg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'content.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'content.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'math.rst')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'math.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    for index in range (9):
    
        name = 'chapter-%02d.txt' % index
        rest = 'chapter-%02d.rst' % index

        with open (get_uuid_path (root.usid), 'w') as uuid_file:
            uuid_file.write (get_text_data (source_path, os.path.join (prj_path,rest)))

            _, rank  = LEAF.objects.create (
                type = LEAF_TYPE.objects.get (_code='text'),
                node = prj,
                name = name,
                file = uuid_file.name,
                rank = rank,
            ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_text_data (source_path, os.path.join (prj_path,'footnotes.rst')))

        _, rank  = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='text'),
            node = prj,
            name = 'footnotes.txt',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'emcc.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = 'emcc.jpg',
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,"tm'49.jpg")))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "tm'49.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

    with open (get_uuid_path (root.usid), 'w') as uuid_file:
        uuid_file.write (get_image_data (source_path, os.path.join (prj_path,'wiki.jpg')))

        _, rank = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='image'),
            node = prj,
            name = "wiki.jpg",
            file = uuid_file.name,
            rank = rank,
        ), rank + 1

################################################################################

def get_uuid_path (session_key):

    session_path = os.path.join (settings.MEDIA_DATA, session_key)
    if not os.path.exists (session_path): os.mkdir (session_path)

    return os.path.join (session_path, str (uuid ()))

def get_text_data (path, filename):

    with open (os.path.join (path, filename)) as file:

        return file.read ()

def get_image_data (path, filename):

    with open (os.path.join (path, filename)) as file:

        path, name = os.path.split (filename)
        if not mimetypes.inited: mimetypes.init ()
        mimetype, encoding = mimetypes.guess_type (name)

        return 'data:%s;base64,%s' % \
            (mimetype, base64.encodestring (file.read ()))

################################################################################
################################################################################
