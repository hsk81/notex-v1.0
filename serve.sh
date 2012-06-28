#!/bin/bash

PROJDIR="$(pwd)"

DAEMOON="${2-true}"
HOSTVAL="${3-127.0.0.1}"
PORTVAL="${4-3001}"
CGIPROT="${5-fcgi}"
SRVMETH="${6-threaded}"

PIDFILE="$PROJDIR/.pid"

case "$1" in
    start)
        if [ -f $PIDFILE ]; then
            PID=$(cat -- $PIDFILE)
            STA=$(ps $PID)
            if [ "$?" -eq "0" ] ; then
                exit 0
            fi
            rm -f -- $PIDFILE
        fi

        if [ -f bin/activate ] ; then
            source bin/activate
        fi

        exec ./manage.py runfcgi \
            method=$SRVMETH protocol=$CGIPROT \
            host=$HOSTVAL port=$PORTVAL \
            pidfile=$PIDFILE daemonize=$DAEMOON
        ;;
    stop)
        if [ -f $PIDFILE ]; then
            kill $(cat -- $PIDFILE) &> /dev/null
            rm -f -- $PIDFILE
        fi
        ;;
    restart)
        $0 stop
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
        $0 restart
esac

exit 0
