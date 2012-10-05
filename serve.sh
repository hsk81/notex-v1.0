#!/bin/bash

###############################################################################
###############################################################################

HOSTDEF="127.0.0.1"
PORTDEF="3001"

###############################################################################
###############################################################################

function hostval() {
    local hostval=${1/:*/}
    if [ -z "${hostval}" ]
    then
        echo $2 ## default
    else
        echo ${hostval}
    fi
}

function portval() {
    local hostval=${1/:*/}
    local portval=${1/*:/}
    if [ -z "${portval}" ]
    then
        echo $2 ## default
    else
        echo ${portval/$hostval/$2}
    fi
}

###############################################################################
###############################################################################

ACTMETH=${1-restart}
HOSTVAL=$(hostval ${2-$HOSTDEF:$PORTDEF} $HOSTDEF)
PORTVAL=$(portval ${2-$HOSTDEF:$PORTDEF} $PORTDEF)
CGIPROT=${3-fcgi}
SRVMETH=${4-threaded}
DAEMOON=${5-true}

PROJDIR=$(pwd)
PIDFILE=$PROJDIR/.pid-$PORTVAL

###############################################################################
###############################################################################

if [ -z secret.sh ] ; then
    source secret.sh
fi

###############################################################################
###############################################################################

function start() {
    if [ -f $1 ]; then
        local pid=$(cat -- $1)
        local sta=$(ps $pid)
        if [ "$?" -eq "0" ] ; then
            exit 0
        fi
        rm -f -- $1
    fi

    if [ -f bin/activate ] ; then
        source bin/activate
    fi

    exec ./manage.py runfcgi \
        method=$SRVMETH protocol=$CGIPROT \
        host=$HOSTVAL port=$PORTVAL \
        pidfile=$1 daemonize=$DAEMOON
}

function stop() {
    if [ -f $1 ]; then
        kill $(cat -- $1) &> /dev/null
        rm -f -- $1
    fi
}

function status() {
    if [ -f $1 ]; then
        PID=$(cat -- $1)
        STA=$(ps $PID)
        if [ "$?" -eq "0" ] ; then
            echo "[$1] live: $PID"
        else
            echo "[$1] dead: $PID"
        fi
    else
        echo "[$1] dead"
    fi
}

###############################################################################
###############################################################################

case $ACTMETH in
    restart)
        $0 stop $2 $3 $4 $5
        $0 start $2 $3 $4 $5
        ;;

    start)
        start $PIDFILE
        ;;
    stop)
        stop $PIDFILE
        ;;
    status)
        status $PIDFILE
        ;;

    stop-all)
        for PIF in $(ls $PROJDIR/.pid-* 2> /dev/null) ; do
            stop $PIF
        done
        ;;
    status-all)
        for PIF in $(ls $PROJDIR/.pid-* 2> /dev/null) ; do
            status $PIF
        done
        ;;

    *)
        $0 restart
esac

###############################################################################
###############################################################################

exit 0

###############################################################################
###############################################################################
