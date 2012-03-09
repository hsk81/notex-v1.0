from editor.lib import MLStripper
from editor.models import NODE, LEAF
from base64 import decodestring

def processToText (root, prefix, zipBuffer):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr ('%s/%s' % (prefix,leaf.name), \
                decodestring (leaf.text.split (',')[1]))
        else:
            zipBuffer.writestr ('%s/%s' % (prefix,leaf.name), \
                MLStripper.strip_tags (leaf.text))

    for node in ns:
        zipBuffer.writestr ('%s/%s/' % (prefix, node.name), ''); DATA.processToText (
            node, "%s/%s" % (prefix, node), zipBuffer)

def processToHtml (root, prefix, zipBuffer):

    ls = LEAF.objects.filter (_node = root)
    ns = NODE.objects.filter (_node = root)

    for leaf in ls:
        if leaf.type.code == 'image':
            zipBuffer.writestr ('%s/%s' % (prefix,leaf.name), \
                decodestring (leaf.text.split (',')[1]))
        else:
            zipBuffer.writestr ('%s/%s' % (prefix,leaf.name), \
                leaf.text)

    for node in ns:
        zipBuffer.writestr ('%s/%s/' % (prefix, node.name), ''); DATA.processToHtml (
            node, "%s/%s" % (prefix, node), zipBuffer)

def processToLatex (root, prefix, zipBuffer):
    pass ## TODO!

def processToPdf (root, prefix, zipBuffer):
    pass ## TODO!
