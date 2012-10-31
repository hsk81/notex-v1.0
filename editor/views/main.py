__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:02:55 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.views.decorators import gzip

from editor.models import ROOT, ROOT_TYPE
from editor.models import NODE, NODE_TYPE
from editor.models import LEAF, LEAF_TYPE

from erp.models import PRODUCT

from uuid import uuid4 as uuid_random
from datetime import datetime

import os.path
import socket
import sys
import os
import re

################################################################################
################################################################################

gzip_page = lambda fn: fn if settings.DEBUG else gzip.gzip_page (fn)

################################################################################
################################################################################

@gzip_page
def main (request, page='home'):
    if request.session.has_key ('timestamp') and 'refresh' not in request.GET:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

    else:
        request.session['timestamp'] = datetime.now ()
        request.session.save ()

        init (request)

    if not 'silent' in request.GET:
        print >> sys.stderr, "Session ID: %s" % request.session.session_key
        print >> sys.stderr, "Time Stamp: %s" % request.session['timestamp']

    return render_to_response ('viewport.html',
        dictionary=main_args (request, page),
        context_instance=RequestContext (request))

def main_args (request, page):

    def get_page_title (page):

        lookup = {
            'home' :
                """
                NoTex: A reStructuredText editor plus a PDF, LaTex and HTML
                converter.
                """,
            'overview' :
                """
                Overview - NoTex: An introduction to the editor plus motivation
                for reStructuredText.
                """,
            'tutorial' :
                """
                Tutorial - NoTex: A step-by-step guide explaining the editor's
                UI and how to create a report.
                """,
            'rest' :
                """
                ReStructuredText - NoTex: A primer about reStructuredText.
                """,
            'faq' :
                """
                FAQ - NoTex: Frequently asked and important questions about
                security, data, performance, documentation etc.
                """,
            'download' :
                """
                Download - NoTex: Browser based standalone version for people
                who prefer to use their editor offline.
                """,
        }

        return re \
            .sub(r'\s+$', '', re.sub(r'^\s+', '', lookup[page], flags=re.M)
            .replace ('\n', ' '))

    def get_page_description (page):

        lookup = {
            'home' :
                """
                NoTex enables to write books, reports, articles and theses using
                the reStructuredText markup language and convert them to LaTex,
                PDF or HTML. The PDF files are of high publication quality and
                are produced via Sphinx with the Texlive LaTex suite.
                """,
            'overview' :
                """
                An overview of word processing systems comparing them w.r.t. to
                the content versus presentation separation: Word and LaTex are
                shown to mix content and presentation (Word on a visual and
                LaTex on a markup level) and then an argument in favor of
                reStructuredText is made, which cleanly separates the content
                and presentation domains.
                """,
            'tutorial' :
                """
                A tutorial about user interface of NoTex, explaining the various
                elements like report manager, menu, editor, main toolbar and
                status bar. It provides a brief step-by-step guide explaining
                how a novice user can create his first report and convert it to
                a PDF file.
                """,
            'rest' :
                """
                A primer on the reStructuredText markup language, explaining
                the most important elements of it. The following ones are
                mentioned: paragraphs, inline markup, lists and quote-like
                blocks, source code, tables, hyperlinks, sections, explicit
                markup, directives, images, footnotes, citations, substitutions
                and comments.
                """,
            'faq' :
                """
                A list of frequently asked or important question with their
                answers. The list covers topics about security, data,
                performance and documentation plus miscellaneous subjects like
                licencing, technology and contact information are clarified.
                """,
            'download' :
                """
                Offers two virtual machines for VirtualBox which enable to run
                NoTex as a standalone application: They are meant for people
                who like to keep their information for security and privacy
                reasons on a local device or network. Their is an international
                version with support for Chinese, Japanese and Korean (plus some
                other Asian languages) and a non-CJK version which omits these
                languages.
                """,
        }

        return re \
            .sub(r'\s+$', '', re.sub(r'^\s+', '', lookup[page], flags=re.M)
            .replace ('\n', ' '))

    def get_page_keywords (page):

        common = ['reStructuredText',
            'article', 'report', 'thesis', 'book', 'editor', 'latex',
            'restructured', 'text', 'pdf', 'html', 'converter', 'sphinx']
        lookup = {
            'home' : common + [
                'home'],
            'overview' : common + [
                'overview', 'introduction', 'background', 'information'],
            'tutorial' : common + [
                'guide', 'user interface', 'first', 'report', 'project'],
            'rest' : common + [
                'primer', 'tutorial', 'markup', 'language'],
            'faq' : common + [
                'faq', 'frequently asked', 'important', 'questions'],
            'download' : common + [
                'download', 'standalone', 'version', 'offline'],
        }

        return lookup[page]

    def get_page_canonical_url (page):

        return request.build_absolute_uri () if page != 'home' else \
               request.build_absolute_uri ('/editor/home/')

    page_title = get_page_title (page)
    page_description = get_page_description (page)
    page_keywords = get_page_keywords (page)
    page_canonical_url = get_page_canonical_url (page)

    result = {
        'page' : page,
        'page_title' : page_title,
        'page_description' : page_description,
        'page_keywords' : ','.join (page_keywords),
        'page_canonical_url' : page_canonical_url,
        'dbg' : settings.DEBUG, ## avoid template debug tag trouble!
    }

    if settings.IN_RXS (socket.getfqdn (), settings.MACH_VMES):
        result['STATIC_URL'] = 'http://%s/static/' % request.get_host ()

    def extra (page, dictionary):

        if page == 'download':
            dictionary['notex_intl'] = PRODUCT.objects.get (
                uuid = 'b3bdb98c-6fae-445d-8b64-3c0dbfbf9905')
            dictionary['notex_ncjk'] = PRODUCT.objects.get (
                uuid = '9236c06c-ddb3-4789-8cf2-5f4937bddced')
            dictionary['btc_recvaddr'] = os.environ.get('BTC_RECVADDR')

        return dictionary

    return extra (page, result)

################################################################################
################################################################################

def home (request): return main (request, page='home')
def overview (request): return main (request, page='overview')
def tutorial (request): return main (request, page='tutorial')
def rest (request): return main (request, page='rest')
def faq (request): return main (request, page='faq')
def download (request): return main (request, page='download')

################################################################################
################################################################################

def init (request):
    type = ROOT_TYPE.objects.get (_code='root')
    usid = request.session.session_key

    roots = ROOT.objects.filter (_type=type, _usid=usid)
    if roots.count () > 0: roots.delete ()
    root = ROOT.objects.create (type=type, usid=usid)

    dat_path = os.path.join (settings.STATIC_ROOT, 'app', 'editor', 'dat')

    init_prj01 (root, dat_path, prj_rank=0)
    init_prj02 (root, dat_path, prj_rank=1)
    init_prj03 (root, dat_path, prj_rank=2)
    init_prj04 (root, dat_path, prj_rank=3)


def init_prj01 (root, dat_path, prj_rank=0):
    prj_name = 'Quickstart'
    prj_path = 'quickstart'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path,prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'image', 'quill.b64', 'quill.jpg')


def init_prj02 (root, dat_path, prj_rank=0):
    prj_name = 'Simple Article'
    prj_path = 'simple-article'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')


def init_prj03 (root, dat_path, prj_rank=0):
    prj_name = 'Complex Article'
    prj_path = 'complex-article'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

def init_prj04 (root, dat_path, prj_rank=0):
    prj_name = 'Report'
    prj_path = 'report'

    node, _ = NodeCreator (root).do (prj_rank, 'project', prj_name)
    creator = LeafCreator (root, node, os.path.join (dat_path, prj_path))

    leaf, rank = creator.do (0, 'text', 'options.yml', 'options.cfg')
    leaf, rank = creator.do (rank, 'text', 'content.rst', 'content.txt')
    leaf, rank = creator.do (rank, 'text', 'math.rst', 'math.txt')

    for idx in range (9): leaf, rank = creator.do (
        rank, 'text', 'chapter-%02d.rst' % idx, 'chapter-%02d.txt' % idx)

    leaf, rank = creator.do (rank, 'text', 'footnotes.rst', 'footnotes.txt')
    leaf, rank = creator.do (rank, 'image', 'emcc.b64', 'emcc.jpg')
    leaf, rank = creator.do (rank, 'image', 'tm49.b64', 'tm49.jpg')
    leaf, rank = creator.do (rank, 'image', 'wiki.b64', 'wiki.jpg')

################################################################################
################################################################################

class NodeCreator:
    def __init__ (self, root):
        self.root = root

    def do (self, rank, code, node_name):

        return NODE.objects.create (
            type=NODE_TYPE.objects.get (_code=code),
            root=self.root,
            name=node_name,
            rank=rank
        ), rank + 1

class LeafCreator:
    def __init__ (self, root, node, path):
        self.root = root
        self.node = node
        self.path = path

    def do (self, rank, code, leaf_name, name=None):

        source = os.path.join (self.path, leaf_name)
        link_name = self.get_uuid_path (self.root.usid)
        os.symlink (source, link_name)

        return LEAF.objects.create (
            type=LEAF_TYPE.objects.get (_code=code),
            node=self.node,
            name=name if name else leaf_name,
            file=link_name,
            rank=rank
        ), rank + 1

    def get_uuid_path (self, session_key):

        session_path = os.path.join (settings.MEDIA_DATA, session_key)
        if not os.path.exists (session_path): os.mkdir (session_path)

        return os.path.join (session_path, str (uuid_random ()))

################################################################################
################################################################################

def ad_medrec (request):

    return render_to_response ('ad-medrec.html',
        dictionary={'dbg': settings.DEBUG},
        context_instance=RequestContext (request))

################################################################################
################################################################################
