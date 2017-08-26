#!/bin/bash

set -e

REMOTE_IP=192.168.0.30
REMOTE_DIR=/var/multicloud/multi-cloud-config-assistant
PACKAGE_NAME=multicloud-config-assistant.tar.gz

npm run dist
tar -zcf $PACKAGE_NAME ./bins ./node_modules ./configs ./lib
#scp $PACKAGE_NAME root@$REMOTE_IP:$REMOTE_DIR
#rm -f $PACKAGE_NAME
