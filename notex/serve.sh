#!/bin/bash

PROJDIR="$(pwd)"
PROJECT="$(basename $PROJDIR)"

SRVMETH="threaded"
HOSTVAL="${1-127.0.0.1}"
PORTVAL="${2-3001}"
PIDFILE="$PROJDIR/$PROJECT.pid"

cd $PROJDIR

if [ -f $PIDFILE ]; then
    kill $(cat -- $PIDFILE) &> /dev/null
    rm -f -- $PIDFILE
fi

exec /usr/bin/env - PYTHONPATH="../python:.." \
  ./manage.py runfcgi method=$SRVMETH host=$HOSTVAL port=$PORTVAL pidfile=$PIDFILE
