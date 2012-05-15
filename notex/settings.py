__author__ = "hsk81"
__date__ = "$Mar 27, 2012 1:12:57 PM$"

################################################################################
################################################################################

import os
SITE_ROOT = os.path.realpath (os.path.dirname (__file__))
SITE_NAME = 'notex'
SITE_HOST = 'blackhan.ch'

import socket
DEBUG = socket.gethostname () != SITE_HOST
TEMPLATE_DEBUG = DEBUG

if DEBUG:
    SITE_HOST = 'localhost'

ADMINS = (('admin', 'admin@mail.net'),)
MANAGERS = ADMINS

DATABASES = {
    'default' : {
        'ENGINE' : 'django.db.backends.sqlite3',
        'NAME' : os.path.join (SITE_ROOT, 'sqlite.db'),
    }
}

TIME_ZONE = 'Europe/Zurich'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = True
USE_L10N = True

ROOT_URLCONF = '%s.urls' % SITE_NAME

MEDIA_ROOT = os.path.join (SITE_ROOT, 'media/')
MEDIA_URL = 'http://media.%s/%s/' % (SITE_HOST, SITE_NAME)
ADMIN_MEDIA_PREFIX = '/media/'

SECRET_KEY = 'd1ykmma4mf3y=#c3t%u5!u(luzt^c*$zny%u8+4)a4@8n0+jju'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.middleware.transaction.TransactionMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
 ## 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'logger.ExceptionLoggerMiddleware'
)

if DEBUG:
    MIDDLEWARE_CLASSES += ('django_pdb.middleware.PdbMiddleware',)

CACHES = {
    'default' : {
        'BACKEND' : 'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION' : '127.0.0.1:11211',
        'TIMEOUT' : 240, #[s]
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_FILE_PATH = os.path.join (SITE_ROOT, 'session/')
SESSION_COOKIE_AGE = 3 * 24 * 60 * 60 ## secs: 3 days
SESSION_COOKIE_NAME = 'sid.'
SESSION_COOKIE_SECURE = False

TEMPLATE_DIRS = (os.path.join (SITE_ROOT, 'templates/'),)
FIXTURE_DIRS = (os.path.join (SITE_ROOT, 'fixtures/'),)

INSTALLED_APPS = (
    'django_pdb',

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.admindocs',

    'tags', 'svc', 'editor',
)

################################################################################
################################################################################

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'WARNING',
        'handlers': ['console', 'file'],
    },
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
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'filename': 'log/notex.log',
            'when': 'D',
            'interval': 1,
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'logger.ExceptionLoggerMiddleware': {
            'level':'ERROR',
            'handlers':['console', 'file'],
            'propagate': False,
        },
    }
}

################################################################################
################################################################################