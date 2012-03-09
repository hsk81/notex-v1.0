__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:50:36 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse

from editor.models import ROOT
from editor.models import NODE
from editor.models import LEAF

import base64
import json

###############################################################################################
###############################################################################################

def node (node):

    return {
        'text' : node.name,
        'id' : base64.b32encode (json.dumps (('node', [node.pk]))),
        'cls' : "folder",
        'iconCls' : node.type.icon,
        'leaf' : False,
        'expanded' : False
    }

def nodes (ns):

    return json.dumps (
        map (lambda n: node (n), ns.order_by ('_rank'))
    )

def leaf (leaf):

    return {
        'text' : leaf.name,
        'data' : leaf.text,
        'id' : base64.b32encode (json.dumps (('leaf', [leaf.node.pk, leaf.pk]))),
        'cls' : "file",
        'iconCls' : leaf.type.icon,
        'leaf' : True,
        'expanded' : False
    }

def leafs (ls):

    return json.dumps (
        map (lambda l: leaf (l), ls.order_by ('_rank'))
    )

def tree (ns, ls):

    tns = map (lambda n: (n.rank,n), ns)
    tls = map (lambda l: (l.rank,l), ls)

    return json.dumps (map (
        lambda nal: (type (nal) == NODE) and node (nal) or leaf (nal),
        dict(tns + tls).values ()
    ))

def texts (ts):

    return json.dumps ([])

def read (request):

    (type, ids) = json.loads (base64.b32decode (request.POST['node']))
    
    if type == 'root': # ids == []
        root = ROOT.objects.get (_usid = request.session.session_key)
        js_string = nodes (NODE.objects.filter (_root = root, _node = None))

    elif type == 'node':
        ns = NODE.objects.filter (_node = ids[0])
        ls = LEAF.objects.filter (_node = ids[0])
        js_string = tree (ns,ls)

    elif type == 'leaf':
        js_string = texts (LEAF.objects.get (pk = ids[1]))

    else:
        js_string = json.dumps ([{'success' : 'false'}])

    return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
