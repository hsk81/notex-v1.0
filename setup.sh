#!/bin/bash

git submodule update --init

virtualenv . --prompt="[notex] "
source bin/activate

pip install django
pip install pylibmc
pip install django_pdb
pip install numpy
pip install pyyaml
pip install flup

./manage.py syncdb --noinput
./serve.sh # lighttpd & memcached!

deactivate
