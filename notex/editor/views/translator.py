__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:06:43 PM$"

################################################################################
################################################################################

from settings import MEDIA_ROOT

from editor.lib import MLStripper
from editor.lib import Interpolator
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import tempfile
import urllib
import types
import uuid
import yaml
import os

################################################################################
################################################################################

def processToText (root, prefix, zipBuffer, target = 'report'):

    if target != None:

        prefix = os.path.join (prefix, target)

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr (os.path.join (prefix, leaf.name), \
                decodestring (leaf.text.split (',')[1]))
        else:
            _, ftext_path = tempfile.mkstemp (); ftext = open (ftext_path, 'w')
            _, fhtml_path = tempfile.mkstemp (); fhtml = open (fhtml_path, 'w')

            text = MLStripper.strip_tags (leaf.text)

            ftext.write (text); ftext.close ()
            fhtml.write (leaf.text); fhtml.close ()

            try:
                result, diff = 0, subprocess.check_output \
                    (['diff', ftext_path, fhtml_path])
            except subprocess.CalledProcessError, ex: 
                result, diff = ex.returncode, ex.output

            subprocess.call (['rm', fhtml_path, '-f'])
            subprocess.call (['rm', ftext_path, '-f'])

            zipBuffer.writestr (os.path.join (prefix, leaf.name), text)
            if result == 1:
                zipBuffer.writestr (os.path.join \
                    (prefix, leaf.name + ".diff"), diff)

    for node in ns:
        zipBuffer.writestr (os.path.join (prefix, node.name), '')
        DATA.processToText (node, os.path.join (prefix, node), zipBuffer, \
            target = None)

def processToLatex (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer, skipPdf = True)

def processToPdf (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer)

def processToLatexPdf (root, title, zipBuffer, skipPdf = False):

    processToText (root, title, zipBuffer)

    origin = os.path.join (MEDIA_ROOT, 'dat', 'reports', \
        '00000000-0000-0000-0000-000000000000')
    target = os.path.join (MEDIA_ROOT, 'dat', 'reports', \
        str (uuid.uuid4 ()))

    subprocess.call (['cp', origin, target, '-r'])
    unpackTree (root, os.path.join (target, 'source'))
    subprocess.call (['make','-C', target, skipPdf and 'latex' or 'latexpdf'])

    pdfnames = []
    build_dir = os.path.join (target, 'build')
    latex_dir = os.path.join (build_dir, 'latex')

    for dirpath, dirnames, filenames in os.walk (latex_dir):
        for filename in filenames:

            if not filename.endswith ('pdf'):
                zipBuffer.write (os.path.join (dirpath, filename), \
                    os.path.join (title, dirpath.replace (latex_dir, 'latex'), \
                        filename))

            elif not skipPdf:
                pdf_file = os.path.join (dirpath, filename)
                subprocess.call (['mv', pdf_file, build_dir])
                pdfnames.append (filename)

    for pdfname in pdfnames:

        pdf_file = os.path.join (build_dir, pdfname)
        pdf_path = os.path.join (title, urllib.unquote_plus (pdfname))
        zipBuffer.write (pdf_file, pdf_path)

    subprocess.call (['rm', target, '-r'])

################################################################################

def unpackTree (root, prefix):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (decodestring (leaf.text.split (',')[1]))
        elif leaf.name.endswith ('.yml'):
            yaml2py (leaf, prefix)
        else:
            _, ext = os.path.splitext (leaf.name)
            if not ext in ['.rst','.txt']:
                continue ## security!
            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (MLStripper.strip_tags (leaf.text))

    for node in ns:
        subprocess.call (['mkdir', os.path.join (prefix, node.name)])
        unpackTree (node, os.path.join (prefix, node.name))

################################################################################

def yaml2py (leaf, prefix, filename = 'conf.py'):

    constructor = lambda loader, node: loader.construct_pairs (node)
    yaml.add_constructor (u'!omap', constructor)
    data = yaml.load (u'!omap\n' + leaf.text)

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
