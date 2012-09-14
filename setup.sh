#!/bin/bash

if [ -d .git ] ; then
    git submodule update --init
fi

virtualenv2 . --prompt="[notex] "
source bin/activate

if [ -f /usr/bin/postgres ] ; then
    pip install $1 psycopg2
fi

pip install $1 django
pip install $1 django-debug-toolbar
pip install $1 django-jsmin
pip install $1 django-cssmin
pip install $1 python-memcached
pip install $1 pyyaml
pip install $1 flup
pip install $1 Sphinx

deactivate
