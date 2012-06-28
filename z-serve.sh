#!/bin/bash

EXECUSR="${1-http}"
EXECGRP="${2-http}"

case "$1" in
    start)
        $0 chown
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh start
        ;;
    stop)
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
