__author__ = "hsk81"
__date__ = "$Jul 31, 2012 4:38:45 PM$"

################################################################################
################################################################################

from django.core.management.base import *

import sys
import base64
import mimetypes

################################################################################
################################################################################

class Command (BaseCommand):
    help = 'Encodes a resource using the data URI scheme'

    option_list = BaseCommand.option_list[1:] + (
        make_option ('-f', '--file',
            type='string',
            action='store',
            dest='path',
            default=None,
            help='path to resource [default: %default]'
        ),
    )

    def handle (self, *args, **options):
        if options['path']:
            with open (options['path'], 'r') as file:
                print Command.encode (file)
        else:
            print Command.encode (sys.stdin)

    def encode (file):
        _, name = os.path.split (file.name)
        if not mimetypes.inited: mimetypes.init ()
        mimetype, encoding = mimetypes.guess_type (name)

        return 'data:%s;base64,%s' %\
            (mimetype, base64.encodestring (file.read ()))

    encode = staticmethod (encode)

################################################################################
################################################################################
