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
import re

################################################################################
################################################################################

class ViewTest (TestCase):
    def setUp (self):
        self.test_main ()

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
        resp = self.client.get ('/editor/?silent&refresh')
        self.assertEqual (resp.status_code, 200)

        sid = resp.cookies[settings.SESSION_COOKIE_NAME]
        self.assertEqual (sid['path'], '/')
        self.assertIsNotNone (re.match ('^[0-f]{32}$', sid.value))

        return resp

    def test_main (self):
        resp = self.client.get ('/editor/?silent')
        self.assertEqual (resp.status_code, 200)

        sid = resp.cookies[settings.SESSION_COOKIE_NAME]
        self.assertEqual (sid['path'], '/')
        self.assertIsNotNone (re.match ('^[0-f]{32}$', sid.value))

        return resp

    ###########################################################################
    ###########################################################################

    def test_create_project (self):
        resp = self.client.post ('/editor/create-project', {
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

    ###########################################################################
    ###########################################################################

    def test_read_root (self):
        resp = self.client.post ('/editor/read/', {
            'node': 'LMRHE33POQRCYIC3LVOQ===='
        })

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)

        for el in data:
            self.assertIsNotNone (el['id'])
            self.assertIsNotNone (el['text'])
            self.assertEquals (el['cls'], 'folder')
            self.assertFalse (el['leaf'])

        return  resp, data

    def test_read_node (self):
        resp, data = self.test_create_project ()
        resp = self.client.post ('/editor/read/', {'node': data['id']})
        project_id = data['id']

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)

        for el in data:
            self.assertIsNotNone (el['id'])
            self.assertIsNotNone (el['text'])
            self.assertIsNotNone (el['data'])
            self.assertTrue (el['mime'] == 'text/plain' or el['mime'] is None)
            self.assertEquals (el['cls'], 'file')
            self.assertTrue (el['leaf'])

        return resp, data, project_id

    def test_read_leaf (self):
        resp, node_data, _ = self.test_read_node ()
        for el in node_data:
            resp = self.client.post ('/editor/read/', {'node': el['id']})
            self.assertEqual (resp.status_code, 200)
            self.assertIsNotNone (resp.content)
            data = json.loads (resp.content)
            self.assertEqual (data, []) ## useless!

        return resp, data

    ###########################################################################
    ###########################################################################

    def test_update_text (self):
        return self.check_update ('/editor/update-text')

    def test_update_image (self):
        return self.check_update ('/editor/update-image')

    def check_update (self, url):
        resp, node_data, _ = self.test_read_node ()
        for el in node_data:
            resp = self.client.post (url, {
                'leafId': el['id'],
                'name': el['text'],
                'data': el['data']
            })

            self.assertEqual (resp.status_code, 200)
            self.assertIsNotNone (resp.content)
            data = json.loads (resp.content)[0]
            self.assertTrue (data['success'])
            self.assertEquals (data['id'], el['id'])

        return resp, node_data

    ###########################################################################
    ###########################################################################

    def test_increase_rank (self):
        self.check_change_rank ('/editor/increase-rank/')

    def test_decrease_rank (self):
        self.check_change_rank ('/editor/decrease-rank/')

    def check_change_rank (self, url):
        resp, node_data, _ = self.test_read_node ()
        self.assertEquals (len (node_data), 2)

        resp = self.client.post (url, {
            'id': node_data[0]['id'],
            'jd': node_data[1]['id']
        })

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)[0]
        self.assertEqual (data['id'], node_data[0]['id'])
        self.assertEqual (data['jd'], node_data[1]['id'])

        return resp, data

    ###########################################################################
    ###########################################################################

    def test_rename_node (self):
        resp, node_data, project_id = self.test_read_node ()
        resp = self.client.post ('/editor/rename/', {
            'nodeId': project_id,
            'name': 'new-name'
        })

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)
        self.assertTrue (data['success'])
        self.assertEqual (data['id'], project_id)
        self.assertEqual (data['name'], 'new-name')

        return resp, data

    def test_rename_leaf (self):
        resp, node_data, project_id = self.test_read_node ()
        for el in node_data:
            resp = self.client.post ('/editor/rename/', {
                'nodeId': el['id'],
                'name': 'new-name'
            })

            self.assertEqual (resp.status_code, 200)
            self.assertIsNotNone (resp.content)
            data = json.loads (resp.content)
            self.assertTrue (data['success'])
            self.assertEqual (data['id'], el['id'])
            self.assertEqual (data['name'], 'new-name')

        return resp, node_data

    ###########################################################################
    ###########################################################################

    def test_delete_node (self):
        resp, node_data, project_id = self.test_read_node ()
        resp = self.client.post ('/editor/delete/', {
            'id': project_id,
            })

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)
        self.assertTrue (data['success'])
        self.assertEqual (data['id'], project_id)

        return resp, data

    def test_delete_leaf (self):
        resp, node_data, project_id = self.test_read_node ()
        for el in node_data:
            resp = self.client.post ('/editor/delete/', {
                'id': el['id']
            })

            self.assertEqual (resp.status_code, 200)
            self.assertIsNotNone (resp.content)
            data = json.loads (resp.content)
            self.assertTrue (data['success'])
            self.assertEqual (data['id'], el['id'])

        return resp, node_data

    ###########################################################################
    ###########################################################################

    def test_export_report (self):
        return self.check_export ('/editor/export-report/%s/', 'zip')

    def test_export_pdf (self):
        return self.check_export ('/editor/export-pdf/%s/', 'pdf')

    def test_export_latex (self):
        return self.check_export ('/editor/export-latex/%s/', 'zip')

    def test_export_html (self):
        return self.check_export ('/editor/export-html/%s/', 'zip')

    def check_export (self, url, ext, zip_file=None):
        resp, data = self.test_create_project ()
        project_id = data['id']

        resp = self.client.post (url % project_id)
        self.check (resp)

        resp = self.client.post (url % project_id)
        if zip_file: print >> zip_file, resp

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)

        self.assertEquals (resp['Content-Type'], 'application/%s' % ext)
        self.assertTrue (resp['Content-Length'] > 0);
        self.assertIsNotNone (re.match (
            r'^attachment;filename="(.*).%s"$' % ext,
            resp['Content-Disposition']
        ));

        return resp, data

    ###########################################################################
    ###########################################################################

    def test_import_file (self):
        with os.tmpfile() as zip_file:
            resp, data = self.check_export (
                '/editor/export-report/%s/', 'zip', zip_file
            )

            zip_file.flush ()
            zip_file.seek (0)

            resp = self.client.post ('/editor/import-file/PROJECT.zip/', {
                'name': 'PROJECT.zip', 'attachment': zip_file
            })

            self.assertEqual (resp.status_code, 200)
            self.assertIsNotNone (resp.content)
            data = json.loads (resp.content)
            self.assertTrue (data['success'])
            self.assertIsNotNone (data['file_id'])
            self.assertIsNone (data['message'])

################################################################################
################################################################################
