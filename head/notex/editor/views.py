from datetime                       import datetime

from django.http                    import HttpResponse
from django.http                    import Http404
from django.views.generic.simple    import direct_to_template
from django.template                import TemplateDoesNotExist

from editor.models import PROJECT
from editor.models import FILE

import json

class VIEW:

    def init (request):

        prj000 = PROJECT.objects.create (
            sid  = request.session.session_key,
            name = 'Random Texts',
            rank = 000,
        )

        _ = FILE.objects.create (
            project = prj000,
            name = 'Table of Contents',
            type = 'toc',
            text = '..',
            rank = 0,
        )

        _ = FILE.objects.create (
            project = prj000,
            name = 'Abstract',
            text = '..',
            rank = 1,
        )

        _ = FILE.objects.create (
            project = prj000,
            name = 'Introduction',
            text = '..',
            rank = 2,
        )

        _ = FILE.objects.create (
            project = prj000,
            name = 'Related Work',
            text = '..',
            rank = 3
        )

        _ = FILE.objects.create (
            project = prj000,
            name = 'Lorem Ipsum',
            text = '..',
            rank = 4
        )

        _ = FILE.objects.create (
            project = prj000,
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
            project = prj001,
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

        ps = PROJECT.objects.filter (sid = request.session.session_key)
        ps = sorted (ps, lambda lhs, rhs: cmp (lhs.rank, rhs.rank))

        if request.POST['node'] == 'root':

            js_string = json.dumps (map (lambda prj: {
                'text': prj.name,
                'id': str (prj.pk),
                'cls': "folder",
                'iconCls': "icon-report"
            }, ps))

        elif (request.POST['node'] in map (lambda prj: str (prj.pk), ps)):

            fs = FILE.objects.filter (project = request.POST['node'])
            fs = sorted (fs, lambda lhs, rhs: cmp (lhs.rank, rhs.rank))

            js_string = json.dumps (map (lambda file: (file.type=='toc') and {
                'text'     : file.name,
                'id'       : '%s.%s' % (request.POST['node'], str (file.pk)),
                'cls'      : "file",
                'iconCls'  : "icon-table",
                'leaf'     : True,
                'expanded' : False
            } or {
                'text'     : file.name,
                'id'       : '%s.%s' % (request.POST['node'], str (file.pk)),
                'cls'      : "folder",
                'iconCls'  : "icon-page",
                'leaf'     : False,
                'expanded' : True
            }, fs))

        else:

            js_string = json.dumps ([])

        return HttpResponse (js_string, mimetype='application/json')

    node = staticmethod(node)

if __name__ == "__main__":

    pass
