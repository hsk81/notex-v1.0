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
    """
    An interpolator stores associations between a tag like ${tag}, ${tag|arg0|arg1|..|argn},
    ${tag|filter} or ${tag|filter arg1 arg2 .. 'argn'} with a static or dynamic content. If
    after the tag a filter is given, then it will be applied to the content. Using these asso -
    ciations it interpolates string containing interpolation tags.

    The tag parameters (if any) follow the tag (like filters) after a pipe '|' symbol, whereas
    filter parameters (if any) are separated by whitespace.

    The pre-defined tags are:

      * ${date}, ${date|format-directive}:

        Are replaced by the current date, and formatted using the given format directive. See
        http://docs.python.org/library/datetime.html#strftime-strptime-behavior for possible
        directives.

      * ${time, ${time|format-directive}:

        Are replaced by the current time, and formatted using the given format directive. See
        http://docs.python.org/library/datetime.html#strftime-strptime-behavior for possible
        directives.

    The pre-defined filters are:

      * quote:

        Applies url quoting to a string; see http://docs.python.org/library/urllib.html#
        urllib.quote_plus for a detailed description.
    """

    def __init__ (self, strict = False):
        """
        Initiates a string interpolator.

        Args:
            strict:
                Enables interpolator wide strict mode, which means that an interpolation raises
                either an UnknownTagException, if the interpolated string still contains tags,
                which have not been defined, or it raises an UnknownFilterException if an
                undefined filter is used.
        """
        self._predef_tbl = {
            'date' : lambda x,*xs: x and datetime.today ().strftime (x) or \
                str (datetime.today ()),
            'time' : lambda x,*xs: x and datetime.now ().time ().strftime (x) or \
                str (datetime.now ().time ()),
        }

        self._filter_tbl = {
            'quote' : lambda value,*args: urllib.quote_plus (value),
        }

        self._lookup_tbl = {}
        self._strict = strict

    def apply (self, value, key = None, strict = None):
        """
        Replaces interpolation tags within a string with their corresponding content and returns
        it.

        Further for later use, it optionally associates the interpolated string with a tag. In
        strict mode, if after the interpolation the string still contains some unknown tags,
        then an exception is raised.

        Args:
            value: string to be interpolated containing the interpolation tags.
            key: tag name with which the interpolated string should be associated with.
            strict: sets strict mode by overwriting the interpolator wide strict mode.

        Returns:
            Interpolated string with all tags replaced where possible.

        Raises:
            UnknownTagException:
                if string contains an unknown tag, but only if strict mode is set, otherwise no
                exception is raised and tag remains in interpolated string.
            UnknownFilterException:
                if string contains an unknown filter, but only if strict mode is set, otherwise
                no exception is raised.
        """
        for head, rest in re.findall ("\${(\w+)\|?(.*?)}", value):

            if rest != '':
                el = '${%s|%s}' % (head,rest)
            else:
                el = '${%s}'    %  head

            args = filter (lambda arg: len (arg) > 0, rest.split ('|'))

            if self._lookup_tbl.has_key (head):
                value = value.replace (el, self._filter (*self._lookup (head, args), \
                    **{'strict':strict}))
            elif self._predef_tbl.has_key (head):
                value = value.replace (el, self._filter (*self._predef (head, args), \
                    **{'strict':strict}))
            elif (strict != None) and strict:
                raise UnknowTagException (el)
            elif (strict == None) and self._strict:
                raise UnknowTagException (el)

        if key:
            self._lookup_tbl[key] = value

        return value

    def _lookup (self, tag, args):
        return self._lookup_tbl[tag], args

    def _predef (self, tag, args):
        return self._predef_tbl[tag] (*args or [None]), args

    def _filter (self, value, args, strict = None):
        """
        TODO: *Whitespace* arguments not possible, e.g. $("lorem ipsum"|swap ' ' '_'), fix!
        """
        for arg in args:

            ps = re.findall ("\w+", arg)
            op = ps.pop (0)

            if self._filter_tbl.has_key (op):
                value = self._filter_tbl[op] (value, ps)
            elif (strict != None) and strict:
                raise UnknowTagException (el)
            elif (strict == None) and self._strict:
                raise UnknowTagException (el)

        return value

    def clear (self, key = None):
        """
        Clears one or all associations between an interpolation tag and the corresponding
        content(s).

        Args:
            key: tag to clear; if not set, then all tags will be cleared. If provided tag is
                 unknown then clear has no effect.
        """
        if key:
            self._lookup_tbl.pop (key, None)
        else:
            self._lookup_tbl.clear ()

    def add_predef (self, key, fn):
        """
        Associates a pre-defined dynamic content with a tag. The content is required to be a
        (lambda) function.

        Args:
            key: name of the tag the association is created for.
            fn: function describing the dynamic content.

        Raises:
            NoFunctionException: if fn should not be of a FunctionType.
        """
        if type (fn) == types.FunctionType:
            self._predef_tbl[key] = fn
        else:
            raise NoFunctionException (fn)

    def del_predef (self, key):
        self._predef_tbl.pop (key, None)

    def add_filter (self, key, fn):
        """
        Add a filter to the interpolator; it's required to be a (lambda) function.

        Args:
            key: name of filter.
            fn: function implementing the filter.

        Raises:
            NoFunctionException: if fn should not be of a FunctionType.
        """
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
    return _interpolator.apply (value, kye, strict)
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

