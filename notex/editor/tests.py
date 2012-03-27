__author__="hsk81"
__date__ ="$Mar 27, 2012 1:12:57 PM$"

###############################################################################################
###############################################################################################

from django.test   import TestCase
from editor.models import *
from util.views    import UTIL

###############################################################################################
###############################################################################################

class ModelTest (TestCase):

    def runTest (self):

        pass

    def create_root (self, node_type=None):

        if node_type == None:

            node_type = ROOT_TYPE.objects.create (
                code = UTIL.create_id (),
                desc = 'default root type'
            )

        root = ROOT.objects.create (
            usid = UTIL.create_id (),
            name = 'root',
            rank = 0,
            type = node_type
        )

        return root

    def test_root (self):

        root = self.create_root ()
        self.assertTrue(root.id != None)

    def test_root_exception (self):

        node_type = BASE_TYPE.objects.create (
            code = UTIL.create_id (),
            desc = 'invalid node type'
        )

        self.assertRaises (FieldError, self.create_root, node_type)

    def create_node (self, node_type=None, node=None):

        if node_type == None:

            node_type = NODE_TYPE.objects.create (
                code = UTIL.create_id (),
                desc = 'default node type'
            )

        node = NODE.objects.create (
            root = self.create_root (),
            node = node,
            name = 'node',
            rank = 0,
            type = node_type
        )

        return node

    def test_node (self):

        node = self.create_node ()
        self.assertTrue(node.id != None)

        node = self.create_node (node=node)
        self.assertTrue(node.id != None)

    def test_node_exception (self):

        base_type = BASE_TYPE.objects.create (
            code = UTIL.create_id (),
            desc = 'invalid node type'
        )

        node_type = NODE_TYPE.objects.create (
            code = UTIL.create_id (),
            desc = 'default node type'
        )

        node = self.create_node (node_type=node_type)
        self.assertTrue(node.id != None)

        self.assertRaises (FieldError, self.create_node, base_type)
        self.assertRaises (FieldError, self.create_node, base_type, node)

    def create_leaf (self, node_type=None):

        if node_type == None:

            node_type = LEAF_TYPE.objects.create (
                code = UTIL.create_id (),
                desc = 'default leaf type'
            )

        leaf = LEAF.objects.create (
            node = self.create_node (),
            name = 'leaf',
            rank = 0,
            type = node_type
        )

        return leaf

    def test_leaf (self):

        leaf = self.create_leaf ()
        self.assertTrue(leaf.id != None)

    def test_leaf_exception (self):

        node_type = BASE_TYPE.objects.create (
            code = UTIL.create_id (),
            desc = 'invalid node type'
        )

        self.assertRaises (FieldError, self.create_leaf, node_type)

###############################################################################################
###############################################################################################
