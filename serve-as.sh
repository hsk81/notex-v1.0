#!/bin/bash

EXECUSR="${1-http}"
EXECGRP="${2-http}"

sudo chown $EXECUSR:$EXECGRP . -R
sudo -u $EXECUSR -g $EXECGRP ./serve.sh \
    $3 $4 $5 $6 $7 $8
