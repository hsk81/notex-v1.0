from datetime                    import datetime

from django.http                 import HttpResponse
from django.http                 import Http404
from django.views.generic.simple import direct_to_template
from django.template             import TemplateDoesNotExist

import json

class VIEW:

    def init (request):

        request.session['projects'] = {
            '1': { 'type': 'prj', 'name': 'Project "Alpha"' },
            '2': { 'type': 'prj', 'name': 'Project "Beta"'  }
        }

        request.session['files'] = {
            '1.0': { 'type': 'toc', 'name': 'Table of Contents', 'text': ''},
            '1.1': { 'type': 'chp', 'name': 'Chapter 1.1', 'text': '' },
            '1.2': { 'type': 'chp', 'name': 'Chapter 1.2', 'text': '' },
            '2.0': { 'type': 'toc', 'name': 'Table of Contents', 'text': ''},
            '2.1': { 'type': 'chp', 'name': 'Chapter 2.1', 'text': '' },
            '2.2': { 'type': 'chp', 'name': 'Chapter 2.2', 'text': '' },
            '2.3': { 'type': 'chp', 'name': 'Chapter 2.3', 'text': '' },
        }

    init = staticmethod (init)

    def main (request):

        if request.session.has_key ('timestamp') != True:

            VIEW.init (request)

        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        print "Session ID: %s" % request.session.session_key
        print "Time Stamp: %s" % request.session['timestamp']

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

    def node (request):

        if request.POST['node'] == 'root':

            ds = request.session['projects']

            ls = zip(ds.keys (), ds.values ())
            ls = sorted (ls, lambda (k1,v1), (k2,v2): cmp (k1,k2))

            js_string = json.dumps (map (lambda (key, value): {
                'text': value['name'],
                'id': key,
                'cls': "folder",
                'iconCls': "icon-report"
            }, ls))

        elif (request.POST['node'] in request.session['projects'].keys ()):

            ds = request.session['files']

            ls = zip(ds.keys (), ds.values ())
            ls = filter (lambda (k,v): k.startswith (request.POST['node']), ls)
            ls = sorted (ls, lambda (k1,v1), (k2,v2): cmp (k1,k2))

            js_string = json.dumps (map (lambda (k,v): (v['type']=='toc') and {
                'text'     : v['name'],
                'id'       : k,
                'cls'      : "file",
                'iconCls'  : "icon-table",
                'leaf'     : True,
                'expanded' : False
            } or {
                'text'     : v['name'],
                'id'       : k,
                'cls'      : "folder",
                'iconCls'  : "icon-page",
                'leaf'     : False,
                'expanded' : True
            }, ls))

        else:

            js_string = json.dumps([])

        return HttpResponse (js_string, mimetype='application/json')

    node = staticmethod(node)

if __name__ == "__main__":

    pass
