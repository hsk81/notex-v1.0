__author__ = "hsk81"
__date__ = "$Mar 10, 2012 12:07:16 AM$"

###############################################################################################
###############################################################################################

from django.http import HttpResponse

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

import subprocess
import mimetypes
import tempfile
import zipfile
import os.path
import base64
import json
import cgi
import os
import re

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

            orig = os.path.join (node.name, 'report')
            prev = {orig: node}

            infolist = zipBuffer.infolist ()
            rankdict = dict (zip (infolist, range (len (infolist))))
            infolist = sorted (infolist, key=lambda info: info.filename)

            for info in infolist:
                with zipBuffer.open (info) as arch:

                    if not info.filename.startswith (orig):
                        continue ## not in 'report' sub-folder

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

                        #######################################################################
                        if name.endswith ('.diff'): ## need to patch?
                        #######################################################################

                            nodes = LEAF.objects.filter (
                                _node = prev[path],
                                _name = re.sub ('\.diff$', '', name))

                            if nodes.count () == 1:
                                node = nodes[0]

                                _, ftext_path = tempfile.mkstemp ()
                                ftext = open (ftext_path, 'w')
                                ftext.write (node.text)
                                ftext.close ()

                                _, fdiff_path = tempfile.mkstemp ()
                                fdiff = open (fdiff_path, 'w')
                                fdiff.write (''.join (arch.readlines ()))
                                fdiff.close ()

                                try:
                                    subprocess.check_call (['patch', ftext_path, fdiff_path, \
                                        '-s'])

                                    ftext = open (ftext_path, 'r')
                                    node.text = ftext.read ()
                                    ftext.close ()
                                    node.save ()

                                except:
                                    pass

                                subprocess.call (['rm', fdiff_path, '-f'])
                                subprocess.call (['rm', ftext_path, '-f'])

                        #######################################################################
                        elif mimetype and mimetype.startswith ('image'): ## an image?
                        #######################################################################

                            code = 'image'
                            text = 'data:%s;base64,%s' % (mimetype, base64.encodestring ( \
                                ''.join (arch.readlines ())))

                            _ = LEAF.objects.create (
                                type = LEAF_TYPE.objects.get (_code=code),
                                node = prev[path],
                                name = name,
                                text = text,
                                rank = rankdict[info])

                        #######################################################################
                        else: ## neither diff patch nor image, so assume plain text!
                        #######################################################################

                            code = 'text'
                            text = cgi.escape (''.join (arch.readlines ()), quote=True)

                            _ = LEAF.objects.create (
                                type = LEAF_TYPE.objects.get (_code=code),
                                node = prev[path],
                                name = name,
                                text = text,
                                rank = rankdict[info])

                        #######################################################################
                        #######################################################################

            js_string = json.dumps ({
                'success' : 'true',
                'file_id' : fid
            })

            return HttpResponse (js_string, mimetype='application/json')

###############################################################################################
###############################################################################################
