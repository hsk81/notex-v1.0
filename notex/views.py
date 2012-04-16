from django.http import HttpResponse
from django.shortcuts import redirect
import json

def info (request):

    js_string = json.dumps ({
    	'prj' : 'notex',
        'ver' : '0.1'
    })

    return HttpResponse (u'%s\n' % js_string, mimetype='application/json')

def page_not_found (request):

    return redirect ('/editor')
