#!/bin/bash

git submodule update --init
virtualenv . --prompt="[notex] "
source bin/activate

pip install ipython
pip install django
pip install django-redis
pip install django-jsmin
pip install django-cssmin
pip install psycopg2
pip install pylibmc
pip install numpy
pip install pyyaml
pip install flup

deactivate
