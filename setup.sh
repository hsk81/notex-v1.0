#!/bin/bash

git submodule update --init
virtualenv2 . --prompt="[notex] "
source bin/activate

pip install django
pip install django-jsmin
pip install django-cssmin
pip install psycopg2 ## may fail if no postgreqsql
pip install pylibmc
pip install pyyaml
pip install flup

pip install Sphinx

deactivate
