from datetime                       import datetime

from django.http                    import HttpResponse
from django.http                    import Http404
from django.views.generic.simple    import direct_to_template
from django.template                import TemplateDoesNotExist

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import sys
import base64
import json

class VIEW:

    def init (request):

        root = ROOT.objects.create (
            type = ROOT_TYPE.objects.get (_code='root'),
            usid = request.session.session_key,
        )

        prj = NODE.objects.create (
            type = NODE_TYPE.objects.get (_code='prj'),
            root = root,
            name = 'Notex Editor',
            rank = 0
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Tutorial',
            text = '..',
            rank = 1
        )

        prj = NODE.objects.create (
            type = NODE_TYPE.objects.get (_code='prj'),
            root = root,
            name = 'Random Texts',
            rank = 1,
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='toc'),
            node = prj,
            name = 'Table of Contents',
            text = '..',
            rank = 0,
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Abstract',
            text = '..',
            rank = 1
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Introduction',
            text = '..',
            rank = 2
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Related Work',
            text = '..',
            rank = 3
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Lorem Ipsum',
            text = '..',
            rank = 4
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='sct'),
            node = prj,
            name = 'Conclusion',
            text = '..',
            rank = 5
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='idx'),
            node = prj,
            name = 'Index',
            text = '..',
            rank = 6
        )

    init = staticmethod (init)

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
            request,
            template ='editor.html',
            extra_context = {
                'sid': request.session.session_key,
                'timestamp': request.session['timestamp']
            })

    main = staticmethod (main)

class DATA:

    def info (request):

        js_string = json.dumps ({
            'app' : 'editor',
            'ver' : '0.1'
        })

        return HttpResponse (u'%s\n' % js_string, mimetype='application/json')

    info = staticmethod (info)

class POST:

    def project_nodes (projects):

        return json.dumps (map (lambda project: {
            'text'    : project.name,
            'id'      : base64.b32encode (
                json.dumps (('project', [project.pk]))
            ),
            'cls'     : "folder",
            'iconCls' : "icon-report"
        }, projects.order_by ('_rank')))

    project_nodes = staticmethod (project_nodes)

    def file_nodes (files):

        return json.dumps (map (lambda file: (file.type.code=='toc') and {
            'text'     : file.name,
            'id'       : base64.b32encode (
                json.dumps (('file', [file.node.pk, file.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : "icon-table",
            'leaf'     : True,
            'expanded' : False
        } or { # file.type.code == 'sct'|'idx'
            'text'     : file.name,
            'id'       : base64.b32encode (
                json.dumps (('file', [file.node.pk, file.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : "icon-page",
            'leaf'     : False,
            'expanded' : True
        }, files.order_by ('_rank')))

    file_nodes = staticmethod (file_nodes)

    def text_nodes (file):

        return json.dumps ([])

    text_nodes = staticmethod (text_nodes)

    def tree (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['node']))

        if type == 'root': # ids == []

            root = ROOT.objects.get (_usid = request.session.session_key)

            js_string = POST.project_nodes (
                NODE.objects.filter (_root = root)
            )

        elif type == 'project':

            js_string = POST.file_nodes (
                LEAF.objects.filter (_node = ids[0])
            )

        elif type == 'file':

            js_string = POST.text_nodes (
                LEAF.objects.get (pk = ids[1])
            )

        else:

            js_string = json.dumps ([])

        return HttpResponse (js_string, mimetype='application/json')

    tree = staticmethod (tree)

if __name__ == "__main__":

    pass
