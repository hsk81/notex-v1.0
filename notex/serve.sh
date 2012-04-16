#!/bin/bash

PROJDIR="$(pwd)"
PROJECT="$(basename $PROJDIR)"

SRVMETH="threaded"
HOSTVAL="${2-127.0.0.1}"
PORTVAL="${3-3001}"
PIDFILE="$PROJDIR/$PROJECT.pid"

case "$1" in
	start)
		$0 stop
        exec /usr/bin/env - PYTHONPATH="../python:.." \
            ./manage.py runfcgi method=$SRVMETH host=$HOSTVAL port=$PORTVAL \
                pidfile=$PIDFILE
        ;;
    stop)
        if [ -f $PIDFILE ]; then
            kill $(cat -- $PIDFILE) &> /dev/null
            rm -f -- $PIDFILE
        fi
        ;;
    restart)
		$0 start
        ;;
    status)
        if [ -f $PIDFILE ]; then
            PID=$(cat -- $PIDFILE)
            STA=$(ps $PID)
            if [ "$?" -eq "0" ] ; then
                echo "live: $PID"
            else
                echo "dead: $PID"
            fi
        else
            echo "dead"            
        fi
        ;;
    *)
		$0 start
esac

exit 0
