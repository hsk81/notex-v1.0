#!/bin/bash

ACTMETH="${1}"
USRNGRP="${2-http:http}"
EXECUSR="${USRNGRP/:*/}"
EXECGRP="${USRNGRP/*:/}"

case $ACTMETH in
    start)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh start $3 $4 $5 $6 $7
        ;;
    stop)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh stop $3 $4 $5 $6 $7
        ;;
    restart)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh restart $3 $4 $5 $6 $7
        ;;
    status)
        sudo -u $EXECUSR -g $EXECGRP ./serve.sh status $3 $4 $5 $6 $7
        ;;
    as)
        sudo chown $EXECUSR:$EXECGRP . -R
        ;;
    *)
        sudo chown $EXECUSR:$EXECGRP . -R
        $0 restart
esac

exit 0
