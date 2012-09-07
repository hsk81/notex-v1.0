__author__ = "hsk81"
__date__ = "$Aug 02, 2012 6:45:15 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.test import TestCase
from editor.models import *

import os.path
import shutil
import json

################################################################################
################################################################################

class StressTest (TestCase):

    base_factor = 0.1
    s_iteration = int (base_factor * 10)
    m_iteration = int (base_factor * 100)
    x_iteration = int (base_factor * 1000)

    def setUp (self):
        resp = self.client.get ('/editor/?silent')
        self.assertEqual (resp.status_code, 200)

    def tearDown (self):
        path_to_data = os.path.join (settings.MEDIA_DATA,
            self.client.session.session_key)
        if os.path.exists (path_to_data):
            shutil.rmtree (path_to_data, ignore_errors=True)

        path_to_temp = os.path.join (settings.MEDIA_TEMP,
            self.client.session.session_key)
        if os.path.exists (path_to_temp):
            shutil.rmtree (path_to_temp, ignore_errors=True)

        path_to_usid = os.path.join (settings.SESSION_FILE_PATH,
            settings.SESSION_COOKIE_NAME + self.client.session.session_key)
        if os.path.exists (path_to_usid):
            os.remove (path_to_usid)

    ###########################################################################
    ###########################################################################

    def test_refresh (self):
        for index in range (StressTest.m_iteration):
            self.util_refresh ()
    def util_refresh (self):
        resp = self.client.get ('/editor/?silent&refresh')
        self.assertEqual (resp.status_code, 200)
        return

    def test_main (self):
        for index in range (StressTest.x_iteration):
            self.util_main ()
    def util_main (self):
        resp = self.client.get ('/editor/?silent')
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_create_project (self):
        for index in range (StressTest.x_iteration):
            self.util_create_project ()
    def util_create_project (self):
        resp = self.client.post ('/editor/create-project/', {
            'nodeId': 'LMRHE33POQRCYIC3LVOQ====', ## root
            'data': json.dumps ({
                'project': 'PROJECT',
                'authors': 'AUTHORs',
                'documentType': 'article',
                'fontSize': '12pt',
                'columns': 2,
                'title': True,
                'toc': True,
                'index': False,
                'content': 'tutorial'}),
            'rank': '4'})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_create_folder (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_create_folder (data['id'])
    def util_create_folder (self, project_id):
        resp = self.client.post ('/editor/create-folder/', {
            'nodeId': project_id,
            'name': 'folder',
            'rank': '2'})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_create_text (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_create_text (data['id'])
    def util_create_text (self, project_id):
        resp = self.client.post ('/editor/create-text/', {
            'nodeId': project_id,
            'name': 'content.txt',
            'rank': '2',
            'data': '..'})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_create_image (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_create_image (data['id'])
    def util_create_image (self, project_id):
        resp = self.client.post ('/editor/create-image/', {
            'nodeId': project_id,
            'name': 'content.text',
            'rank': '2',
            'data': 'data:image/jpeg;base64,/..=='})
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_read_root (self):
        for index in range (StressTest.x_iteration):
            self.util_read_root ()
    def util_read_root (self):
        resp = self.client.post ('/editor/read/', {
            'node': 'LMRHE33POQRCYIC3LVOQ===='})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_read_node (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_read_node (data['id'])
    def util_read_node (self, project_id):
        resp = self.client.post ('/editor/read/', {'node': project_id})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_read_leaf (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_read_leaf (data['id'])
    def util_read_leaf (self, leaf_id):
        resp = self.client.post ('/editor/read/', {'node': leaf_id})
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_update_text (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_update (data, '/editor/update-text/')

    def test_update_image (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_update (data, '/editor/update-image/')

    def util_update (self, leaf_data, url):
        resp = self.client.post (url, {
            'leafId': leaf_data['id'],
            'name': leaf_data['text'],
            'data': leaf_data['data']})
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_increase_rank (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)
        for index in range (StressTest.x_iteration):
            self.util_change_rank (data, '/editor/increase-rank/')

    def test_decrease_rank (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)
        for index in range (StressTest.x_iteration):
            self.util_change_rank (data, '/editor/decrease-rank/')

    def util_change_rank (self, node_data, url):
        self.assertEquals (len (node_data), 2)
        resp = self.client.post (url, {
            'id': node_data[0]['id'],
            'jd': node_data[1]['id']})
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_rename_node (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_rename_node (data['id'])
    def util_rename_node (self, node_id):
        resp = self.client.post ('/editor/rename/', {
            'nodeId': node_id,
            'name': 'new-name'})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_rename_leaf (self):
        resp = self.util_create_project ()
        data = json.loads (resp.content)[0]
        resp = self.util_read_node (data['id'])
        data = json.loads (resp.content)[0]
        for index in range (StressTest.x_iteration):
            self.util_rename_leaf (data['id'])
    def util_rename_leaf (self, leaf_id):
        resp = self.client.post ('/editor/rename/', {
            'nodeId': leaf_id,
            'name': 'new-name'})
        self.assertEqual (resp.status_code, 200)
        return resp

    ###########################################################################
    ###########################################################################

    def test_delete_node (self):
        for index in range (StressTest.x_iteration):
            resp = self.util_create_project ()
            data = json.loads (resp.content)[0]
            self.util_delete_node (data['id'])
    def util_delete_node (self, node_id):
        resp = self.client.post ('/editor/delete/', {'id': node_id})
        self.assertEqual (resp.status_code, 200)
        return resp

    def test_delete_leaf (self):
        for index in range (StressTest.x_iteration):
            resp = self.util_create_project ()
            data = json.loads (resp.content)[0]
            resp = self.util_read_node (data['id'])
            data = json.loads (resp.content)[0]
            self.util_delete_node (data['id'])
    def util_delete_leaf (self, leaf_id):
        resp = self.client.post ('/editor/delete/', {'id': leaf_id})
        self.assertEqual (resp.status_code, 200)
        return resp

################################################################################
################################################################################
