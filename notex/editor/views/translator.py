__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:06:43 PM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT

from editor.lib import Interpolator
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import tempfile
import logging
import urllib
import types
import uuid
import yaml
import os

################################################################################
################################################################################

logger = logging.getLogger (__name__)

################################################################################
################################################################################

def processToText (root, prefix, zipBuffer, target = None):

    if target != None:
        prefix = os.path.join (prefix, target)

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr (os.path.join (prefix, leaf.name),
                decodestring (leaf.text.split (',')[1]))
        else:
            zipBuffer.writestr (os.path.join (prefix, leaf.name),
                leaf.text.replace ('\n','\r\n'))

    for node in ns:
        processToText (node, os.path.join (prefix, node.name), zipBuffer,
            target = None)

def processToLatex (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer, skipPdf = True)

def processToPdf (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer)

def processToLatexPdf (root, title, zipBuffer, skipPdf = False):

    processToText (root, title, zipBuffer)

    origin_dir = os.path.join (MEDIA_ROOT, 'dat', 'reports',
        '00000000-0000-0000-0000-000000000000')
    target_dir = os.path.join (MEDIA_ROOT, 'dat', 'reports',
        str (uuid.uuid4 ()))
    build_dir = os.path.join (target_dir, 'build')
    latex_dir = os.path.join (build_dir, 'latex')

    subprocess.check_call (['cp', origin_dir, target_dir, '-r'])
    unpackTree (root, os.path.join (target_dir, 'source'))

    try:
        with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
            with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:

                subprocess.check_call (['make','-C', target_dir, 'latex'],
                    stdout = stdout, stderr = stderr)

                if not skipPdf:
                    subprocess.check_call (['ln', '-s', '/usr/bin/pdflatex',
                        os.path.join (latex_dir, 'pdflatex')])
                    subprocess.check_call (['make','-C', latex_dir, 'all-pdf'],
                        stdout = stdout, stderr = stderr)
                    subprocess.check_call (['rm', \
                        os.path.join (latex_dir, 'pdflatex')])

    except Exception as ex:
        with open (os.path.join (target_dir, 'stdout.log'), 'r') as stdout:
            with open (os.path.join (target_dir, 'stderr.log'), 'r') as stderr:

                ex.stderr_log = stderr.read ()
                ex.stdout_log = stdout.read ()
                raise

    for dirpath, dirnames, filenames in os.walk (latex_dir):
        for filename in filenames:

            src_path = os.path.join (dirpath, filename)

            if not filename.endswith ('pdf'):
                with open (src_path, 'r') as src_file:
                    src_text = src_file.read ()
                with open (src_path, 'w') as src_file:
                    src_file.write (src_text.replace ('\n','\r\n'))

                zip_path = os.path.join (title, 'latex', filename)
            elif not skipPdf:
                zip_path = os.path.join (title, urllib.unquote_plus (filename))

            zipBuffer.write (src_path, zip_path)

    subprocess.check_call (['rm', target_dir, '-r'])

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
                file.write (leaf.text)

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

        line = "# -*- coding: utf-8 -*-\n"
        file.write (line)
        line = "extensions = ['sphinx.ext.pngmath', 'sphinx.ext.ifconfig']\n"
        file.write (line)

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
        return '%s = "%s"' % (key, Interpolator.apply (value, key))
    else:
        return      '"%s"' %       Interpolator.apply (value)

################################################################################
################################################################################
