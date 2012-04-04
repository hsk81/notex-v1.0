__author__ ="hsk81"
__date__ ="$Mar 27, 2012 1:06:43 PM$"

###############################################################################################
###############################################################################################

from editor.lib import MLStripper
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import tempfile
import uuid
import os

###############################################################################################
###############################################################################################

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

            try: result, diff = 0, subprocess.check_output (['diff', ftext_path, fhtml_path])
            except subprocess.CalledProcessError, ex: result, diff = ex.returncode, ex.output

            subprocess.call (['rm', fhtml_path, '-f'])
            subprocess.call (['rm', ftext_path, '-f'])

            zipBuffer.writestr (os.path.join (prefix, leaf.name), text)
            if result == 1:
                zipBuffer.writestr (os.path.join (prefix, leaf.name + ".diff"), diff)

    for node in ns:
        zipBuffer.writestr (os.path.join (prefix, node.name), ''); DATA.processToText (
            node, os.path.join (prefix, node), zipBuffer, target = None)

def processToLatex (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer, excludePdf = True)

def processToPdf (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer)

def processToLatexPdf (root, title, zipBuffer, excludePdf = False):

    processToText (root, title, zipBuffer)

    origin = os.path.join ('reports', '00000000-0000-0000-0000-000000000000')
    target = os.path.join ('reports', str (uuid.uuid4 ()))

    subprocess.call (['cp', origin, target, '-r'])
    unpackTree (root, os.path.join (target, 'source'))
    os.chdir (target)
    subprocess.call (['make', excludePdf and 'latex' or 'latexpdf'])

    pdfnames = []
    
    os.chdir ("build")
    for dirpath, dirnames, filenames in os.walk ('latex'):
        for filename in filenames:
            if not filename.endswith ('pdf'):
                zipBuffer.write (os.path.join (dirpath, filename), \
                    os.path.join (title, dirpath, filename))
            elif not excludePdf:
                subprocess.call (['mv', os.path.join (dirpath, filename), '.'])
                pdfnames.append (filename)

    for pdfname in pdfnames:
        zipBuffer.write (os.path.join ('.', pdfname), \
            os.path.join (title, pdfname))

    os.chdir ('..')
    os.chdir ('..')
    os.chdir ('..')

    subprocess.call (['rm', target, '-r'])

def unpackTree (root, prefix):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (decodestring (leaf.text.split (',')[1]))
        else:
            _, ext = os.path.splitext (leaf.name)
            if not ext in ['.yml','.rst','.txt']:
                continue ## security fix!
            with open (os.path.join (prefix, leaf.name), 'w') as file:
                file.write (MLStripper.strip_tags (leaf.text))

    for node in ns:
        subprocess.call (['mkdir', os.path.join (prefix, node.name)])
        unpackTree (node, os.path.join (prefix, node.name))

###############################################################################################
###############################################################################################
