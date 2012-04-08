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

class Interpolator:

    def __init__ (self, strict = False):

        self._predef_tbl = {
            'date' : lambda x,*xs: x and datetime.today ().strftime (x) or \
                str (datetime.today ()),
            'time' : lambda x,*xs: x and datetime.now ().time ().strftime (x) or \
                str (datetime.now ().time ()),
        }

        self._filter_tbl = {
            'quote' : lambda value,*args: urllib.quote_plus (value),
            'swap' : lambda value,lhs,rhs,*args: value.replace (lhs,rhs)
        }

        self._lookup_tbl = {}
        self._strict = strict

    def apply (self, value, key = None, strict = None):

        for head, rest in re.findall ("\${([^|]+)\|?(.*?)}", value): ## TODO: Generalize!?

            if rest != '':
                el = '${%s|%s}' % (head,rest)
            else:
                el = '${%s}'    %  head

            args = filter (lambda arg: len (arg) > 0, head.split (' ')) ## TODO: Generalize!
            head = args.pop (0)
            rest = filter (lambda arg: len (arg) > 0, rest.split ('|')) ## TODO: Generalize!

            if self._lookup_tbl.has_key (head):
                value = value.replace (el, self._filter (self._lookup (head, args), rest, \
                    **{'strict':strict}))
            elif self._predef_tbl.has_key (head):
                value = value.replace (el, self._filter (self._predef (head, args), rest, \
                    **{'strict':strict}))

            elif (strict != None) and strict:
                raise UnknowTagException (el)
            elif (strict == None) and self._strict:
                raise UnknowTagException (el)

        if key:
            self._lookup_tbl[key] = value

        return value

    def _lookup (self, tag, args):
        return self._lookup_tbl[tag]

    def _predef (self, tag, args):
        return self._predef_tbl[tag] (*args or [None])

    def _filter (self, value, args, strict = None):
        """
        TODO: *Whitespace* arguments not possible, e.g. $("lorem ipsum"|swap ' ' '_'), fix!
        """
        for arg in args:

            ps = re.findall ("\w+", arg) ## TODO: Generalize!
            op = ps.pop (0)

            if self._filter_tbl.has_key (op):
                value = self._filter_tbl[op] (value, *ps)
            elif (strict != None) and strict:
                raise UnknowTagException (el)
            elif (strict == None) and self._strict:
                raise UnknowTagException (el)

        return value

    def clear (self, key = None):

        if key:
            self._lookup_tbl.pop (key, None)
        else:
            self._lookup_tbl.clear ()

    def add_predef (self, key, fn):

        if type (fn) == types.FunctionType:
            self._predef_tbl[key] = fn
        else:
            raise NoFunctionException (fn)

    def del_predef (self, key):
        self._predef_tbl.pop (key, None)

    def add_filter (self, key, fn):

        if type (fn) == types.FunctionType:
            self._filter_tbl[key] = fn
        else:
            raise NoFunctionException (fn)

    def del_filter (self, key):
        self._filter_tbl.pop (key, None)

###############################################################################################
###############################################################################################

class UnknownTagException (exceptions.Exception): pass
class UnknownFilterException (exceptions.Exception): pass
class NoFunctionException (exceptions.Exception): pass

###############################################################################################
###############################################################################################

def apply (value, key = None, strict = None):
    return _interpolator.apply (value, key, strict)
def clear (key = None):
    return _interpolator.clear (key)
def add_predef (key, fn):
    return _interpolator.add_predef (key, fn)
def del_predef (key):
    return _interpolator.del_predef (key)
def add_filter (key, fn):
    return _interpolator.add_filter (key, fn)
def del_filter (key):
    return _interpolator.del_filter (key)

_interpolator = Interpolator ()

###############################################################################################
###############################################################################################

