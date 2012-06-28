#!/bin/bash

EXECUSR="${1-http}"
EXECGRP="${2-http}"

sudo chown $EXECUSR:$EXECGRP . -R
sudo -u $EXECUSR -g $EXECGRP \
    ./serve.sh restart
