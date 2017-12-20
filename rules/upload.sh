#!/usr/bin/env bash
TMP=tmp

rm -rf tmp
mkdir tmp

echo "Moving content to tmp folder..."
cp -R src/ ${TMP}/

echo "Zipping..."	
ditto -c -k --sequesterRsrc --keepParent "${TMP}" "tmp.zip"
echo "Uploading..."
echo "
cd uploads/mobile
put tmp.zip
" > push.sh

sftp -b push.sh -oIdentityFile=~/.ssh/couchbase_sftp.key couchbaseinc@static.hosting.onehippo.com

API_KEY="${HIPPO_API_KEY}"
SITE_URL="https://developer.couchbase.com/restservices/documentation/"
allErrors=""

echo "Processing ingestion folder"
r=$(curl -sk --data "api-key=${API_KEY}&uploadPath=/uploads/mobile" ${SITE_URL}push)
if [[ $r != *"SUCCESS"* ]]
then
	allErrors=$allErrors$'\n'$r
else
	taskId=$(echo $r | python -c "import sys, json; print json.load(sys.stdin)['payload']")
	echo "task Id: $taskId"
	while [[ ! -z $taskId ]]
	do
		sleep 5
		r=$(curl -sk "${SITE_URL}status?api-key=${API_KEY}&taskId=$taskId")
		if [[ $r != *"SUCCESS"* ]]
		then
			allErrors=$allErrors$'\n'$r
			break
		else
			status=$(echo $r | python -c "import sys, json; print json.load(sys.stdin)['status']")
			if [[ $status != "0" ]];then
				echo $r | python -c "import sys, json; print json.load(sys.stdin)['payload']"
			else
				echo $r
				break
			fi
		fi
	done
fi

if [[ $allErrors != "" ]];then
		echo "***There were errors detected in the ingestion process.***"
		echo "***Reported Errors:  $allErrors"
		exit 42
fi