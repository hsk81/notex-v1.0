#!/usr/bin/env python2

__author__ ="hsk81 <hasan.karahan81@gmail.com>"
__date__ ="$Apr 12, 2012 11:29:13 PM$"

################################################################################
################################################################################

import os

################################################################################
################################################################################

class PathUtil:

    def head (self, path):
        """
        >>> self.head ('')
        ''
        >>> self.head ('abc')
        'abc'
        >>> self.head ('abc/')
        'abc'
        >>> self.head ('abc/efg')
        'abc'
        >>> self.head ('abc/efg/')
        'abc'

        >>> self.head ('/')
        '/'
        >>> self.head ('/abc')
        '/'
        >>> self.head ('/abc/')
        '/'
        >>> self.head ('/abc/efg')
        '/'
        >>> self.head ('/abc/efg/')
        '/'

        >>> self.head ('d:/')
        'd:'
        >>> self.head ('d:/abc')
        'd:'
        >>> self.head ('d:/abc/')
        'd:'
        >>> self.head ('d:/abc/efg')
        'd:'
        >>> self.head ('d:/abc/efg/')
        'd:'
        """
        parts = self.parts (path)
        if len (parts) > 0:
            return self.parts (path)[0]
        else:
            return ''

    def tail (self, path):
        """
        >>> self.tail ('')
        ''
        >>> self.tail ('abc')
        ''
        >>> self.tail ('abc/')
        ''
        >>> self.tail ('abc/efg')
        'efg'
        >>> self.tail ('abc/efg/')
        'efg'
        >>> self.tail ('abc/efg/hij')
        'efg/hij'
        >>> self.tail ('abc/efg/hij/')
        'efg/hij'

        >>> self.tail ('/')
        ''
        >>> self.tail ('/abc')
        'abc'
        >>> self.tail ('/abc/')
        'abc'
        >>> self.tail ('/abc/efg')
        'abc/efg'
        >>> self.tail ('/abc/efg/')
        'abc/efg'
        >>> self.tail ('/abc/efg/hij')
        'abc/efg/hij'
        >>> self.tail ('/abc/efg/hij/')
        'abc/efg/hij'

        >>> self.tail ('d:/')
        ''
        >>> self.tail ('d:/abc')
        'abc'
        >>> self.tail ('d:/abc/')
        'abc'
        >>> self.tail ('d:/abc/efg')
        'abc/efg'
        >>> self.tail ('d:/abc/efg/')
        'abc/efg'
        >>> self.tail ('d:/abc/efg/hij')
        'abc/efg/hij'
        >>> self.tail ('d:/abc/efg/hij/')
        'abc/efg/hij'
        """
        parts = self.parts (path)
        if len (parts) > 1:
            return os.path.join (*self.parts (path)[1:])
        else:
            return ''
        
    def parts (self, path):
        """
        >>> self.parts ('')
        []
        >>> self.parts ('abc')
        ['abc']
        >>> self.parts ('abc/')
        ['abc']
        >>> self.parts ('abc/efg')
        ['abc', 'efg']
        >>> self.parts ('abc/efg/')
        ['abc', 'efg']

        >>> self.parts ('/')
        ['/']
        >>> self.parts ('/abc')
        ['/', 'abc']
        >>> self.parts ('/abc/')
        ['/', 'abc']
        >>> self.parts ('/abc/efg')
        ['/', 'abc', 'efg']
        >>> self.parts ('/abc/efg/')
        ['/', 'abc', 'efg']

        >>> self.parts ('d:/')
        ['d:']
        >>> self.parts ('d:/abc')
        ['d:', 'abc']
        >>> self.parts ('d:/abc/')
        ['d:', 'abc']
        >>> self.parts ('d:/abc/efg')
        ['d:', 'abc', 'efg']
        >>> self.parts ('d:/abc/efg/')
        ['d:', 'abc', 'efg']
        """
        result = []
        while True:
            base = os.path.basename (path)
            if base == '': ## trailing delimiter?
                path, last = os.path.split (path)
        
            path, last = os.path.split (path)
            if last != '':
                result.insert (0, last)
            else:
                if path != '':
                    result.insert (0, path)
                break

        return result

################################################################################
################################################################################

def head (path):
    return _path_util.head (path)
def tail (path):
    return _path_util.tail (path)
def parts (path):
    return _path_util.parts (path)

_path_util = PathUtil ()

################################################################################
################################################################################

if __name__ == "__main__":

    import doctest
    doctest.testmod (extraglobs={'self': PathUtil ()})

################################################################################
################################################################################
