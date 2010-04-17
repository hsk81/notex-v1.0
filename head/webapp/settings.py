DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('admin', 'admin@mail.net'),
)

MANAGERS = ADMINS

import os
SITE_ROOT = os.path.realpath (os.path.dirname (__file__))
SITE_NAME = 'webapp' ## notex
SITE_HOST = 'blackhan.ch'

DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = os.path.join (SITE_ROOT, 'sqlite.db')
DATABASE_USER = ''
DATABASE_PASSWORD = ''
DATABASE_HOST = ''
DATABASE_PORT = ''

TIME_ZONE = 'Europe/Zurich'
LANGUAGE_CODE = 'en-us'
SITE_ID = 2
USE_I18N = True

MEDIA_ROOT = os.path.join (SITE_ROOT, 'media/')
MEDIA_URL = 'http://media.%s/%s/' % (SITE_HOST, SITE_NAME)
ADMIN_MEDIA_PREFIX = '/media/'

SECRET_KEY = 'd1ykmma4mf3y=#c3t%u5!u(luzt^c*$zny%u8+4)a4@8n0+jju'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.load_template_source',
    'django.template.loaders.app_directories.load_template_source',
#   'django.template.loaders.eggs.load_template_source',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
)

CACHE_BACKEND = 'memcached://127.0.0.1:11211'
EXTJS = 'extjs-3.2'
ROOT_URLCONF = '%s.urls' % SITE_NAME

TEMPLATE_DIRS = (
    os.path.join (SITE_ROOT, 'templates/'),
)

INSTALLED_APPS = (

    'django.contrib.auth'         ,
    'django.contrib.contenttypes' ,
    'django.contrib.sessions'     ,
    'django.contrib.sites'        ,
    'django.contrib.admin'        ,

    'svc'
)
