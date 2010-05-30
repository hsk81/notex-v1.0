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
            type = LEAF_TYPE.objects.get (_code='txt'),
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
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Table of Contents',
            text = '..',
            rank = 0,
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Abstract',
            text = '..',
            rank = 1
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Introduction',
            text = '..',
            rank = 2
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Related Work',
            text = '..',
            rank = 3
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Lorem Ipsum',
            text = '..',
            rank = 4
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Conclusion',
            text = '..',
            rank = 5
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
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

    def nodes (ns):

        return json.dumps (map (lambda node: {
            'text'     : node.name,
            'id'       : base64.b32encode (
                json.dumps (('node', [node.pk]))
            ),
            'cls'      : "folder",
            'iconCls'  : node.type.icon,
            'leaf'     : False,
            'expanded' : False
        }, ns.order_by ('_rank')))

    nodes = staticmethod (nodes)

    def leafs (ls):

        return json.dumps (map (lambda leaf: {
            'text'     : leaf.name,
            'data'     : leaf.text,
            'id'       : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : leaf.type.icon,
            'leaf'     : True,
            'expanded' : False
        }, ls.order_by ('_rank')))

    leafs = staticmethod (leafs)

    def texts (ts):

        return json.dumps ([])

    texts = staticmethod (texts)

    def tree (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['node']))

        if type == 'root': # ids == []

            root = ROOT.objects.get (_usid = request.session.session_key)

            js_string = POST.nodes (
                NODE.objects.filter (_root = root)
            )

        elif type == 'node':

            js_string = POST.leafs (
                LEAF.objects.filter (_node = ids[0])
            )

        elif type == 'leaf':

            js_string = POST.texts (
                LEAF.objects.get (pk = ids[1])
            )

        else:

            js_string = json.dumps ([])

        return HttpResponse (js_string, mimetype='application/json')

    tree = staticmethod (tree)

    def save (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['id']))

        if type == 'leaf':

            try:

                leaf = LEAF.objects.get (pk = ids[1])
                leaf.text = request.POST['data']
                leaf.save ()

                js_string = json.dumps ([{
                    'success' : 'true',
                    'id'      : request.POST['id']
                }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id'      : request.POST['id']
                }])

        else:

            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['id']
            }])

        return HttpResponse (js_string, mimetype='application/json')
    
    save = staticmethod (save)

if __name__ == "__main__":

    pass
