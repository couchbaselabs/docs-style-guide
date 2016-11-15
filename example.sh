#!/usr/bin/env bash

cp -r example tmp

ditto -c -k --sequesterRsrc --keepParent "tmp" "tmp.zip"

rm -rf tmp

echo "
cd uploads/mobile
put tmp.zip
" > push.sh

sftp -b push.sh -oIdentityFile=~/.ssh/cb_xfer_id_rsa cb_xfer@54.175.181.113

if [ -z "$JENKINS_USERNAME" ]; then
	echo "Must set the JENKINS_USERNAME environment variable"
	exit 0
fi

if [ -z "$JENKINS_PASSWORD" ]; then
	echo "Must set the JENKINS_PASSWORD environment variable"
	exit 0
fi

curl -X POST "http://$JENKINS_USERNAME:$JENKINS_PASSWORD@build-ingestion.cbauthx.com/job/CouchbaseDocumentationJobs/job/Mobile/job/IngestQA/build\?delay\=0sec"