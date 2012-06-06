__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:36:24 AM$"

################################################################################
################################################################################

from django.db import transaction
from django.http import HttpResponse

from editor.models import NODE
from editor.models import LEAF

import base64
import json

################################################################################
################################################################################

def inc_rank (el):
    el.rank += 1; el.save ()
def dec_rank (el):
    el.rank -= 1; el.save ()

@transaction.commit_on_success
def increase_rank (request):

    _, ids = json.loads (base64.b32decode (request.POST['id']))
    _, jds = json.loads (base64.b32decode (request.POST['jd']))

    if len (ids) > 1: base = LEAF.objects.get (pk = ids[1])
    else:             base = NODE.objects.get (pk = ids[0])
    if len (jds) > 1: temp = LEAF.objects.get (pk = jds[1])
    else:             temp = NODE.objects.get (pk = jds[0])

    if base.node == temp.node.node: ## move down, into subfolder
    
        ls = LEAF.objects.filter (_node=base.node, _rank__gte=temp.node.rank)
        for el in ls: dec_rank (el)
        ns = NODE.objects.filter (_node=base.node, _rank__gte=temp.node.rank)
        for el in ns: dec_rank (el)

        base.node = temp.node
        base.rank = temp.rank - 1
        base.save ()

        for el in LEAF.objects.filter (_node = temp.node): inc_rank (el)
        for el in NODE.objects.filter (_node = temp.node): inc_rank (el)

    elif base.node.node == temp.node: ## move down, out-from subfolder
    
        ls = LEAF.objects.filter (_node=temp.node, _rank__gt=base.node.rank)
        for el in ls: inc_rank (el)
        ns = NODE.objects.filter (_node=temp.node, _rank__gt=base.node.rank)
        for el in ns: inc_rank (el)

        base.node = temp.node
        base.rank = temp.rank
        base.save ()

    else: ## move down

        base.rank, temp.rank = temp.rank, base.rank
        base.save ()
        temp.save ()

    js_string = json.dumps ([{
        'id' : request.POST['id'],
        'jd' : request.POST['jd']
    }])

    return HttpResponse (js_string, mimetype='application/json')

@transaction.commit_on_success
def decrease_rank (request):

    _, ids = json.loads (base64.b32decode (request.POST['id']))
    _, jds = json.loads (base64.b32decode (request.POST['jd']))

    if len (ids) > 1: base = LEAF.objects.get (pk = ids[1])
    else:             base = NODE.objects.get (pk = ids[0])
    if len (jds) > 1: temp = LEAF.objects.get (pk = jds[1])
    else:             temp = NODE.objects.get (pk = jds[0])

    if base.node == temp.node.node: ## move up, into subfolder

        ls = LEAF.objects.filter (_node=base.node, _rank__gt=base.rank)
        for el in ls: dec_rank (el)
        ns = NODE.objects.filter (_node=base.node, _rank__gt=base.rank)
        for el in ns: dec_rank (el)

        base.node = temp.node
        base.rank = temp.rank + 1
        base.save ()

    elif base.node.node == temp.node: ## move up, out-from subfolder

        ls = LEAF.objects.filter (_node=temp.node, _rank__gte=base.node.rank)
        for el in ls: inc_rank (el)
        ns = NODE.objects.filter (_node=temp.node, _rank__gte=base.node.rank)
        for el in ns: inc_rank (el)

        base.node, base_node = temp.node, base.node
        base.rank = temp.rank
        base.save ()

        for el in LEAF.objects.filter (_node = base_node): dec_rank (el)
        for el in NODE.objects.filter (_node = base_node): dec_rank (el)

    else: ## move up

        base.rank, temp.rank = temp.rank, base.rank
        base.save ()
        temp.save ()

    js_string = json.dumps ([{
        'id' : request.POST['id'],
        'jd' : request.POST['jd']
    }])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
