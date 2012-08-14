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
    if request.session.has_key ('timestamp') and 'refresh' not in request.GET:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

    else:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        init (request)

    if not 'silent' in request.GET:
        print >> sys.stderr, "Session ID: %s" % request.session.session_key
        print >> sys.stderr, "Time Stamp: %s" % request.session['timestamp']

    return render_to_response ('viewport.html',
        dictionary=main_args (request),
        context_instance=RequestContext (request))

def main_args (request):

    def get_page_name (page):

        return {
            'home': 'Home',
            'overview': 'Overview',
            'tutorial': 'Tutorial',
            'rest': 'Re-Structured Text',
            'spp': 'SP&P',
            'faq': 'FAQ',
            'download': 'Download',
        }[page]

    page = request.GET.get ('pg', 'home')
    page_name = get_page_name (page)

    return {
        'keywords' : ','.join ([
            'article', 'report', 'editor', 'latex', 'restructured', 'text',
            'pdf', 'html', 'converter', 'sphinx']),

        'description' : 'Edit your articles and reports using re-structured ' +
            'text and convert them to LaTex, PDF or HTML.',

        'page' : page, 'page_name' : page_name
    }

################################################################################
################################################################################

def init (request):
    type = ROOT_TYPE.objects.get (_code='root')
    usid = request.session.session_key

    roots = ROOT.objects.filter (_type=type, _usid=usid)
    if roots.count () > 0: roots.delete ()
    root = ROOT.objects.create (type=type, usid=usid)

    dat_path = os.path.join (settings.STATIC_ROOT, 'app', 'editor', 'dat')

    init_prj01 (root, dat_path, prj_rank=0)
    init_prj02 (root, dat_path, prj_rank=1)
    init_prj03 (root, dat_path, prj_rank=2)
    init_prj04 (root, dat_path, prj_rank=3)


def init_prj01 (root, dat_path, prj_rank=0):
    prj_name = 'Quickstart'
    prj_path = 'quickstart'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path,prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'image', 'quill.b64', 'quill.jpg')


def init_prj02 (root, dat_path, prj_rank=0):
    prj_name = 'Simple Article'
    prj_path = 'simple-article'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')


def init_prj03 (root, dat_path, prj_rank=0):
    prj_name = 'Complex Article'
    prj_path = 'complex-article'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

def init_prj04 (root, dat_path, prj_rank=0):
    prj_name = 'Report'
    prj_path = 'report'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')

    for idx in range (9): leaf, rank = creator.do (
        rank, 'text', 'chapter-%02d.rst' % idx, 'chapter-%02d.txt' % idx)

    leaf, rank = creator.do (rank, 'text', 'footnotes.rst', 'footnotes.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

################################################################################
################################################################################

class NodeCreator:
    def __init__ (self, root):
        self.root = root

    def do (self, rank, code, node_name):

        return NODE.objects.create (
            type=NODE_TYPE.objects.get (_code=code),
            root=self.root,
            name=node_name,
            rank=rank
        ), rank + 1

class LeafCreator:
    def __init__ (self, root, node, path):
        self.root = root
        self.node = node
        self.path = path

    def do (self, rank, code, leaf_name, name=None):

        source = os.path.join (self.path, leaf_name)
        link_name = self.get_uuid_path (self.root.usid)
        os.symlink (source, link_name)

        return LEAF.objects.create (
            type=LEAF_TYPE.objects.get (_code=code),
            node=self.node,
            name=name if name else leaf_name,
            file=link_name,
            rank=rank
        ), rank + 1

    def get_uuid_path (self, session_key):

        session_path = os.path.join (settings.MEDIA_DATA, session_key)
        if not os.path.exists (session_path): os.mkdir (session_path)

        return os.path.join (session_path, str (uuid_random ()))

################################################################################
################################################################################
