#!/bin/bash

ACTMETH="${1}"
EXECUSR="${2-http}"
EXECGRP="${3-http}"

case $ACTMETH in
    start)
        $0 chown
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh start
        ;;
    stop)
        $0 chown
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh stop
        ;;
    restart)
        $0 chown
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh restart
        ;;
    status)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh status
        ;;
    chown)
        sudo chown $EXECUSR:$EXECGRP . -R
        ;;
    *)
        $0 restart
esac

exit 0
