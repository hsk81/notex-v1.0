__author__ = "hsk81"
__date__ = "$Aug 02, 2012 6:45:15 PM$"

################################################################################
################################################################################

from django.test import TestCase
from editor.models import *

import random

################################################################################
################################################################################

class ModelTest (TestCase):
    def create_root (self, node_type=None):
        if node_type is None:
            node_type = ROOT_TYPE.objects.create (
                code=self.create_id (),
                desc='default root type')

        return ROOT.objects.create (
            usid=self.create_id (),
            name='root',
            rank=0,
            type=node_type)

    def test_root (self):
        root = self.create_root ()
        self.assertIsNotNone (root.id)

    def test_root_exception (self):
        node_type = BASE_TYPE.objects.create (
            code=self.create_id (),
            desc='invalid node type')

        self.assertRaises (FieldError, self.create_root, node_type)

    def create_node (self, node_type=None, node=None):
        if node_type is None:
            node_type = NODE_TYPE.objects.create (
                code=self.create_id (),
                desc='default node type')

        return NODE.objects.create (
            root=self.create_root (),
            node=node,
            name='node',
            rank=0,
            type=node_type)

    def test_node (self):
        node = self.create_node ()
        self.assertIsNotNone (node.id)
        node = self.create_node (node=node)
        self.assertIsNotNone (node.id)

    def test_node_exception (self):
        base_type = BASE_TYPE.objects.create (
            code=self.create_id (),
            desc='invalid node type')

        node_type = NODE_TYPE.objects.create (
            code=self.create_id (),
            desc='default node type')

        node = self.create_node (node_type=node_type)
        self.assertTrue (node.id != None)

        self.assertRaises (FieldError, self.create_node, base_type)
        self.assertRaises (FieldError, self.create_node, base_type, node)

    def create_leaf (self, node_type=None):
        if node_type == None:
            node_type = LEAF_TYPE.objects.create (
                code=self.create_id (),
                desc='default leaf type')

        return LEAF.objects.create (
            node=self.create_node (),
            name='leaf',
            rank=0,
            type=node_type)

    def test_leaf (self):
        leaf = self.create_leaf ()
        self.assertIsNotNone (leaf.id)

    def test_leaf_exception (self):
        node_type = BASE_TYPE.objects.create (
            code=self.create_id (),
            desc='invalid node type')

        self.assertRaises (FieldError, self.create_leaf, node_type)

    def create_id (self, rmin=0, rmax=16 ** 32 - 1):
        return hex (random.randint (rmin, rmax)).lstrip ('0x').rstrip ('L')

################################################################################
################################################################################
