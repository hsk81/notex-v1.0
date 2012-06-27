#!/bin/bash

git submodule update --init
virtualenv . --prompt="[notex] "
source bin/activate

pip install ipython
pip install django
pip install django_pdb
pip install pylibmc
pip install numpy
pip install pyyaml
pip install flup

./manage.py syncdb --noinput
./serve.sh # webserver & cache!

deactivate
