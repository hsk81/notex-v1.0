__author__ = "hsk81"
__date__ = "$Jun 16, 2012 4:23:15 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.core.management.base import *

from optparse import *
from datetime import *

from editor.models import ROOT

import time
import logging

################################################################################
################################################################################

class Command (BaseCommand):

    ############################################################################
    ############################################################################

    help = 'Cleans up expired sessions with corresponding data'

    ############################################################################
    ############################################################################

    def check_datetime (option, opt_str, value, parser):

        if value is not None:

            try: result = datetime.strptime (value, '%Y-%m-%d %H:%M:%S')
            except ValueError as e: raise OptionValueError ('%s' % e)

        else: result = None

        setattr(parser.values, option.dest, result)

    ############################################################################
    ############################################################################

    option_list = BaseCommand.option_list[1:] + (
        make_option ('-v', '--verbose',
            action='store_true',
            dest='verbose',
            default=False,
            help='sets logger to the debug level'
        ),

        make_option ('-l', '--log-level',
            type='string',
            action='store',
            dest='log_level',
            default='info',
            help='general log level [default: %default]'
        ),

        make_option ('-b', '--beg-datetime',
            type='string',
            action='callback',
            dest='beg_datetime',
            callback=check_datetime,
            default=None,
            help='beg datetime for interval [default: %default]'
        ),

        make_option ('-e', '--end-datetime',
            type='string',
            action='callback',
            dest='end_datetime',
            callback=check_datetime,
            default=None,
            help='end datetime for interval [default: %default]'
        ),

    )
    
    ############################################################################
    def handle (self, *args, **options):
    ############################################################################

        logging.basicConfig (format='[%(asctime)s] %(levelname)s: %(message)s')

        log_level = getattr (logging, options['log_level'].upper(), None)
        if not isinstance (log_level, int):
            raise CommandError ('invalid level: %s' % options['log_level'])

        log = logging.getLogger ('srv')
        log.setLevel (options['verbose'] and logging.DEBUG or log_level)
        
        log.debug ('determining beg datetime')
        if options['beg_datetime'] is not None:
            beg_datetime = options['beg_datetime']
        else:
            beg_datetime = datetime.min

        log.debug ('determining end datetime')
        if options['end_datetime'] is not None:
            end_datetime = options['end_datetime']
        else:
            end_datetime = datetime.now () - timedelta (0, settings.SESSION_COOKIE_AGE)

        try:
            log.info ('cleaning up from [%s, %s]' % (beg_datetime, end_datetime))
            Command.main (beg_datetime, end_datetime)
            log.info ('done')

        except KeyboardInterrupt:
            pass

        except Exception, ex:
            log.exception (ex)

    ############################################################################
    def main (beg_datetime, end_datetime, root = 'notex/session'):
    ############################################################################

        session_engine = eval (settings.SESSION_ENGINE)
        for sid in os.listdir (root):

            prefix, uuid = sid.split ('.')
            session = session_engine.SessionStore (session_key=uuid)

            if not session.has_key ('timestamp'):
                Command.cleanup (session)

            elif beg_datetime <= session['timestamp'] < end_datetime:
                Command.cleanup (session)

    main = staticmethod (main)

    ############################################################################
    def cleanup (session):
    ############################################################################

        pass

    cleanup = staticmethod (cleanup)

################################################################################
################################################################################
