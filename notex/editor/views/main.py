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

import os.path
import sys
import cgi
import os

################################################################################
################################################################################

def init_prj01 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Quickstart',
        rank = 0
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = open (os.path.join (path,'quickstart/index.rst')).read (),
        rank = 0,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = open (os.path.join (path,'quickstart/index.yml')).read (),
        rank = 1,
    )

def init_prj02 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Simple Article',
        rank = 1
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = open (os.path.join (path,'simple-article/index.rst')).read (),
        rank = 0,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = open (os.path.join (path,'simple-article/index.yml')).read (),
        rank = 1,
    )

def init_prj03 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Complex Article',
        rank = 2
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = open (os.path.join (path,'complex-article/index.rst')).read (),
        rank = 0,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = open (os.path.join (path,'complex-article/index.yml')).read (),
        rank = 1,
    )

def init_prj04 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Report',
        rank = 3
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.txt',
        text = open (os.path.join (path,'report/index.rst')).read (),
        rank = 0,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'index.cfg',
        text = open (os.path.join (path,'report/index.yml')).read (),
        rank = 1,
    )

def init (request):

    root = ROOT.objects.create (
        type = ROOT_TYPE.objects.get (_code='root'),
        usid = request.session.session_key,
    )

    init_prj01 (root, MEDIA_ROOT + 'app/editor/')
    init_prj02 (root, MEDIA_ROOT + 'app/editor/')
    init_prj03 (root, MEDIA_ROOT + 'app/editor/')
    init_prj04 (root, MEDIA_ROOT + 'app/editor/')

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
################################################################################
