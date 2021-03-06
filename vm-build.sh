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

COMMAND=${1-"update"} ## update|export|cleanup
EDITION=${2-"ncjk"} ## ncjk|intl
PIPOPTS=${3} ## e.g. --upgrade
OVAPATH=${4-"../notex.pkg"}

SHAONEs=$(git rev-parse --short master)
SHAPATH="sha-$SHAONEs"

VERSION="v$(date +'%Y-%m-%d').$SHAONEs.$EDITION"
OVAFILE="notex.$VERSION.ova"
VIRMACH="notex.$EDITION"

###############################################################################
###############################################################################

function startvm() {
    VMSTATE=$(VBoxManage showvminfo $VIRMACH --machinereadable \
        | grep "^VMState=" \
        | cut -d'=' -f2)

    if [ $VMSTATE == '"running"' ] ; then
        VBoxManage controlvm $VIRMACH poweroff && while [ 1 ] ; do
            VMSTATE=$(VBoxManage showvminfo $VIRMACH --machinereadable \
                | grep "^VMState=" \
                | cut -d'=' -f2)

            if [ $VMSTATE != '"poweroff"' ] ; then
                sleep 5.000
            else
                sleep 5.000 && break
            fi
        done
    fi

    VBoxManage startvm --type headless $VIRMACH
}

function archive() {
    rm /tmp/notex.tmp -rf && mkdir -p /tmp/notex.tmp/$(pwd)
    git archive master | tar -x -C /tmp/notex.tmp/$(pwd)
    git submodule update --init --recursive
    git submodule foreach --recursive \
        'git archive $sha1 | tar -x -C /tmp/notex.tmp/$toplevel/$path'
    rm $APPPATH -rf && mkdir $APPPATH
    mv /tmp/notex.tmp/$(pwd) $APPPATH/$SHAPATH
    rm /tmp/notex.tmp
    tar czvf $PKGARCH $APPPATH/$SHAPATH
    rm $APPPATH -r
}

function upload() {
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
        "$SRVEXEC mkdir -p ../sha-0000000"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC mkdir -p ../sha-0000000/bin &&" \
        "$SRVEXEC ln -sf ../sha-0000000/bin"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC mkdir -p ../sha-0000000/include &&" \
        "$SRVEXEC ln -sf ../sha-0000000/include"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC mkdir -p ../sha-0000000/lib &&" \
        "$SRVEXEC ln -sf ../sha-0000000/lib"

    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "$SRVEXEC ./setup.sh $PIPOPTS"

    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "cd notex/ && $SRVEXEC ../bin/python ../bin/djboss -l DEBUG cssmin -p"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "cd notex/ && $SRVEXEC ../bin/python ../bin/djboss -l DEBUG jsmin -p"
    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH && source bin/activate &&" \
        "$SRVEXEC ./manage.py syncdb --noinput"

    $SSHEXEC "cd $SRVROOT/$APPPATH/$SHAPATH &&" \
        "cat issue.tpl | sed s/VERSION/$VERSION/ > issue.tmp &&" \
        "sudo cp issue.tmp /etc/issue && rm issue.tmp"
}

function svcstop() {
    SHAPATHs=`$SSHEXEC "ls $SRVROOT/$APPPATH |" \
        "egrep -v '^sha-0000000$' | egrep -e '^sha-.{7}$'"`

    for VALPATH in $SHAPATHs ; do
        $SSHEXEC "cd $SRVROOT/$APPPATH/$VALPATH &&" \
            "$SRVEXEC ./serve.sh stop-all"
    done
}

function relink() {
    $SSHEXEC "cd $SRVROOT/$APPPATH &&" \
        "readlink -f sha-current | xargs rm -rf &&" \
        "rm sha-current -f &&" \
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

    $SSHEXEC "cd $SRVROOT/$APPPATH/sha-current && source bin/activate &&" \
        "$SRVEXEC ./manage.py cleanup -ae \"$(date +'%Y-%m-%d %H:%M:%S')\""

    $SSHEXEC "rm /var/cache/lighttpd/compress/* -rf"
    $SSHEXEC "rm /var/cache/pacman/pkg/* -rf"
    $SSHEXEC "dcfldd if=/dev/zero of=/fillfile bs=4M ; rm /fillfile"
    $SSHEXEC "dcfldd if=/dev/zero of=/home/fillfile bs=4M ; rm /home/fillfile"
    $SSHEXEC "rm /root/.bash_history -f"
    $SSHEXEC "rm /home/user/.bash_history -f"
}

function stopvm() {
    $SSHEXEC "shutdown -hF now" && while [ 1 ] ; do
        VMSTATE=$(VBoxManage showvminfo notex.ncjk --machinereadable \
            | grep "^VMState=" \
            | cut -d'=' -f2)

        if [ $VMSTATE != '"poweroff"' ] ; then
            sleep 7.500
        else
            sleep 7.500 && break
        fi
    done
}

function exportvm() {
    mkdir -p $OVAPATH && \
    VBoxManage export --vsys 0 \
        --product "NoTex - A restructured text editor" \
        --producturl "http://notex.ch" --vendor "Blackhan.ch" \
        --vendorurl "http://blackhan.ch" \
        --version $VERSION \
        --eulafile gpl-3.0.txt \
        --manifest $VIRMACH \
        --output $OVAPATH/$OVAFILE
}

function snapshotvm() {
    VBoxManage snapshot $VIRMACH take $VERSION
}

function relinkcur() {
    cd $OVAPATH && \
    rm -f notex.current.$EDITION.ova && \
    ln -s $OVAFILE notex.current.$EDITION.ova && \
    chmod +r $OVAFILE
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

if [ $COMMAND == "cleanup" ] ; then
pretty cleanup    "[VM] Cleaning $APPPATH, caches plus HD pre-compacting"
else
pretty startvm    "Starting virtual machine"
if [ $COMMAND == "update" ] ; then
pretty archive    "Exporting $GITREPO repository to $PKGARCH archive"
pretty upload     "Copying $PKGARCH archive to $SRVROOT on virtual machine"
pretty unpack     "[VM] Decompressing $PKGARCH archive"
pretty build      "[VM] Bulding $APPPATH/$SHAPATH"
pretty svcstop    "[VM] Stopping any service for $APPPATH"
pretty relink     "[VM] Relinking static & media with $APPPATH/$SHAPATH"
pretty svcstart   "[VM] Starting $APPPATH/$SHAPATH service"
fi
pretty cleanup    "[VM] Cleaning $APPPATH, caches plus HD pre-compacting"
pretty stopvm     "[VM] Shutting down virtual machine"
pretty exportvm   "Exporting $VERSION as an appliance"
if [ $COMMAND == "update" ] ; then
pretty snapshotvm "Creating snapshot for $VERSION"
pretty relinkcur  "Updating current link to $VERSION"
fi
fi

###############################################################################
###############################################################################

exit 0

###############################################################################
###############################################################################
