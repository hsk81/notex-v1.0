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

@transaction.commit_on_success
def swapRank (request):

    _, ids = json.loads (base64.b32decode (request.POST['id']))
    _, jds = json.loads (base64.b32decode (request.POST['jd']))

    if len (ids) > 1: base = LEAF.objects.get (pk = ids[1])
    else:             base = NODE.objects.get (pk = ids[0])
    if len (jds) > 1: temp = LEAF.objects.get (pk = jds[1])
    else:             temp = NODE.objects.get (pk = jds[0])

    rank = base.rank
    base.rank = temp.rank
    temp.rank = rank

    base.save ()
    temp.save ()

    js_string = json.dumps ([{
        'id' : request.POST['id'],
        'jd' : request.POST['jd']
    }])

    return HttpResponse (js_string, mimetype='application/json')

################################################################################
################################################################################
