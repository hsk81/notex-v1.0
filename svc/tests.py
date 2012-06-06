__author__ = "hsk81"
__date__ = "$Apr 17, 2012 12:03:15 PM$"

################################################################################
################################################################################

from django.test import TestCase
from django.test.client import Client

from svc.models  import *

################################################################################
################################################################################

class TestCaseDep:

    def __init__ (self, objTest = None, clsTest = None):

        if objTest != None:
            self._object = objTest
        else:
            self._object = clsTest ()

        self._setUp = (objTest == None)
        self._tearDown = (objTest == None)

    def setUp (self, *args, **kwargs):
        if self._setUp: self._object.setUp (*args, **kwargs)

    def tearDown (self, *args, **kwargs):
        if self._tearDown: self._object.tearDown (*args, **kwargs)

class SvcTest (TestCase):

    def setUp (self):
        self.client = Client ()

    def tearDown (self):
        pass

    def runTest (self, n = 128):
        """
        $ python -m cProfile manage.py test svc.SvcTest.runTest
        """
        for _ in xrange (n):
            self.test_lorem_ipsum ()

    def test_lorem_ipsum (self):

        rsp = self.client.get ('/svc/lorem-ipsum/')
        self.failUnlessEqual (rsp.status_code, 200)

################################################################################
################################################################################
