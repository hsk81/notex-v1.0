#!/bin/bash

EXECUSR="${7-http}"
EXECGRP="${8-http}"

sudo -u $EXECUSR -g $EXECGRP ./serve.sh \
    status $2 $3 $4 $5 $6
