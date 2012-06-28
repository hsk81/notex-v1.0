#!/bin/bash

EXECUSR="${7-http}"
EXECGRP="${8-http}"

sudo chown $EXECUSR:$EXECGRP . -R
sudo -u $EXECUSR -g $EXECGRP ./serve.sh \
    restart $2 $3 $4 $5 $6
