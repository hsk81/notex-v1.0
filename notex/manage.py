#!/usr/bin/env python2

################################################################################
################################################################################

__author__ = "hsk81"
__date__ = "$Apr 20, 2012 15:59:15 PM$"

################################################################################
################################################################################

from django.core.management import execute_manager

################################################################################
################################################################################

try:
    import settings # Assumed to be in the same directory.
except ImportError:
    import sys
    sys.stderr.write(
        "Error: Can't find the file 'settings.py' in the directory containing \
        %r. It appears you've customized things.\nYou'll have to run django-\
        admin.py, passing it your using an ImportError somehow.)\n" % __file__)
    sys.exit(1)

################################################################################
################################################################################

if __name__ == "__main__":
    execute_manager(settings)

################################################################################
################################################################################
