__author__ = "hsk81"
__date__ = "$Jun 16, 2012 4:23:15 PM$"

################################################################################
################################################################################

from django.conf import settings
from django.core.management.base import *

from optparse import *
from datetime import *
from editor.models import ROOT

import django.contrib.sessions.backends.db
import django.contrib.sessions.backends.cache
import django.contrib.sessions.backends.file
import django.contrib.sessions.backends.cached_db

import re
import logging
import subprocess

################################################################################
################################################################################

logger = logging.getLogger (__name__)

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

        setattr (parser.values, option.dest, result)

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
            default=datetime.min,
            help='beg datetime for interval [default: %default]'
        ),

        make_option ('-e', '--end-datetime',
            type='string',
            action='callback',
            dest='end_datetime',
            callback=check_datetime,
            default=datetime.now ()-timedelta (0, settings.SESSION_COOKIE_AGE),
            help='end datetime for interval [default: %default]'
        ),

        make_option ('--skip-data',
            action='store_true',
            dest='skip_data',
            default=False,
            help='%s files will not be deleted' % os.path.join (
                settings.MEDIA_DATA, '*'
            )
        ),

        make_option ('--skip-temp',
            action='store_true',
            dest='skip_temp',
            default=False,
            help='%s files will not be deleted' % os.path.join (
                settings.MEDIA_TEMP, '*'
            )
        ),

        make_option ('--skip-usid',
            action='store_true',
            dest='skip_usid',
            default=False,
            help='%s files will not be deleted' % os.path.join (
                settings.SESSION_FILE_PATH, settings.SESSION_COOKIE_NAME + '*'
            )
        ),

        make_option ('-a', '--include-admin',
            action='store_true',
            dest='clean_admin',
            default=False,
            help='include admin sessions in cleanup'
        ),

        make_option ('-d', '--dry-run',
            action='store_true',
            dest='dry_run',
            default=False,
            help='disables actual cleanup'
        ),
        )

    ############################################################################
    def handle (self, *args, **options):
    ############################################################################

        log_level = getattr (logging, options['log_level'].upper(), None)
        if not isinstance (log_level, int):
            raise CommandError ('invalid level: %s' % options['log_level'])

        logger.setLevel (options['verbose'] and logging.DEBUG or log_level)

        interval = {
            'beg_datetime': options['beg_datetime'],
            'end_datetime': options['end_datetime']
        }

        skip_flags = {
            'skip_data': options['skip_data'],
            'skip_temp': options['skip_temp'],
            'skip_usid': options['skip_usid']
        }

        clean_admin = options['clean_admin']
        dry_run = options['dry_run']

        try:
            if interval['beg_datetime'] > datetime.min:
                logger.info ('cleaning from %s &&' % interval['beg_datetime']
                    .strftime ('%Y-%m-%d %H:%M:%S'))
                logger.info ('cleaning till %s ..' % interval['end_datetime']
                    .strftime ('%Y-%m-%d %H:%M:%S'))
            else:
                logger.info ('cleaning till %s ..' % interval['end_datetime']
                    .strftime ('%Y-%m-%d %H:%M:%S'))

            Command.main (interval, skip_flags, clean_admin, dry_run)
            logger.info ('done')

        except KeyboardInterrupt:
            pass

        except Exception, ex:
            logger.exception (ex)

    ############################################################################
    def main (interval, skip_flags, clean_admin, dry_run):
    ############################################################################

        beg_datetime = interval['beg_datetime']
        end_datetime = interval['end_datetime']

        session_engine = eval (settings.SESSION_ENGINE)
        regex = settings.SESSION_COOKIE_NAME + r'[0-9a-f]{32}'

        for sid in os.listdir (settings.SESSION_FILE_PATH):

            if not re.match (regex, sid): continue
            prefix, uuid = sid.split ('.')
            session = session_engine.SessionStore (session_key=uuid)

            if session.has_key ('timestamp') and \
               beg_datetime <= session['timestamp'] < end_datetime:

                logger.info ('processing session %s' % sid)
                logger.debug ('session is expired')
                Command.cleanup (session, skip_flags, dry_run)

            elif not session.has_key ('timestamp') and clean_admin:

                logger.info ('processing session %s' % sid)
                logger.debug ('no timestamp, assume admin session')
                Command.cleanup (session, skip_flags, dry_run)


    main = staticmethod (main)

    ############################################################################
    def cleanup (session, skip_flags, dry_run):
    ############################################################################

        delete_usid = not skip_flags['skip_usid']
        delete_data = not skip_flags['skip_data']
        delete_temp = not skip_flags['skip_temp']

        try:

            roots = ROOT.objects.filter (_usid = session.session_key)
            for root in roots:
                logger.debug ('deleting root %s' % root.id)

                root.delete_usid = delete_usid
                root.delete_data = delete_usid or delete_data
                root.delete_temp = delete_usid or delete_temp

                if not dry_run: root.delete ()

            if not roots.count():
                logger.debug ('no root node found')
                logger.debug ("cleaning session's remainder (if any)")

                path_to_data = os.path.join (settings.MEDIA_DATA,
                    session.session_key)
                path_to_temp = os.path.join (settings.MEDIA_TEMP,
                    session.session_key)
                path_to_usid = os.path.join (settings.SESSION_FILE_PATH,
                    settings.SESSION_COOKIE_NAME + session.session_key)

                if delete_usid:
                    if os.path.exists (path_to_usid) and not dry_run:
                        subprocess.check_call (['rm', path_to_usid, '-f'])

                if delete_usid or delete_data:
                    if os.path.exists (path_to_data) and not dry_run:
                        subprocess.check_call (['rm', path_to_data, '-r'])

                if delete_usid or delete_temp:
                    if os.path.exists (path_to_data) and not dry_run:
                        subprocess.check_call (['rm', path_to_temp, '-r'])

        except Exception, ex:
            logger.exception (ex)

    cleanup = staticmethod (cleanup)

################################################################################
################################################################################
