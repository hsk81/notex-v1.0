__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:06:43 PM$"

################################################################################
################################################################################

from django.conf import settings

from editor.lib import Interpolator
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import mimetypes
import os.path
import shutil
import errno
import types
import uuid
import yaml
import os

################################################################################
################################################################################

def processToReport (root, prefix, zip_buffer):

    processToText (root, prefix, zip_buffer)
    process_to (root, prefix, zip_buffer, skip_pdf = False, skip_latex = False,
        skip_html = False)

def processToText (root, prefix, zip_buffer, target = None):

    if target is not None:
        prefix = os.path.join (prefix, target)

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        zip_path = os.path.join (prefix, leaf.name)
        src_path = os.path.join (settings.MEDIA_DATA, root.root.usid, leaf.file)
        with open (src_path, 'r') as uuid_file: text = uuid_file.read ()

        if leaf.type.code == 'image':
            zip_buffer.writestr (zip_path, decodestring (text.split (',')[1]))

        else:
            if is_text (src_path): text = text.replace ('\n','\r\n')
            zip_buffer.writestr (zip_path, text)

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

    origin_dir = os.path.join (settings.MEDIA_TEMP,
        '00000000-0000-0000-0000-000000000000')
    target_dir = os.path.join (settings.MEDIA_TEMP,
        root.root.usid, str (uuid.uuid3 (uuid.NAMESPACE_URL, str (root.id))))

    build_dir = os.path.join (target_dir, 'build')
    latex_dir = os.path.join (build_dir, 'latex')
    html_dir = os.path.join (build_dir, 'html')

    copytree (origin_dir, target_dir)
    texexec = unpack (root, os.path.join (target_dir, 'source')) or 'pdflatex'

    try:
        if not skip_latex or not skip_pdf:
            rest2latex (origin_dir, target_dir, latex_dir)

        if not skip_pdf:
            latex2pdf (texexec, target_dir, latex_dir)

        if not skip_html:
            rest2html (target_dir)

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

################################################################################

def rest2latex (origin_dir, target_dir, latex_dir):

    with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
        with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:
            subprocess.check_call (['make', '-C', target_dir, 'latex'],
                stdout=stdout, stderr=stderr)

    shutil.copy (
        os.path.join (origin_dir, 'build', 'latex', 'sphinxhowto.cls'),
        os.path.join (latex_dir, 'sphinxhowto.cls'))
    shutil.copy (
        os.path.join (origin_dir, 'build', 'latex', 'sphinxmanual.cls'),
        os.path.join (latex_dir, 'sphinxmanual.cls'))
    shutil.copy (
        os.path.join (origin_dir, 'build', 'latex', 'Makefile'),
        os.path.join (latex_dir, 'Makefile'))


def latex2pdf (texexec, target_dir, latex_dir):

    if texexec == 'pdflatex':
        symlink (
            os.path.join (os.path.sep, 'usr', 'bin', 'pdflatex'),
            os.path.join (latex_dir, 'pdflatex'))
    else:
        symlink (
            os.path.join (os.path.sep, 'usr', 'bin', 'xelatex'),
            os.path.join (latex_dir, 'xelatex'))
        symlink (
            os.path.join (os.path.sep, 'usr', 'bin', 'xdvipdfmx'),
            os.path.join (latex_dir, 'xdvipdfmx'))
        symlink (
            os.path.join (os.path.sep, 'usr', 'bin', 'makeindex'),
            os.path.join (latex_dir, 'makeindex'))

    TEXEXEC = 'TEXEXEC=%s' % texexec
    TEXOPTS = 'TEXOPTS=%s' % '-no-shell-escape -halt-on-error'

    with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
        with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:
            subprocess.check_call ([
                'make', '-C', latex_dir, 'all-pdf', TEXEXEC, TEXOPTS
            ], stdout=stdout, stderr=stderr)


def rest2html (target_dir):

    with open (os.path.join (target_dir, 'stdout.log'), 'w') as stdout:
        with open (os.path.join (target_dir, 'stderr.log'), 'w') as stderr:
            subprocess.check_call (['make', '-C', target_dir, 'html'],
                stdout=stdout, stderr=stderr)


################################################################################
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
            zip_path = os.path.join (title.encode ("utf-8"), 'latex', rel_path, filename)
            zip_buffer.write (src_path, zip_path)

def zip_to_pdf (zip_buffer, source_dir, title):

    for dirpath, dirnames, filenames in os.walk (source_dir):
        for filename in filenames:
            if not filename.lower ().endswith ('pdf'):
                continue

            src_path = os.path.join (dirpath, filename)
            zip_path = os.path.join (title.encode ("utf-8"), 'pdf', '%s.pdf' % title.encode ("utf-8"))
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
            zip_path = os.path.join (title.encode ("utf-8"), 'html', rel_path, filename)
            zip_buffer.write (src_path, zip_path)

################################################################################
################################################################################

def unpack (root, prefix, texexec = None):

    for leaf in LEAF.objects.filter (_node = root):
        texexec = unpack_leaf (leaf, prefix, texexec)

    for node in NODE.objects.filter (_node = root):
        texexec = unpack_node (node, prefix, texexec)

    return texexec

def unpack_node (node, prefix, texexec):

    subprocess.check_call (['mkdir', os.path.join (prefix, node.name)])
    texexec = unpack (node, os.path.join (prefix, node.name), texexec)

    return texexec

def unpack_leaf (leaf, prefix, texexec):

    if leaf.type.code == 'text':
        texexec = unpack_text (leaf, prefix, texexec)

    elif leaf.type.code == 'image':
        texexec = unpack_image (leaf, prefix, texexec)

    return texexec

def unpack_text (leaf, prefix, texexec):

    _, ext = os.path.splitext (leaf.name)
    if ext.lower () in ['.cfg', '.yml', '.conf', '.yaml']:
        texexec = yaml2py (leaf, prefix)

    else:
        symlink (leaf.file, os.path.join (prefix, leaf.name))

    return texexec

def unpack_image (leaf, prefix, texexec):

    dst = os.path.join (prefix, leaf.name)
    src = leaf.file

    if not os.path.exists (dst) or \
       os.stat (dst).st_size != os.stat (src).st_size:

        with open (dst, 'w') as file:
            with open (src, 'r') as uuid_file: text = uuid_file.read ()
            file.write (decodestring (text.split (',')[1]))

    return texexec

################################################################################
################################################################################

def yaml2py (leaf, prefix, filename = 'conf.py'):

    constructor = lambda loader, node: loader.construct_pairs (node)
    yaml.SafeLoader.add_constructor ('!omap', constructor)

    with open (leaf.file, 'r') as uuid_file: text = uuid_file.read ()
    data = yaml.load ('!omap\n' + text, Loader = yaml.SafeLoader)

    umap = dict (data)
    if not umap.has_key ('latex_backend'):
        umap['latex_backend'] = 'pdflatex' # default
    if umap['latex_backend'] != 'pdflatex' and umap['latex_backend'] != 'xelatex':
        umap['latex_backend'] = 'pdflatex' # security: validation!

    with open (os.path.join (prefix, filename), 'w+') as file:

        file.write ("# -*- coding: utf-8 -*-\n")
        file.write ("extensions = ['%s','%s','%s']\n" % (
            'sphinx.ext.ifconfig',
            'sphinx.ext.todo',
            'sphinx.ext.mathjax'
        ))

        for key,value in data:

            if key == 'extensions': # security: pre-defined!
                continue

            if key == 'latex_elements' and umap['latex_backend'] == 'xelatex':
                value['inputenc'] = '\\\\newcommand{\\\\DeclareUnicodeCharacter}[2]{}'
                value['fontenc'] = '\\\\usepackage{xltxtra}'

            file.write ('%s\n' % \
                emit (value, type (value), key).encode ("utf-8"))

    return umap['latex_backend']

################################################################################

def emit (value, type, key = None):

    if   type == types.ListType: return emit_list (value, key)
    elif type == types.DictType: return emit_dict (value, key)
    elif type == types.IntType: return emit_number (value, key)
    elif type == types.FloatType: return emit_number (value, key)
    elif type == types.StringType: return emit_string (value, key)
    elif type == types.UnicodeType: return emit_string (value, key)
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
        return '%s = u"""%s"""' % (key, Interpolator.apply (value, key))
    else:
        return      'u"""%s"""' %       Interpolator.apply (value)

def emit_none (key):

    if key:
        return '%s = None' % key
    else:
        return      'None'

################################################################################
################################################################################

def symlink (src, dst):

    if not os.path.exists (dst):
        os.symlink (src, dst)

def makedir (path):

    try:
        os.makedirs (path)

    except OSError as ex:
        if ex.errno == errno.EEXIST: pass
        else: raise

def copytree (src, dst):

    makedir (dst)
    for path in os.listdir (src):

        srcpath = os.path.join (src, path)
        dstpath = os.path.join (dst, path)

        if os.path.isdir (srcpath):
            copytree (srcpath, dstpath)
        else:
            shutil.copy (srcpath, dstpath)

def is_text (path, bin_path = os.path.join (os.path.sep, 'usr', 'bin')):

    if not mimetypes.inited: mimetypes.init ()
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
################################################################################
