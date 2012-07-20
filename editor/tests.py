__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:57 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.test import TestCase

from editor.models import *

import os.path
import random
import json
import re

################################################################################
################################################################################

class ModelTest (TestCase):

    def create_root (self, node_type=None):

        if node_type is None:
            node_type = ROOT_TYPE.objects.create (
                code = self.create_id (),
                desc = 'default root type')

        return ROOT.objects.create (
            usid = self.create_id (),
            name = 'root',
            rank = 0,
            type = node_type)

    def test_root (self):

        root = self.create_root ()
        self.assertIsNotNone (root.id)

    def test_root_exception (self):

        node_type = BASE_TYPE.objects.create (
            code = self.create_id (),
            desc = 'invalid node type')

        self.assertRaises (FieldError, self.create_root, node_type)

    def create_node (self, node_type=None, node=None):

        if node_type is None:
            node_type = NODE_TYPE.objects.create (
                code = self.create_id (),
                desc = 'default node type')

        return NODE.objects.create (
            root = self.create_root (),
            node = node,
            name = 'node',
            rank = 0,
            type = node_type)

    def test_node (self):

        node = self.create_node ()
        self.assertIsNotNone (node.id)
        node = self.create_node (node=node)
        self.assertIsNotNone (node.id)

    def test_node_exception (self):

        base_type = BASE_TYPE.objects.create (
            code = self.create_id (),
            desc = 'invalid node type')

        node_type = NODE_TYPE.objects.create (
            code = self.create_id (),
            desc = 'default node type')

        node = self.create_node (node_type=node_type)
        self.assertTrue(node.id != None)

        self.assertRaises (FieldError, self.create_node, base_type)
        self.assertRaises (FieldError, self.create_node, base_type, node)

    def create_leaf (self, node_type=None):

        if node_type == None:
            node_type = LEAF_TYPE.objects.create (
                code = self.create_id (),
                desc = 'default leaf type')

        return LEAF.objects.create (
            node = self.create_node (),
            name = 'leaf',
            rank = 0,
            type = node_type)

    def test_leaf (self):

        leaf = self.create_leaf ()
        self.assertIsNotNone (leaf.id)

    def test_leaf_exception (self):

        node_type = BASE_TYPE.objects.create (
            code = self.create_id (),
            desc = 'invalid node type')

        self.assertRaises (FieldError, self.create_leaf, node_type)

    def create_id (self, rmin = 0, rmax = 16**32-1):

        return hex (random.randint (rmin, rmax)).lstrip ('0x').rstrip ('L')

################################################################################
################################################################################

class ViewTest (TestCase):

    def setUp (self):

        self.test_main ()

    def tearDown (self):

        path_to_data = os.path.join (settings.MEDIA_DATA,
            self.client.session.session_key)
        if os.path.exists (path_to_data):
            subprocess.check_call (['rm', path_to_data, '-rf'])

        path_to_temp = os.path.join (settings.MEDIA_TEMP,
            self.client.session.session_key)
        if os.path.exists (path_to_temp):
            subprocess.check_call (['rm', path_to_temp, '-rf'])

        path_to_usid = os.path.join (settings.SESSION_FILE_PATH,
                settings.SESSION_COOKIE_NAME + self.client.session.session_key)
        if os.path.exists (path_to_usid):
            subprocess.check_call (['rm', path_to_usid, '-f'])

    def test_main (self):

        resp = self.client.get ('/editor/?silent')
        self.assertEqual (resp.status_code, 200)

        sid = resp.cookies['sid.']
        self.assertEqual (sid['path'], '/')
        self.assertIsNotNone (re.match ('^[0-f]{32}$', sid.value))

        return resp

    def test_create_project (self):

        resp = self.client.post ('/editor/create-project', {
            'nodeId': 'LMRHE33POQRCYIC3LVOQ====',
            'data': json.dumps ({
                'project':'PROJECT',
                'authors':'AUTHORs',
                'documentType':'article',
                'fontSize':'12pt',
                'columns':2,
                'title':True,
                'toc':True,
                'index':False,
                'content':'empty'}),
            'rank': '4'})

        return self.check (resp)

    def test_create_folder (self):

        resp, data = self.test_create_project ()
        resp = self.client.post ('/editor/create-folder', {
            'nodeId': data['id'],
            'name': 'folder',
            'rank': '2'})

        return self.check (resp)

    def test_create_text (self):

        resp, data = self.test_create_project ()
        resp = self.client.post ('/editor/create-text', {
            'nodeId': data['id'],
            'name': 'content.txt',
            'rank': '2',
            'data': '..'})

        return self.check (resp)

    def test_create_image (self):

        resp, data = self.test_create_project ()
        resp = self.client.post ('/editor/create-image', {
            'nodeId': data['id'],
            'name': 'content.text',
            'rank': '2',
            'data': 'data:image/jpeg;base64,/..=='})

        return self.check (resp)

    def check (self, json_response):

        self.assertEqual (json_response.status_code, 200)
        self.assertIsNotNone (json_response.content)
        data = json.loads (json_response.content)[0]
        self.assertIsNotNone (data['id'])
        self.assertTrue (data['success'])

        return json_response, data

################################################################################
################################################################################
