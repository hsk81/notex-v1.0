#!/bin/bash

###############################################################################
###############################################################################

USRNGRP=${2}
EXECUSR=${USRNGRP/:*/}
EXECGRP=${USRNGRP/*:/}

###############################################################################
###############################################################################

case $1 in
    co)
        sudo chown $EXECUSR:$EXECGRP . -R
        ;;
    as)
        $0 co ${2} && sudo -u $EXECUSR -g $EXECGRP ./serve.sh $3 $4 $5 $6 $7
        ;;
    *)
        $0 as http:http
esac

###############################################################################
###############################################################################

exit 0

###############################################################################
###############################################################################
