__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:07:16 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import mimetypes
import zipfile
import os.path
import base64
import json
import os

###############################################################################################
###############################################################################################

def storeFile (request, fid):

    if not mimetypes.inited:
        mimetypes.init

    with os.tmpfile() as file:
        file.write (''.join (request.readlines ()))

        if not zipfile.is_zipfile (file):

            js_string = json.dumps ({
                'success' : 'false',
                'message' : 'ZIP format expected',
                'file_id' : fid
            })

            return HttpResponse (js_string, mimetype='application/json')

        with zipfile.ZipFile (file, 'r') as zipBuffer:

            root = ROOT.objects.get (
                _type = ROOT_TYPE.objects.get (_code='root'),
                _usid = request.session.session_key)

            node = NODE.objects.create (
                type = NODE_TYPE.objects.get (_code='project'),
                root = root,
                name = os.path.splitext (fid)[0],
                rank = NODE.objects.filter (_root = root).count ())

            prev = {node.name: node}

            infolist = zipBuffer.infolist ()
            rankdict = dict (zip (infolist, range (len (infolist))))
            infolist = sorted (infolist, key=lambda info: info.filename)

            for info in infolist:
                with zipBuffer.open (info) as arch:

                    basename = os.path.basename (info.filename)
                    if basename == '': ## is folder?

                        path, name = os.path.split (info.filename[:-1])
                        prev[info.filename[:-1]] = NODE.objects.create (
                            type = NODE_TYPE.objects.get (_code='folder'),
                            root = root,
                            node = prev[path],
                            name = name,
                            rank = rankdict[info])

                    else: ## is not folder!

                        path, name = os.path.split (info.filename)
                        mimetype, encoding = mimetypes.guess_type (name)

                        if mimetype and mimetype.startswith ('image'):
                            code = 'image'
                            text = 'data:%s;base64,%s' % (mimetype, \
                                base64.encodestring (''.join (arch.readlines ())))
                        else:
                            code = 'text'
                            text = ''.join (arch.readlines ())

                        _ = LEAF.objects.create (
                            type = LEAF_TYPE.objects.get (_code=code),
                            node = prev[path],
                            name = name,
                            text = text,
                            rank = rankdict[info])

            js_string = json.dumps ({
                'success' : 'true',
                'file_id' : fid
            })

            return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
