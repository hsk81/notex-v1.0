#!/bin/bash

EXECUSR="${1-http}"
EXECGRP="${2-http}"

sudo -u $EXECUSR -g $EXECGRP \
    ./serve.sh restart
