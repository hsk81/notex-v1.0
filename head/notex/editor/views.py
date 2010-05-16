from datetime                       import datetime

from django.http                    import HttpResponse
from django.http                    import Http404
from django.views.generic.simple    import direct_to_template
from django.template                import TemplateDoesNotExist

from editor.models import PROJECT
from editor.models import FILE

import sys, base64, json

class VIEW:

    def init (request):

        prj000 = PROJECT.objects.create (
            sid  = request.session.session_key,
            name = 'Random Texts',
            rank = 002,
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Table of Contents',
            type = 'toc',
            text = '..',
            rank = 0,
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Abstract',
            text = '..',
            rank = 1,
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Introduction',
            text = '..',
            rank = 2,
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Related Work',
            text = '..',
            rank = 3
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Lorem Ipsum',
            text = '..',
            rank = 4
        )

        _ = FILE.objects.create (
            prj = prj000,
            name = 'Conclusion',
            text = '..',
            rank = 5
        )

        prj001 = PROJECT.objects.create (
            sid  = request.session.session_key,
            name = 'Notex Editor',
            rank = 001,
        )

        _ = FILE.objects.create (
            prj = prj001,
            name = 'Tutorial',
            text = '..',
            rank = 1,
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
                json.dumps ((PROJECT.__name__, [project.pk]))
            ),
            'cls'     : "folder",
            'iconCls' : "icon-report"
        }, projects.order_by ('rank')))

    project_nodes = staticmethod (project_nodes)

    def file_nodes (files):

        return json.dumps (map (lambda file: (file.type=='toc') and {
            'text'     : file.name,
            'id'       : base64.b32encode (
                json.dumps ((FILE.__name__, [file.project.pk, file.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : "icon-table",
            'leaf'     : True,
            'expanded' : False
        } or { # file.type == 'sct'|'idx'
            'text'     : file.name,
            'id'       : base64.b32encode (
                json.dumps ((FILE.__name__, [file.project.pk, file.pk]))
            ),
            'cls'      : "file",
            'iconCls'  : "icon-page",
            'leaf'     : False,
            'expanded' : True
        }, files.order_by ('rank')))

    file_nodes = staticmethod (file_nodes)

    def text_nodes (file):

        return json.dumps ([])

    text_nodes = staticmethod (text_nodes)

    def tree (request):

        (type, ids) = json.loads (base64.b32decode (request.POST['node']))

        if type == 'root': # ids == []

            js_string = POST.project_nodes (
                PROJECT.objects.filter (sid = request.session.session_key)
            )

        elif type == PROJECT.__name__:

            js_string = POST.file_nodes (
                FILE.objects.filter (project = ids[0])
            )

        elif type == FILE.__name__:

            js_string = POST.text_nodes (
                FILE.objects.get (pk = ids[1])
            )

        else:

            js_string = json.dumps ([])

        return HttpResponse (js_string, mimetype='application/json')

    tree = staticmethod (tree)

if __name__ == "__main__":

    pass
