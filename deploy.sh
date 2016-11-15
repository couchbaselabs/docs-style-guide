#!/usr/bin/env bash

# Build
if [[ ${1} = "build" ]]; then

	if [[ ${2} = "mobile" ]]; then
		echo "Building Mobile..."
	fi
	
	if [[ ${2} = "server" ]]; then
		echo "Building Server..."
		cd $DOCS_PATH
		cd content
		$DITA_PATH -f html5 -i $DOCS_PATH/content/cb-docs.ditamap -o tmp
	fi
	
fi


if [ -z "$JENKINS_USERNAME" ]; then
	echo "Must set the JENKINS_USERNAME environment variable"
	exit 0
fi

if [ -z "$JENKINS_PASSWORD" ]; then
	echo "Must set the JENKINS_PASSWORD environment variable"
	exit 0
fi

ditto -c -k --sequesterRsrc --keepParent "tmp" "tmp.zip"

rm -rf tmp

echo "
cd uploads/${2}
put tmp.zip
" > push.sh

sftp -b push.sh -oIdentityFile=~/.ssh/cb_xfer_id_rsa cb_xfer@54.175.181.113

# Trigger Jenkins job
curl -X POST "http://$JENKINS_USERNAME:$JENKINS_PASSWORD@build-ingestion.cbauthx.com/job/CouchbaseDocumentationJobs/job/${3}/job/${4}/build\?delay\=0sec"