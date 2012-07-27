__author__ = "hsk81"
__date__ = "$Mar 10, 2012 1:07:38 AM$"

################################################################################
################################################################################

from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from django.db.models import Max

from editor.models import ROOT
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

from uuid import uuid4 as uuid

import os.path
import base64
import json
import os

################################################################################
################################################################################

@transaction.commit_on_success
def createProject (request, path = None):

    if not path:
        path = os.path.join (settings.STATIC_ROOT, 'app', 'editor', 'dat')

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))
    data = json.loads (request.POST['data'])

    project = data['project']
    authors = data['authors']
    fontpsz = data['fontSize']

    if data['documentType'] == 'report':
        if data['columns'] == 1:
            columns = '\\\\onecolumn'
        else:
            columns = '\\\\twocolumn'
        if data['title']:
            mktitle = '\\\\maketitle'
        else:
            mktitle = "''"
        if data['toc']:
            mktable = '\\\\cleardoublepage\\\\tableofcontents'
            mkamble = "''"
        else:
            mktable = "''"
            mkamble = '''|
            \\\\pagestyle{myheadings}
            \\\\pagenumbering{arabic}
            \\\\markboth{\\\\textsc{${project}}}{\\\\textsc{${author}}}
            '''

        ymlfile = 'generic/options-manual.yml'
        doctype = 'manual'

    else:
        if data['columns'] == 1:
            columns = '\\\\onecolumn'
        else:
            columns = '\\\\twocolumn'
        if data['title']:
            mktitle = '\\\\maketitle'
        else:
            mktitle = "''"
        if data['toc']:
            mktable = '\\\\tableofcontents\\\\hrule'
        else:
            mktable = "''"

        mkamble = '''|
        \\\\pagestyle{myheadings}
        \\\\pagenumbering{arabic}
        \\\\markboth{\\\\textsc{${project}}}{\\\\textsc{${author}}}
        '''
        ymlfile = 'generic/options-howto.yml'
        doctype = 'howto'

    if data['index']:
        mkindex = '\\\\printindex'
    else:
        mkindex = "''"

    if data['content'] == 'tutorial':
        rstfile = 'generic/content-intro.rst'
    else:
        rstfile = 'generic/content-empty.rst'

    type = NODE_TYPE.objects.get (_code='project')
    root = ROOT.objects.get (_usid=request.session.session_key)

    node = NODE.objects.create (
        type = type,
        root = root,
        name = data['project'],
        rank = request.POST['rank'])

    type = LEAF_TYPE.objects.get (_code='text')
    text = open (os.path.join (path, rstfile)).read ().decode ("utf-8") \
        .replace ('${PROJECT}', project)

    uuid_path = os.path.join (settings.MEDIA_DATA, str (uuid ()))
    with open (get_path (request.session.session_key), 'w') as uuid_file:
        uuid_file.write (text.encode ("utf-8"))

        _ = LEAF.objects.create (
            type = type,
            node = node,
            name = 'content.txt',
            file = uuid_file.name,
            rank = 0)

    type = LEAF_TYPE.objects.get (_code='text')
    text = open (os.path.join (path, ymlfile)).read ().decode ("utf-8") \
        .replace ('${MKAMBLE}', mkamble) \
        .replace ('${PROJECT}', project) \
        .replace ('${AUTHORS}', authors) \
        .replace ('${DOCTYPE}', doctype) \
        .replace ('${FONTPSZ}', fontpsz) \
        .replace ('${COLUMNS}', columns) \
        .replace ('${MKTITLE}', mktitle) \
        .replace ('${MKTABLE}', mktable) \
        .replace ('${MKINDEX}', mkindex)

    with open (get_path (request.session.session_key), 'w') as uuid_file:
        uuid_file.write (text.encode ("utf-8"))

        _ = LEAF.objects.create (
            type = type,
            node = node,
            name = 'options.cfg',
            file = uuid_file.name,
            rank = 1)

    js_string = json.dumps ([{
        'success' : True,
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createFolder (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    root = ROOT.objects.get (_usid=request.session.session_key)
    type = NODE_TYPE.objects.get (_code='folder')
    node = NODE.objects.get (pk=ids[0])

    node = NODE.objects.create (
        type = type,
        root = root,
        node = node,
        name = request.POST['name'],
        rank = get_next_rank (node))

    js_string = json.dumps ([{
        'success' : True,
        'id' : base64.b32encode (json.dumps (('node', [node.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createText (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    type = LEAF_TYPE.objects.get (_code='text')
    node = NODE.objects.get (pk=ids[0])
    text = request.POST['data'].replace ('\r\n','\n')

    with open (get_path (request.session.session_key), 'w') as uuid_file:
        uuid_file.write (text.encode ("utf-8"))

        leaf = LEAF.objects.create (
            type = type,
            node = node,
            name = request.POST['name'],
            file = uuid_file.name,
            rank = get_next_rank (node))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : True,
            'uuid' : request.POST['leafId'],
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : True,
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def createImage (request):

    (_, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

    type = LEAF_TYPE.objects.get (_code='image')
    node = NODE.objects.get (pk=ids[0])
    text = request.POST['data']

    with open (get_path (request.session.session_key), 'w') as uuid_file:
        uuid_file.write (text)

        leaf = LEAF.objects.create (
            type = type,
            node = node,
            name = request.POST['name'],
            file = uuid_file.name,
            rank = get_next_rank (node))

    if 'leafId' in request.POST:
        js_string = json.dumps ([{
            'success' : True,
            'uuid' : request.POST['leafId'],
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    else:
        js_string = json.dumps ([{
            'success' : True,
            'id' : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk])))}])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################

def get_path (session_key, filename = None):

    if not filename: filename = str (uuid ())
    path_to = os.path.join (settings.MEDIA_DATA, session_key)
    if not os.path.exists (path_to): os.mkdir (path_to)

    return os.path.join (path_to, filename)

def get_next_rank (node):

    leaf_rank = None
    leafs = LEAF.objects.filter (_node=node)
    if leafs.count () > 0:
        aggregate = leafs.aggregate (Max ('_rank'))
        if aggregate.has_key ('_rank__max'):
            leaf_rank = aggregate['_rank__max']

    node_rank = None
    nodes = NODE.objects.filter (_node=node)
    if nodes.count () > 0:
        aggregate = nodes.aggregate (Max ('_rank'))
        if aggregate.has_key ('_rank__max'):
            node_rank = aggregate['_rank__max']

    if leaf_rank:
        if node_rank:
            return 1 + max (leaf_rank, node_rank)
        else:
            return 1 + leaf_rank
    else:
        if node_rank:
            return 1 + node_rank
        else:
            return 1

################################################################################
################################################################################
