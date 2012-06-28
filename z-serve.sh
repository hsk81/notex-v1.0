#!/bin/bash

ACTMETH="${1}"
EXECUSR="${2-http}"
EXECGRP="${3-http}"

case $ACTMETH in
    start)
        sudo chown $EXECUSR:$EXECGRP . -R
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh start $4 $5 $6 $7 $8
        ;;
    stop)
        sudo chown $EXECUSR:$EXECGRP . -R
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh stop $4 $5 $6 $7 $8
        ;;
    restart)
        sudo chown $EXECUSR:$EXECGRP . -R
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh restart $4 $5 $6 $7 $8
        ;;
    status)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh status $4 $5 $6 $7 $8
        ;;
    chown)
        sudo chown $EXECUSR:$EXECGRP . -R
        ;;
    *)
        $0 restart
esac

exit 0
