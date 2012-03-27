__author__="hsk81"
__date__ ="$Mar 27, 2012 1:02:55 PM$"

###############################################################################################
###############################################################################################

from settings import MEDIA_ROOT
from datetime import datetime

from django.views.generic.simple import direct_to_template

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import os.path
import sys
import os

###############################################################################################
###############################################################################################

def init_prj01 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Notex Editor',
        rank = 0
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'Tutorial',
        text = '..',
        rank = 0
    )

def init_prj02 (root, path):

    prj = NODE.objects.create (
        type = NODE_TYPE.objects.get (_code='project'),
        root = root,
        name = 'Random Texts',
        rank = 1,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'Lorem Ipsum',
        text = open (os.path.join (path,'lorem-ipsum.txt')).readline (),
        rank = 0,
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'Cras Gravida',
        text = open (os.path.join (path,'cras-gravida.txt')).readline (),
        rank = 1
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'Donec Molestie',
        text = open (os.path.join (path,'donec-molestie.txt')).readline (),
        rank = 2
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'In Hac',
        text = open (os.path.join (path,'in-hac.txt')).readline (),
        rank = 3
    )

    _ = LEAF.objects.create (
        type = LEAF_TYPE.objects.get (_code='text'),
        node = prj,
        name = 'Aenean Id',
        text = open (os.path.join (path,'aenean-id.txt')).readline (),
        rank = 4
    )

init_prj02 = staticmethod (init_prj02)

def init (request):

    root = ROOT.objects.create (
        type = ROOT_TYPE.objects.get (_code='root'),
        usid = request.session.session_key,
    )

    VIEW.init_prj01 (root, MEDIA_ROOT + 'app/editor/')
    VIEW.init_prj02 (root, MEDIA_ROOT + 'app/editor/')

def main (request):

    if request.session.has_key ('timestamp') != True:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        VIEW.init (request)

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

###############################################################################################
###############################################################################################
