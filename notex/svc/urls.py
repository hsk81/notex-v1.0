__author__ = "hsk81"
__date__ = "$Apr 17, 2012 12:03:15 PM$"

################################################################################
################################################################################

from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template

import views

################################################################################
################################################################################

urlpatterns = patterns ('',
    url(r'^lorem-ipsum/$', views.lorem_ipsum, name='lorem-ipsum'))

def data_urlpatterns (cls, f_obj={}, f_set={}):

    '''
    Returns two url-patters: One for an object and one for a set of objects,
    whereas the corresponding viewer functions return the corresponding data
    structure (using JSON).

    It is possible to 'plug-in' additional viewer functions by setting f_obj
    ('function' returning a single object ) or f_set ('function' returning
    a set of objects).

    The name of the url-patterns are 'json.CLASSNAME' for single objects and
    'json.CLASSNAME_SET' or 'json.ClassName_set' or 'json.classname_set' for a
    set of objects.

    Sometimes the ID of the object is not know. For such cases it is possible to
    use "$0" as a placeholder which is required to be replaced by an actual ID
    before usage.
    '''
    
    lit = cls.__name__
    res = patterns ('',

        ##
        ## format serialization using 'json'
        ##

        url(r'^json/%s/(?P<id>\d+|\$0)/$' % lit,
            lambda req, id: views.object (req, id, cls, format = 'json'),
            name='json.%s'% lit),

        url(r'^json/%s/$' % (lit + (lit.isupper () and '_SET' or '_set')),
            lambda req: views.objects (req, cls, format = 'json'),
            name='json.%s'% (lit + (lit.isupper () and '_SET' or '_set'))),

        ##
        ## format serialization using 'xml'
        ##

        url(r'^xml/%s/(?P<id>\d+|\$0)/$' % lit,
            lambda req, id: views.object (req, id, cls, format = 'xml'),
            name='xml.%s'% lit),

        url(r'^xml/%s/$' % (lit + (lit.isupper () and '_SET' or '_set')),
            lambda req: views.objects (req, cls, format = 'xml'),
            name='xml.%s'% (lit + (lit.isupper () and '_SET' or '_set'))))

    for path, action in zip (f_obj.keys (), f_obj.values ()):

        res = patterns ('',
            url(r'^%/%s/(?P<id>\d+|\$0)/$' % (path, lit),
                action, name='%s.%s'% (path, lit))) + res 

    for path, action in zip (f_set.keys (), f_set.values ()):

        res = patterns ('',
            url(r'^%s/%s/$' % (path, (lit + (lit.isupper () and \
                    '_SET' or '_set'))),
                action, name='%s.%s'% (path, (lit + (lit.isupper () and \
                    '_SET' or '_set'))))) + res

    return res ## enables *overwriting* xml/json

################################################################################
################################################################################

if __name__ == "__main__":

    pass
