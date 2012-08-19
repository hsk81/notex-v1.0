#!/bin/bash

###############################################################################
###############################################################################

SRVROOT=/srv/http/htdocs
GITREPO=notex.git
PKGARCH=notex.tgz
APPPATH=notex.app

SSHPASS=~/.ssh/id_rsa.vmach
SSHPORT=2222
SSHUSER=root
SSHMACH=localhost

SSHEXEC="/usr/bin/ssh -p $SSHPORT -i $SSHPASS $SSHUSER@$SSHMACH"
SCPEXEC="/usr/bin/scp -P $SSHPORT -i $SSHPASS"
SRVEXEC="/usr/bin/sudo -u http -g http"

###############################################################################
###############################################################################

function archive() {
    cd $SRVROOT/$GITREPO
    rm temp -rf && mkdir temp
    git archive master | tar -x -C temp
    git submodule foreach --recursive \
        'git archive $sha1 | tar -x -C $toplevel/temp/$path'
    export SHAPATH=sha-`git rev-parse --short master`
    rm $APPPATH -rf && mkdir $APPPATH
    mv temp $APPPATH/$SHAPATH
    tar czvf $PKGARCH $APPPATH/$SHAPATH
    rm $APPPATH -r
}

function startvm() {
    echo -n
}

function upload() {
    cd $SRVROOT/$GITREPO
    $SCPEXEC $PKGARCH $SSHUSER@$SSHMACH:$SRVROOT
    $SSHEXEC "chown http:http $SRVROOT/$PKGARCH"
    rm $PKGARCH
}

function unpack() {
    $SSHEXEC "cd $SRVROOT &&" \
        "$SRVEXEC tar xzvf $SRVROOT/$PKGARCH"
    $SSHEXEC "cd $SRVROOT &&" \
        "$SRVEXEC rm $SRVROOT/$PKGARCH"
}

function build() {
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC ./setup.sh"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "cd notex/ && $SRVEXEC djboss -l DEBUG cssmin -p"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "cd notex/ && $SRVEXEC djboss -l DEBUG jsmin -p"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "$SRVEXEC ./manage.py syncdb --noinput"
}

function svcstop() {
    SHAPATHs=`$SSHEXEC "ls $SRVROOT/$APPPATH | egrep '^sha-.{7}$'"`
    for VALPATH in $SHAPATHs ; do
        $SSHEXEC "cd $SRVROOT/$APPPATH/$VALPATH &&" \
            "$SRVEXEC ./serve.sh stop-all"
    done
}

function relink() {
    $SSHEXEC "cd $SRVROOT/$APPPATH && rm sha-current -f &&" \
        "$SRVEXEC ln -s $SHAPATH sha-current"
}

function svcstart() {
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC ./serve.sh"
}

function cleanup() {
    SHAPATHs=`$SSHEXEC "ls $SRVROOT/$APPPATH | egrep '^sha-.{7}$'"`
    for VALPATH in $SHAPATHs ; do
        $SSHEXEC "cd $SRVROOT/$APPPATH/$VALPATH &&" \
            "$SRVEXEC tree -fi $SRVROOT/$APPPATH | egrep pyc$ | xargs -r rm"
    done

    $SSHEXEC "rm /var/cache/lighttpd/compress/* -rf"
    $SSHEXEC "rm /var/cache/pacman/pkg/* -rf"
    $SSHEXEC "dcfldd if=/dev/zero of=/fillfile bs=4M ; rm /fillfile"
    $SSHEXEC "dcfldd if=/dev/zero of=/home/fillfile bs=4M ; rm /home/fillfile"
}

function stopvm() {
    $SSHEXEC "shutdown -hF now"
}

function exportvm() {
    echo -n
}


###############################################################################
###############################################################################

function pretty() {
    seq -s "=" 80 | sed 's/[0-9]//g'
    echo "./$1: $2"
    seq -s "=" 80 | sed 's/[0-9]//g'
    eval $1
    echo "done"
}

pretty archive  "Exporting $GITREPO repository to $PKGARCH archive"
pretty startvm  "Starting virtual machine -- TODO"
pretty upload   "Copying $PKGARCH archive to VM/$SRVROOT"
pretty unpack   "[VM] Decompressing $PKGARCH archive"
pretty build    "[VM] Bulding $APPPATH/$SHAPATH"
pretty svcstop  "[VM] Stopping any service for $APPPATH"
pretty relink   "[VM] Relinking static & media with $APPPATH/$SHAPATH"
pretty svcstart "[VM] Starting $APPPATH/$SHAPATH service"
pretty cleanup  "[VM] Cleaning $APPPATH, caches plus HD pre-compacting"
pretty stopvm   "[VM] Shutting down virtual machine -- TODO"
pretty exportvm "Exporting VM as an applicance -- TODO"

###############################################################################
###############################################################################

exit 0

###############################################################################
###############################################################################
