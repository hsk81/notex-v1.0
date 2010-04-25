from django.http                 import HttpResponse
from django.http                 import Http404
from django.views.generic.simple import direct_to_template
from django.template             import TemplateDoesNotExist

import json

class VIEW:

    def main (request):

        return direct_to_template (
            request,
            template='editor.html',
            extra_context= {
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

        if request.POST['node'] == '0':

            js_string = json.dumps([
                { 'text': "Table of Contents", 'id': "0.0", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
                { 'text': "Chapter 1", 'id': "0.1", 'cls' : "folder", 'iconCls': "icon-folder"},
                { 'text': "Chapter 2", 'id': "0.2", 'cls' : "folder", 'iconCls': "icon-folder"},
            ])

        elif request.POST['node'] == '0.1':

            js_string = json.dumps([
                { 'text': "Section 1.1", 'id': "0.1.0", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
                { 'text': "Section 1.1", 'id': "0.1.1", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
                { 'text': "Section 1.2", 'id': "0.1.2", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
            ])

        elif request.POST['node'] == '0.2':

            js_string = json.dumps([
                { 'text': "Section 2.0", 'id': "0.2.0", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
                { 'text': "Section 2.1", 'id': "0.2.1", 'cls' : "file", 'iconCls': "icon-page", 'leaf': True },
            ])

        else:

            js_string = json.dumps([])

        return HttpResponse (js_string, mimetype='application/json')

    node = staticmethod(node)

if __name__ == "__main__":

    pass
