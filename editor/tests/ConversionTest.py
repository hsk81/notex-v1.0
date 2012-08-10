__author__ = "hsk81"
__date__ = "$Aug 10, 2012 8:15:30 PM$"

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

class ConversionTest (TestCase):
    def setUp (self):
        self.main ()

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

    def main (self):
        resp = self.client.get ('/editor/?silent')
        self.assertEqual (resp.status_code, 200)

        sid = resp.cookies[settings.SESSION_COOKIE_NAME]
        self.assertEqual (sid['path'], '/')
        self.assertIsNotNone (re.match ('^[0-f]{32}$', sid.value))

        return resp

    def create_project (self):
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

        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)
        data = json.loads (resp.content)[0]

        return resp, data

    ###########################################################################
    ###########################################################################

    url_export_report = '/editor/export-report/%s/'
    url_export_pdf = '/editor/export-pdf/%s/'
    url_export_latex = '/editor/export-latex/%s/'
    url_export_html = '/editor/export-html/%s/'

    def test_export_report (self):
        return self.check_export (ConversionTest.url_export_report, 'zip')
    def test_export_report_cached (self):
        return self.check_export_cached (ConversionTest.url_export_report, 'zip')

    def test_export_pdf (self):
        return self.check_export (ConversionTest.url_export_pdf, 'pdf')
    def test_export_pdf_cached (self):
        return self.check_export_cached (ConversionTest.url_export_pdf, 'pdf')

    def test_export_latex (self):
        return self.check_export (ConversionTest.url_export_latex, 'zip')
    def test_export_latex_cached (self):
        return self.check_export_cached (ConversionTest.url_export_latex, 'zip')

    def test_export_html (self):
        return self.check_export (ConversionTest.url_export_html, 'zip')
    def test_export_html_cached (self):
        return self.check_export_cached (ConversionTest.url_export_html, 'zip')

    def check_export (self, url, ext, zip_file=None):
        resp, data = self.create_project ()
        project_id = data['id']

        resp = self.do_export (ext, project_id, url, zip_file)
        return resp, data

    def check_export_cached (self, url, ext, zip_file=None):
        resp, data = self.create_project ()
        project_id = data['id']

        rsp1 = self.do_export (ext, project_id, url, zip_file)
        rsp2 = self.do_export (ext, project_id, url, zip_file)

        self.assertEquals (
            rsp1['Content-Length'], rsp2['Content-Length'])

        return rsp2, data

    def do_export (self, ext, project_id, url, zip_file):

        resp = self.client.post (url % project_id)
        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)

        resp = self.client.post (url % project_id + '?fetch')
        if zip_file: print >> zip_file, resp ## process resp immediately!
        self.assertEqual (resp.status_code, 200)
        self.assertIsNotNone (resp.content)

        self.assertEquals (resp['Content-Type'], 'application/%s' % ext)
        self.assertTrue (resp['Content-Length'] > 0);
        self.assertIsNotNone (re.match (
            r'^attachment;filename="(.*).%s"$' % ext,
            resp['Content-Disposition']));

        return resp

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
