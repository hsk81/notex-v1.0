#!/bin/bash

ACTMETH="${1-restart}"

DAEMOON="${2-true}"
HOSTVAL="${3-127.0.0.1}"
PORTVAL="${4-3001}"
CGIPROT="${5-fcgi}"
SRVMETH="${6-threaded}"

EXECUSR="${7-http}"
EXECGRP="${8-http}"

sudo -u $EXECUSR -g $EXECGRP ./serve.sh $ACTMETH \
    $DAEMON $HOSTVAL $PORTVAL $CGIPROT $SRVMETH
