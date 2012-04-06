__author__ ="hsk81"
__date__ ="$Apr 6, 2012 12:34:39 PM$"

###############################################################################################
###############################################################################################

import re
import urllib
import exceptions

from datetime import datetime

###############################################################################################
###############################################################################################

def clear (key = None):
    
    if key:
        _lookup_tbl.pop (key, None)
    else:
        _lookup_tbl.clear ()

def apply (value, key = None, strict = False):

    for head, rest in re.findall ("\${(\w+)\|?(.*?)}", value):

        if rest != '': el = '${%s|%s}' % (head,rest)
        else:          el = '${%s}'    %  head

        args = filter (lambda arg: len (arg) > 0, rest.split ('|'))

        if _lookup_tbl.has_key (head):
            value = value.replace (el, _modify (*_lookup (head, args), **{'strict':strict}))
        elif _predef_tbl.has_key (head):
            value = value.replace (el, _modify (*_predef (head, args), **{'strict':strict}))
        elif strict:
            raise UnknowTagException (el)

    if key:
        _lookup_tbl[key] = value

    return value

def _lookup (tag, args):
    return _lookup_tbl[tag], args

_lookup_tbl = {}

def _predef (tag, args):
    return _predef_tbl[tag] (*args or [None]), args

_predef_tbl = {
    'date' : lambda x,*xs: x and datetime.today ().strftime (x) or \
        str (datetime.today ()),
    'time' : lambda x,*xs: x and datetime.now ().time ().strftime (x) or \
        str (datetime.now ().time ()),
}

def _modify (value, args, strict):

    for arg in args:
        ps = re.findall ("\w+", arg)
        op = ps.pop (0)

        if _modify_tbl.has_key (op):
            value = _modify_tbl[op] (value, ps)
        elif strict:
            raise UnknownFilterException (op)

    return value

_modify_tbl = {
    'quote' : lambda value,*args: urllib.quote_plus (value)
}

## ############################################################################################

class UnknownTagException (exceptions.Exception): pass
class UnknownFilterException (exceptions.Exception): pass

###############################################################################################
###############################################################################################
