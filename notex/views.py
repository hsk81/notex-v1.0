from django.http import HttpResponse
import json

def info (request):

    js_string = json.dumps ({
    	'prj' : 'notex',
        'ver' : '0.1'
    })

    return HttpResponse (u'%s\n' % js_string, mimetype='application/json')
