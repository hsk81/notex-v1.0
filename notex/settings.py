# -*- coding: utf-8 -*-
DEBUG = True
TEMPLATE_DEBUG = DEBUG

ADMINS = (
    ('admin', 'admin@mail.net'),
)

MANAGERS = ADMINS

import os
SITE_ROOT = os.path.realpath (os.path.dirname (__file__))
SITE_NAME = 'notex'
SITE_HOST = 'blackhan.ch'

import socket
if socket.gethostname() != SITE_HOST:

    SITE_HOST = 'localhost'

DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = os.path.join (SITE_ROOT, 'sqlite.db')
DATABASE_USER = ''
DATABASE_PASSWORD = ''
DATABASE_HOST = ''
DATABASE_PORT = ''

TIME_ZONE = 'Europe/Zurich'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = True
USE_L10N = True

MEDIA_ROOT = os.path.join (SITE_ROOT, 'media/')
MEDIA_URL = 'http://media.%s/%s/' % (SITE_HOST, SITE_NAME)
ADMIN_MEDIA_PREFIX = '/media/'

SECRET_KEY = 'd1ykmma4mf3y=#c3t%u5!u(luzt^c*$zny%u8+4)a4@8n0+jju'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
 ## 'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
 ## 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
)

if DEBUG:
    
    MIDDLEWARE_CLASSES += ('django_pdb.middleware.PdbMiddleware',)

CACHE_BACKEND = 'memcached://%s:11211' % SITE_HOST
ROOT_URLCONF = '%s.urls' % SITE_NAME

SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_FILE_PATH = os.path.join (SITE_ROOT, 'session/')
SESSION_COOKIE_AGE = 259200 ## secs: three days
SESSION_COOKIE_DOMAIN = None
SESSION_COOKIE_NAME = 'sid.'
SESSION_COOKIE_PATH = '/'
SESSION_COOKIE_SECURE = False
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_SAVE_EVERY_REQUEST = False

TEMPLATE_DIRS = (
    os.path.join (SITE_ROOT, 'templates/'),
)

FIXTURE_DIRS = (
    os.path.join (SITE_ROOT, 'fixtures/'),
)

INSTALLED_APPS = (

 ## 'django_extensions', 
    'django_pdb',

    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.admin',
    'django.contrib.admindocs',

    'util', 'svc', 'editor',
)
