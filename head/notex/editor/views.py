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
import uuid
import os

class VIEW:

    def init_prj01 (root, path):

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

    init_prj01 = staticmethod (init_prj01)

    def init_prj02 (root, path):

        print "PATH: %s" % path

        prj = NODE.objects.create (
            type = NODE_TYPE.objects.get (_code='prj'),
            root = root,
            name = 'Random Texts',
            rank = 1,
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Lorem Ipsum',
            text = open (os.path.join (path,'lorem-ipsum.txt')).readline (),
            rank = 0,
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Cras Gravida',
            text = open (os.path.join (path,'cras-gravida.txt')).readline (),
            rank = 1
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'Donec Molestie',
            text = open (os.path.join (path,'donec-molestie.txt')).readline (),
            rank = 2
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
            node = prj,
            name = 'In Hac',
            text = open (os.path.join (path,'in-hac.txt')).readline (),
            rank = 3
        )

        _ = LEAF.objects.create (
            type = LEAF_TYPE.objects.get (_code='txt'),
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

        VIEW.init_prj01 (
            root, 'editor/media/'
        )

     ## VIEW.init_prj02 (
     ##     root, 'editor/media/'
     ## )

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
            template ='Viewport.html',
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

    def node (node):

        return {
            'text'     : node.name,
            'id'       : base64.b32encode (
                json.dumps (('node', [node.pk]))
            ),
            'cls'      : "folder",
            'iconCls'  : node.type.icon,
            'leaf'     : False,
            'expanded' : False
        }

    node = staticmethod (node)

    def nodes (ns):

        return json.dumps (
            map (lambda node: POST.node (node), ns.order_by ('_rank'))
        )

    nodes = staticmethod (nodes)

    def leaf (leaf):

        return {
            'text'     : leaf.name,
            'data'     : leaf.text,
            'id'       : base64.b32encode (
                json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : leaf.type.icon,
            'leaf'     : True,
            'expanded' : False
        }

    leaf = staticmethod (leaf)

    def leafs (ls):

        return json.dumps (
            map (lambda leaf: POST.leaf (leaf), ls.order_by ('_rank'))
        )

    leafs = staticmethod (leafs)

    def texts (ts):

        return json.dumps ([])

    texts = staticmethod (texts)

    ##
    ## crud: create, read, update & save
    ##

    def create (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

        if type == 'root':

            try:

                root = ROOT.objects.get (_usid=request.session.session_key)

                node = NODE.objects.create (
                    type = NODE_TYPE.objects.get (_code='prj'),
                    root = root,
                    name = request.POST['name'],
                    rank = request.POST['rank'],
                )

                js_string = json.dumps ([{
                    'success' : 'true',
                    'id'      : base64.b32encode (
                        json.dumps (('node', [node.pk]))
                    )
                }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id  '    : request.POST['nodeId']
                }])
                
        elif type == 'node':

            try:

                leaf = LEAF.objects.create (
                    type = LEAF_TYPE.objects.get (_code='txt'),
                    node = NODE.objects.get (pk=ids[0]),
                    name = request.POST['name'],
                    text = request.POST['data'],
                    rank = int (request.POST['rank'])
                )

                if 'leafId' in request.POST:

                    js_string = json.dumps ([{
                        'success' : 'true',
                        'uuid'    : request.POST['leafId'],
                        'id'      :  base64.b32encode (
                            json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                        )
                    }])

                else:

                    js_string = json.dumps ([{
                        'success' : 'true',
                        'id'      :  base64.b32encode (
                            json.dumps (('leaf', [leaf.node.pk, leaf.pk]))
                        )
                    }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'uuid'    : request.POST['leafId']
                }])

        else:

            js_string = json.dumps ([{
                'success' : 'false',
                'uuid'    : request.POST['leafId']
            }])

        return HttpResponse (js_string, mimetype='application/json')

    create = staticmethod (create)

    def read (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['node']))

        if type == 'root': # ids == []

            root = ROOT.objects.get (_usid = request.session.session_key)
            js_string = POST.nodes (NODE.objects.filter (_root = root))

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

    read = staticmethod (read)

    def update (request):

        try:    id = uuid.UUID (request.POST['leafId'])
        except: id = None

        if id != None: ## create upon update

            return POST.create (request)

        (type, ids) = json.loads (base64.b32decode (request.POST['leafId']))

        if type == 'leaf':

            try:

                leaf = LEAF.objects.get (pk = ids[1])
                leaf.name = request.POST['name']
                leaf.text = request.POST['data']
                leaf.save ()

                js_string = json.dumps ([{
                    'success' : 'true',
                    'id'      : request.POST['leafId']
                }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id'      : request.POST['leafId']
                }])

        else:

            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['leafId']
            }])

        return HttpResponse (js_string, mimetype='application/json')

    update = staticmethod (update)

    def rename (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['nodeId']))

        if type == 'node':

            try:

                node = NODE.objects.get (pk = ids[0])
                node.name = request.POST['name']
                node.save ()

                js_string = json.dumps ([{
                    'success' : 'true',
                    'id'      : request.POST['nodeId'],
                    'name'    : request.POST['name']
                }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id'      : request.POST['nodeId']
                }])

        elif type == 'leaf':

            try:

                leaf = LEAF.objects.get (pk = ids[1])
                leaf.name = request.POST['name']
                leaf.save ()

                js_string = json.dumps ([{
                    'success' : 'true',
                    'id'      : request.POST['nodeId'],
                    'name'    : request.POST['name']
                }])

            except:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id'      : request.POST['nodeId']
                }])

        else:

            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['nodeId']
            }])

        return HttpResponse (js_string, mimetype='application/json')

    rename = staticmethod (rename)

    def delete (request):

        try:    id = uuid.UUID (request.POST['nodeId'])
        except: id = None

        if id != None: ## not created yet

            js_string = json.dumps ([{
                'success' : 'false',
                'id'      : request.POST['leafId']
            }])

        else:

            (type, ids) = json.loads (base64.b32decode (request.POST['id']))

            if type == 'leaf':

                try:

                    leaf = LEAF.objects.get (pk = ids[1])
                    leaf.delete ()

                    js_string = json.dumps ([{
                        'success' : 'true',
                        'id'      : request.POST['id']
                    }])

                except:

                    js_string = json.dumps ([{
                        'success' : 'false',
                        'id'      : request.POST['id']
                    }])

            elif type == 'node':

                    node = NODE.objects.get (pk = ids[0])
                    node.delete ()

                    js_string = json.dumps ([{
                        'success' : 'true',
                        'id'      : request.POST['id']
                    }])

            else:

                js_string = json.dumps ([{
                    'success' : 'false',
                    'id'      : request.POST['id']
                }])

        return HttpResponse (js_string, mimetype='application/json')

    delete = staticmethod (delete)

if __name__ == "__main__":

    pass
