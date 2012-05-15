__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:06:43 PM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT

from editor.lib import Interpolator
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import mimetypes
import tempfile
import os.path
import urllib
import types
import uuid
import yaml
import os

################################################################################
################################################################################

def is_text (path, bin_path = '/usr/bin'):

    mimetype, encoding = mimetypes.guess_type (path)
    if mimetype and mimetype.startswith ('text'):
        return True

    arguments = [os.path.join (bin_path, 'file'), '-Lib', path]
    process = subprocess.Popen (arguments, stdout = subprocess.PIPE)
    result = process.stdout.read ()

    mimetype, encoding = result.split (';')
    if mimetype.startswith ('text'):
        path_to, ext = os.path.splitext (path)
        mimetypes.add_type (mimetype, ext)
        return True

    return False

################################################################################

def processToReport (root, prefix, zip_buffer):

    processToText (root, prefix, zip_buffer)
    process_to (root, prefix, zip_buffer, skip_pdf = False, skip_latex = False,
        skip_html = False)

def processToText (root, prefix, zip_buffer, target = None):

    if target != None:
        prefix = os.path.join (prefix, target)

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        zip_path = os.path.join (prefix, leaf.name)
        if leaf.type.code == 'image':
            zip_buffer.writestr (zip_path,
                decodestring (leaf.text.split (',')[1]))
        else:
            tmp_desc, tmp_path = tempfile.mkstemp ()
            with os.fdopen (tmp_desc, 'w') as temp:
                temp.write (leaf.text.encode ("utf-8"))
                temp.flush ()

                if is_text (tmp_path):
                    zip_buffer.writestr (zip_path,
                        leaf.text.replace ('\n','\r\n').encode ("utf-8"))
                else:
                    zip_buffer.writestr (zip_path, leaf.text)

            os.remove (tmp_path)

    for node in ns:
        zip_path = os.path.join (prefix, node.name)
        processToText (node, zip_path, zip_buffer, target = None)

def processToLatex (root, title, zip_buffer):
    process_to (root, title, zip_buffer, skip_latex = False)

def processToPdf (root, title, zip_buffer):
    process_to (root, title, zip_buffer, skip_pdf = False)

def processToHtml (root, title, zip_buffer):
    process_to (root, title, zip_buffer, skip_html = False)

def process_to (root, title, zip_buffer, skip_pdf = True, skip_latex = True,
    skip_html = True):

    origin_dir = os.path.join (MEDIA_ROOT, 'dat', 'reports',
        '00000000-0000-0000-0000-000000000000')
    target_dir = os.path.join (MEDIA_ROOT, 'dat', 'reports',
        str (uuid.uuid4 ()))

    build_dir = os.path.join (target_dir, 'build')
    latex_dir = os.path.join (build_dir, 'latex')
    html_dir = os.path.join (build_dir, 'html')

    subprocess.check_call (['cp', origin_dir, target_dir, '-r'])
    unpackTree (root, os.path.join (target_dir, 'source'))

    try:
        if not skip_latex or not skip_pdf:
            with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
                with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:

                    subprocess.check_call (['make', '-C', target_dir, 'latex'],
                        stdout = stdout, stderr = stderr)

                    subprocess.check_call (['cp', '-f',
                        os.path.join (origin_dir, 'build', 'latex', 'sphinxhowto.cls'),
                        latex_dir])

                    subprocess.check_call (['cp', '-f',
                        os.path.join (origin_dir, 'build', 'latex', 'sphinxmanual.cls'),
                        latex_dir])

        if not skip_pdf:
            with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
                with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:

                    subprocess.check_call (['ln', '-s', '/usr/bin/pdflatex',
                        os.path.join (latex_dir, 'pdflatex')])

                    os.environ['LATEXOPTS']="-no-shell-escape -halt-on-error"
                    subprocess.check_call (
                        ['make', '-e', '-C', latex_dir, 'all-pdf'],
                        stdout = stdout, stderr = stderr, env = os.environ)
                    del (os.environ['LATEXOPTS'])

                    subprocess.check_call (['rm', \
                        os.path.join (latex_dir, 'pdflatex')])

        if not skip_html:
            with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
                with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:

                    subprocess.check_call (['make', '-C', target_dir, 'html'],
                        stdout = stdout, stderr = stderr)

    except Exception as ex:
        with open (os.path.join (target_dir, 'stdout.log'), 'r') as stdout:
            with open (os.path.join (target_dir, 'stderr.log'), 'r') as stderr:

                ex.stderr_log = stderr.read ()
                ex.stdout_log = stdout.read ()
                raise

    if not skip_latex:
        zip_to_latex (zip_buffer, latex_dir, title)
    if not skip_pdf:
        zip_to_pdf (zip_buffer, latex_dir, title)
    if not skip_html:
        zip_to_html (zip_buffer, html_dir, title)

    subprocess.check_call (['rm', target_dir, '-r'])

################################################################################

def zip_to_latex (zip_buffer, source_dir, title):

    for dirpath, dirnames, filenames in os.walk (source_dir):
        for filename in filenames:
            if filename.lower ().endswith ('pdf'):
                continue

            src_path = os.path.join (dirpath, filename)
            if is_text (src_path):
                with open (src_path, 'r') as src_file:
                    src_text = src_file.read ()
                with open (src_path, 'w') as src_file:
                    src_file.write (src_text.replace ('\n','\r\n'))

            rel_path = os.path.relpath (dirpath, source_dir)
            zip_path = os.path.join (title, 'latex', rel_path, filename)
            zip_buffer.write (src_path, zip_path)

def zip_to_pdf (zip_buffer, source_dir, title):

    for dirpath, dirnames, filenames in os.walk (source_dir):
        for filename in filenames:
            if not filename.lower ().endswith ('pdf'):
                continue

            src_path = os.path.join (dirpath, filename)
            uqp_name = urllib.unquote_plus (filename)
            zip_path = os.path.join (title, 'pdf', uqp_name)
            zip_buffer.write (src_path, zip_path)

def zip_to_html (zip_buffer, source_dir, title):

    for dirpath, dirnames, filenames in os.walk (source_dir):
        for filename in filenames:
            src_path = os.path.join (dirpath, filename)
            if is_text (src_path):
                with open (src_path, 'r') as src_file:
                    src_text = src_file.read ()
                with open (src_path, 'w') as src_file:
                    src_file.write (src_text.replace ('\n','\r\n'))

            rel_path = os.path.relpath (dirpath, source_dir)
            zip_path = os.path.join (title, 'html', rel_path, filename)
            zip_buffer.write (src_path, zip_path)

################################################################################

def unpackTree (root, prefix):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:

        if leaf.type.code == 'text':
            _, ext = os.path.splitext (leaf.name)
            if ext.lower () in ['.cfg','.yml','.conf','.yaml']:
                yaml2py (leaf, prefix); continue

            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (leaf.text.encode ("utf-8"))

        elif leaf.type.code == 'image':
            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (decodestring (leaf.text.split (',')[1]))

    for node in ns:
        subprocess.check_call (['mkdir', os.path.join (prefix, node.name)])
        unpackTree (node, os.path.join (prefix, node.name))

################################################################################

def yaml2py (leaf, prefix, filename = 'conf.py'):

    constructor = lambda loader, node: loader.construct_pairs (node)
    yaml.CSafeLoader.add_constructor (u'!omap', constructor)
    data = yaml.load (u'!omap\n' + leaf.text, Loader = yaml.CSafeLoader)

    with open (os.path.join (prefix, filename), 'w+') as file:

        file.write ("# -*- coding: utf-8 -*-\n")
        file.write ("extensions = ['%s','%s','%s']\n" % (
            'sphinx.ext.ifconfig',
            'sphinx.ext.todo',
            'sphinx.ext.mathjax'
        ))

        for key,value in data:
            if key != 'extensions': # security: pre-defined!
                file.write ('%s\n' % emit (value, type (value), key))

################################################################################

def emit (value, type, key = None):

    if   type == types.ListType: return emit_list (value, key)
    elif type == types.DictType: return emit_dict (value, key)
    elif type == types.IntType: return emit_number (value, key)
    elif type == types.FloatType: return emit_number (value, key)
    elif type == types.StringType: return emit_string (value, key)
    elif type == types.NoneType: return emit_none (key)

    else: return None ## security: ignore other types!

def emit_list (ls, key):

    if key:
        return '%s = [%s]' % (key,','.join (map (lambda el:emit \
            (el,type (el)), ls)))
    else:
        return      '[%s]' %      ','.join (map (lambda el:emit \
            (el,type (el)), ls))

def emit_dict (ds, key):

    if key: return '%s = {%s}' % (key,','.join ('"%s":%s' % \
        (k,emit (ds[k],type (ds[k]))) for k in ds))
    else:   return      '{%s}' %      ','.join ('"%s":%s' % \
        (k,emit (ds[k],type (ds[k]))) for k in ds)

def emit_number (value, key):

    if key:
        return '%s = %s"' % (key,value)
    else:
        return      '%s'  %      value

def emit_string (value, key):

    if key:
        return '%s = """%s"""' % (key, Interpolator.apply (value, key))
    else:
        return      '"""%s"""' %       Interpolator.apply (value)

def emit_none (key):

    if key:
        return '%s = None' % key
    else:
        return      'None'

################################################################################
################################################################################
