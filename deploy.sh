#!/usr/bin/env bash

cp -r example tmp

ditto -c -k --sequesterRsrc --keepParent "tmp" "tmp.zip"

rm -rf tmp

echo "
cd uploads/mobile
put tmp.zip
" > push.sh

sftp -b push.sh -oIdentityFile=~/.ssh/cb_xfer_id_rsa cb_xfer@54.175.181.113