__author__="hsk81"
__date__ ="$Mar 27, 2012 1:06:43 PM$"

###############################################################################################
###############################################################################################

from editor.lib import MLStripper
from editor.models import NODE, LEAF
from base64 import decodestring

import subprocess
import uuid
import os

###############################################################################################
###############################################################################################

def processToText (root, prefix, zipBuffer):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr (os.path.join (prefix, leaf.name), \
                decodestring (leaf.text.split (',')[1]))
        else:
            zipBuffer.writestr (os.path.join (prefix, leaf.name), \
                MLStripper.strip_tags (leaf.text))

    for node in ns:
        zipBuffer.writestr ('%s/%s/' % (prefix, node.name), ''); DATA.processToText (
            node, os.path.join (prefix, node), zipBuffer)

def processToHtml (root, prefix, zipBuffer):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr (os.path.join (prefix, leaf.name), \
                decodestring (leaf.text.split (',')[1]))
        else:
            zipBuffer.writestr (os.path.join (prefix, leaf.name), \
                leaf.text)

    for node in ns:
        zipBuffer.writestr (os.path.join (prefix, node.name), ''); DATA.processToHtml (
            node, os.path.join (prefix, node), zipBuffer)

def processToLatex (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer, includePdf = False)

def processToPdf (root, title, zipBuffer):

    processToLatexPdf (root, title, zipBuffer, includePdf = True)

def processToLatexPdf (root, title, zipBuffer, includePdf = True):

    origin = os.path.join ('reports', '00000000-0000-0000-0000-000000000000')
    target = os.path.join ('reports', str (uuid.uuid4 ()))

    result = subprocess.call (['cp', origin, target, '-r'])
    if result != 0: return
    result = unpackTree (root, os.path.join (target, 'source'))
    if result != 0: return

    os.chdir (target)
    result = subprocess.call (['make', includePdf and 'latexpdf' or 'latex'])
    if result != 0: return

    pdfnames = []
    
    os.chdir ("build")
    for dirpath, dirnames, filenames in os.walk ('latex'):
        for filename in filenames:
            if not filename.endswith ('pdf'):
                zipBuffer.write (os.path.join (dirpath, filename), \
                    os.path.join (title, dirpath, filename))
            elif includePdf:
                result = subprocess.call (['mv', os.path.join (dirpath, filename), '.'])
                if result != 0: return
                pdfnames.append (filename)

    for pdfname in pdfnames:
        zipBuffer.write (os.path.join ('.', pdfname), \
            os.path.join (title, pdfname))

    os.chdir ('..')
    os.chdir ('..')
    os.chdir ('..')

    result = subprocess.call (['rm', target, '-r'])
    if result != 0: return

def unpackTree (root, prefix):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        with open (os.path.join (prefix, leaf.name), 'w') as file:
            if leaf.type.code == 'image':
                file.write (decodestring (leaf.text.split (',')[1]))
            else:
                file.write (MLStripper.strip_tags (leaf.text \
                    .replace ('\n<br>','<br>').replace ('<br>','\n')))

    for node in ns:
        result = subprocess.call (['mkdir', os.path.join (prefix, node.name)])
        if result != 0: return result
        result = unpackTree (node, os.path.join (prefix, node.name))
        if result != 0: return result

    return 0

###############################################################################################
###############################################################################################
