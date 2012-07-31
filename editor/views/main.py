__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:02:55 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.shortcuts import render_to_response
from django.template.context import RequestContext

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

from uuid import uuid4 as uuid_random
from datetime import datetime

import os.path
import sys
import os

################################################################################
################################################################################

def main (request):
    if request.session.has_key ('timestamp'):
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

    else:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        init (request)

    if not 'silent' in request.GET:
        print >> sys.stderr, "Session ID: %s" % request.session.session_key
        print >> sys.stderr, "Time Stamp: %s" % request.session['timestamp']

    return render_to_response (
        'viewport.html', context_instance=RequestContext (request))

################################################################################
################################################################################

def init (request):
    type = ROOT_TYPE.objects.get (_code='root')
    usid = request.session.session_key
    root = ROOT.objects.create (type=type, usid=usid)

    dat_path = os.path.join (settings.STATIC_ROOT, 'app', 'editor', 'dat')

    init_prj01 (root, dat_path, prj_rank=0)
    init_prj02 (root, dat_path, prj_rank=1)
    init_prj03 (root, dat_path, prj_rank=2)
    init_prj04 (root, dat_path, prj_rank=3)


def init_prj01 (root, dat_path, prj_rank=0):
    prj_name = 'Quickstart'
    prj_path = 'quickstart'

    prj, rank = NODE.objects.create (
        type=NODE_TYPE.objects.get (_code='project'),
        root=root,
        name=prj_name,
        rank=prj_rank
    ), 0

    creator = LeafCreator (
        root.usid, prj, os.path.join (dat_path, prj_path))

    rank = creator.do (rank, 'text', 'options.yml', 'options.cfg')
    rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    rank = creator.do (rank, 'image', 'quill.b64', 'quill.jpg')


def init_prj02 (root, dat_path, prj_rank=0):
    prj_name = 'Simple Article'
    prj_path = 'simple-article'

    prj, rank = NODE.objects.create (
        type=NODE_TYPE.objects.get (_code='project'),
        root=root,
        name=prj_name,
        rank=prj_rank
    ), 0

    creator = LeafCreator (
        root.usid, prj, os.path.join (dat_path, prj_path))

    rank = creator.do (rank, 'text', 'options.yml', 'options.cfg')
    rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')


def init_prj03 (root, dat_path, prj_rank=0):
    prj_name = 'Complex Article'
    prj_path = 'complex-article'

    prj, rank = NODE.objects.create (
        type=NODE_TYPE.objects.get (_code='project'),
        root=root,
        name=prj_name,
        rank=prj_rank
    ), 0

    creator = LeafCreator (
        root.usid, prj, os.path.join (dat_path, prj_path))

    rank = creator.do (rank, 'text', 'options.yml', 'options.cfg')
    rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

def init_prj04 (root, dat_path, prj_rank=0):
    prj_name = 'Report'
    prj_path = 'report'

    prj, rank = NODE.objects.create (
        type=NODE_TYPE.objects.get (_code='project'),
        root=root,
        name=prj_name,
        rank=prj_rank
    ), 0

    creator = LeafCreator (
        root.usid, prj, os.path.join (dat_path, prj_path))

    rank = creator.do (rank, 'text', 'options.yml', 'options.cfg')
    rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    rank = creator.do (rank, 'text', 'math.rst', 'math.txt')

    for idx in range (9): rank = creator.do (\
        rank, 'text', 'chapter-%02d.rst' % idx, 'chapter-%02d.txt' % idx)

    rank = creator.do (rank, 'text', 'footnotes.rst', 'footnotes.txt')
    rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

################################################################################
################################################################################

class LeafCreator:
    def __init__ (self, usid, node, path):
        self.usid = usid
        self.node = node
        self.path = path

    def do (self, rank, code, file_name, name=None):

        source = os.path.join (self.path, file_name)
        link_name = self.get_uuid_path (self.usid)
        os.symlink (source, link_name)

        LEAF.objects.create (
            type=LEAF_TYPE.objects.get (_code=code),
            node=self.node,
            name=name if name else file_name,
            file=link_name,
            rank=rank)

        return rank + 1

    def get_uuid_path (self, session_key):
        session_path = os.path.join (settings.MEDIA_DATA, session_key)
        if not os.path.exists (session_path): os.mkdir (session_path)

        return os.path.join (session_path, str (uuid_random ()))

################################################################################
################################################################################
