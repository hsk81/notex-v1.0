#!/bin/bash

ACTMETH="${1-restart}"
HOSTVAL="${2-127.0.0.1}"
PORTVAL="${3-3001}"
CGIPROT="${4-fcgi}"
SRVMETH="${5-threaded}"
DAEMOON="${6-true}"

PROJDIR="$(pwd)"
PIDFILE="$PROJDIR/.pid"

case $ACTMETH in
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
