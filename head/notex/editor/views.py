from django.http                 import HttpResponse
from django.http                 import Http404
from django.views.generic.simple import direct_to_template
from django.template             import TemplateDoesNotExist

import json

class VIEW:

    def main (request, id):

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

    pass

if __name__ == "__main__":

    pass
