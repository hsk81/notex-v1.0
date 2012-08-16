__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:57 PM$"

###############################################################################
###############################################################################

import re
import os
import socket
import logging

###############################################################################
###############################################################################

MACH_PROs = [r'notex.ch$', r'blackhan.ch$']
MACH_VMEs = [r'vmach.(v.+)$']

def in_rxs (exp, rxs):
    """
    Returns ``None`` if expression ``exp`` does not match any in list ``rxs``
    of regular expressions; otherwise returns first match.
    """
    return reduce (lambda res, rx: res or re.match (rx, exp), rxs, None)

###############################################################################
###############################################################################

SITE_ROOT = os.path.realpath (os.path.dirname (__file__))
SITE_NAME = 'notex'
SITE_HOST = socket.gethostname ()

DEBUG = not in_rxs (SITE_HOST, MACH_PROs + MACH_VMEs)
TEMPLATE_DEBUG = DEBUG

if DEBUG:
    SITE_HOST = 'localhost'

ADMINS = (('admin', 'admin@mail.net'),)
MANAGERS = ADMINS

DATABASES = {
    'postgresql': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'notex',
        'USER': 'notex'
    },
    'sqlite': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join (SITE_ROOT, 'sqlite.db'),
    },
}

DATABASES['default'] = \
    DATABASES['postgresql'] if in_rxs (SITE_HOST, MACH_PROs) else \
    DATABASES['sqlite']

del DATABASES['postgresql']
del DATABASES['sqlite']

TIME_ZONE = 'Europe/Zurich'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1

USE_I18N = True
USE_L10N = True
USE_TZ = True

MEDIA_ROOT = os.path.join (SITE_ROOT, 'media')
MEDIA_URL = 'http://media.%s/%s/' % (SITE_HOST, SITE_NAME)

MEDIA_DATA = os.path.join (MEDIA_ROOT, 'dat')
MEDIA_TEMP = os.path.join (MEDIA_ROOT, 'tmp')

STATIC_ROOT = os.path.join (SITE_ROOT, 'static')
STATIC_URL = 'http://static.%s/%s/' % (SITE_HOST, SITE_NAME)
STATICFILES_DIRS = ()

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
 ## 'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

SECRET_KEY = 'u_rzhb_@f=2_ha)x=$*1zazaoqwvgxhwqaiv)jafy^qnho(096'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
 ## 'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

CACHES = {
    'default' : {
        'BACKEND' :
            'django.core.cache.backends.dummy.DummyCache' if DEBUG else
            'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION' : '127.0.0.1:11211',
        'TIMEOUT' : 240, ## secs: staleness
    },
    'memcached' : {
        'BACKEND' :
            'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION' : '127.0.0.1:11211',
        'TIMEOUT' : 240, ## secs: staleness
    },
}

SESSION_ENGINE = 'django.contrib.sessions.backends.file'
SESSION_FILE_PATH = os.path.join (SITE_ROOT, 'session/')
SESSION_COOKIE_AGE = 3 * 24 * 3600 ## secs: 3d
SESSION_COOKIE_NAME = 'sid'
SESSION_COOKIE_SECURE = False

ROOT_URLCONF = '%s.urls' % SITE_NAME
WSGI_APPLICATION = '%s.wsgi.application' % SITE_NAME

TEMPLATE_DIRS = (os.path.join (SITE_ROOT, 'templates/'),)
FIXTURE_DIRS = (os.path.join (SITE_ROOT, 'fixtures/'),)

INSTALLED_APPS = (
    'djcssmin', 'djjsmin',

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',

    'notex', 'tags', 'editor',
)

################################################################################
################################################################################

class NoMessageFailuresFilter (logging.Filter):
    """
    See http://github.com/omab/django-social-auth/issues/283
    """
    def filter (self, record):
        if record.exc_info:
            from django.contrib.messages.api import MessageFailure
            exception = record.exc_info[1]
            if isinstance (exception, MessageFailure):
                return False # IGNORE ANNOYING MESSAGEFAILUREs!
        return True

###############################################################################
###############################################################################

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,

    'formatters': {
        'simplis': {
            'format': '[%(asctime)s] %(levelname)s -- ' \
                '%(message)s',
        },
        'verbose': {
            'format': '[%(asctime)s] %(levelname)s %(name)s:%(lineno)d -- ' \
                '%(message)s',
        },
    },

    'handlers': {
        'null': {
            'level':'DEBUG',
            'class':'django.utils.log.NullHandler',
        },

        'console-simplis': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simplis',
        },
        'console-verbose': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },

        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': 'log/%s.log' % SITE_NAME,
            'when': 'D',
            'interval': 1,
            'formatter': 'verbose',
        },
        'file-exporter': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': 'log/exporter.log',
            'when': 'D',
            'interval': 1,
            'formatter': 'verbose',
        },
        'file-importer': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': 'log/importer.log',
            'when': 'D',
            'interval': 1,
            'formatter': 'verbose',
        },
        'file-cleanup': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': 'log/cleanup.log',
            'when': 'D',
            'interval': 1,
            'formatter': 'simplis',
        },
    },

    'filters': {
        'no_message_failures': {
            '()': NoMessageFailuresFilter,
        },
    },

    'root': {
        'level': 'ERROR',
        'handlers': ['console-verbose', 'file'],
    },

    'loggers': {
        'django.request': {
            'level': 'ERROR',
            'handlers': ['console-verbose', 'file'],
            'filters': ['no_message_failures'],
            'propagate': False
        },

        'editor.views.exporter': {
            'level':'ERROR',
            'handlers': ['console-verbose', 'file-exporter'],
            'propagate': False
        },
        'editor.views.importer': {
            'level':'ERROR',
            'handlers': ['console-verbose', 'file-importer'],
            'propagate': False
        },

        'notex.management.commands.cleanup': {
            'level':'ERROR',
            'handlers': ['console-simplis', 'file-cleanup'],
            'propagate': False
        },
    }
}

################################################################################
################################################################################

CSSMIN_INPUT = [
    'static/css/reset.css',
    'static/lib/codemirror/lib/codemirror.css',
    'static/lib/codemirror/lib/util/dialog.css',
]

CSSMIN_INPUT += [] if DEBUG else [
    'static/css/base.css',
    'static/css/icons-16.css',
    'static/css/sprite.css',
    'static/css/sprite-toolbar.css',
    'static/app/editor/css/Editor.css',
    'static/app/editor/css/Menu.css',
    'static/app/editor/css/CodeMirror.yaml.css',
    'static/app/editor/css/CodeMirror.rest.css',
    'static/app/editor/css/CodeMirror.css',
]

CSSMIN_OUTPUT = 'static/css/notex.min.css'

################################################################################
################################################################################

JSMIN_INPUT = [
    'static/lib/sprintf/sprintf.js',

    'static/lib/codemirror/lib/codemirror.js',
    'static/lib/codemirror/lib/util/searchcursor.js',
    'static/lib/codemirror/lib/util/overlay.js',
    'static/lib/codemirror/lib/util/search.js',
    'static/lib/codemirror/lib/util/dialog.js',
    'static/lib/codemirror/mode/clike/clike.js',
    'static/lib/codemirror/mode/css/css.js',
    'static/lib/codemirror/mode/diff/diff.js',
    'static/lib/codemirror/mode/gfm/gfm.js',
    'static/lib/codemirror/mode/go/go.js',
    'static/lib/codemirror/mode/haskell/haskell.js',
    'static/lib/codemirror/mode/htmlembedded/htmlembedded.js',
    'static/lib/codemirror/mode/htmlmixed/htmlmixed.js',
    'static/lib/codemirror/mode/javascript/javascript.js',
    'static/lib/codemirror/mode/jinja2/jinja2.js',
    'static/lib/codemirror/mode/less/less.js',
    'static/lib/codemirror/mode/lua/lua.js',
    'static/lib/codemirror/mode/markdown/markdown.js',
    'static/lib/codemirror/mode/mysql/mysql.js',
    'static/lib/codemirror/mode/ocaml/ocaml.js',
    'static/lib/codemirror/mode/pascal/pascal.js',
    'static/lib/codemirror/mode/perl/perl.js',
    'static/lib/codemirror/mode/php/php.js',
    'static/lib/codemirror/mode/pig/pig.js',
    'static/lib/codemirror/mode/plsql/plsql.js',
    'static/lib/codemirror/mode/properties/properties.js',
    'static/lib/codemirror/mode/python/python.js',
    'static/lib/codemirror/mode/r/r.js',
    'static/lib/codemirror/mode/rpm/changes/changes.js',
    'static/lib/codemirror/mode/rpm/spec/spec.js',
    'static/lib/codemirror/mode/rst/rst.js',
    'static/lib/codemirror/mode/ruby/ruby.js',
    'static/lib/codemirror/mode/scheme/scheme.js',
    'static/lib/codemirror/mode/shell/shell.js',
    'static/lib/codemirror/mode/smalltalk/smalltalk.js',
    'static/lib/codemirror/mode/stex/stex.js',
    'static/lib/codemirror/mode/tiddlywiki/tiddlywiki.js',
    'static/lib/codemirror/mode/vbscript/vbscript.js',
    'static/lib/codemirror/mode/verilog/verilog.js',
    'static/lib/codemirror/mode/xml/xml.js',
    'static/lib/codemirror/mode/xquery/xquery.js',
    'static/lib/codemirror/mode/yaml/yaml.js',

    'static/lib/jquery/jquery.min.js',
    'static/lib/extjs/adapter/ext/ext-base.js',
    'static/lib/extjs/ext-all.js',
    'static/lib/extjs/examples/ux/statusbar/StatusBar.js',
]

JSMIN_INPUT += [] if DEBUG else [
    'static/app/editor/js/Math.uuid.js',
    'static/app/editor/js/Dialog.openFile.js',
    'static/app/editor/js/Dialog.js',
    'static/app/editor/js/CodeMirror.js',
    'static/app/editor/js/CodeMirror.mime.js',
    'static/app/editor/js/CodeMirror.yaml.js',
    'static/app/editor/js/CodeMirror.rest.js',
    'static/app/editor/js/ReportManager.util.js',
    'static/app/editor/js/ReportManager.crud.js',
    'static/app/editor/js/ReportManager.tree.js',
    'static/app/editor/js/ReportManager.task.js',
    'static/app/editor/js/ReportManager.tbar.js',
    'static/app/editor/js/ReportManager.js',
    'static/app/editor/js/Editor.ribbon.js',
    'static/app/editor/js/Editor.tbar.js',
    'static/app/editor/js/Editor.js',
    'static/app/editor/js/StatusBar.js',
    'static/app/editor/js/Ajax.csrf.js',
    'static/app/editor/js/KeyMap.js',
    'static/app/editor/js/Viewport.js',
]

JSMIN_OUTPUT = 'static/js/notex.min.js'

################################################################################
################################################################################
