#!/bin/sh

set -e

S3_CONFIG=/etc/seaweedfs/s3.json

cat << JSON > "$S3_CONFIG"
{
  "identities": [
    {
      "name": "$BUCKET_NAME-user",
      "credentials": [
        {"accessKey": "$BUCKET_ACCESS_KEY", "secretKey": "$BUCKET_SECRET_KEY"}
      ],
      "actions": ["Read:$BUCKET_NAME", "Write:$BUCKET_NAME", "List:$BUCKET_NAME"]
    }
  ]
}
JSON
chmod 644 "$S3_CONFIG"

# Upload the mounted notebook once the server is up.
# Runs in the background because `exec` below replaces this shell.
(
  SRC=/notebook.ipynb
  NAME="6c59fd8d-ffd1-4449-80df-218b38f9ad23_Some_notebook.ipynb"
  DEST="http://127.0.0.1:9002/buckets/$BUCKET_NAME/files/"

  # filer.copy keeps the source filename, so stage a renamed copy.
  STAGE=$(mktemp -d)
  cp "$SRC" "$STAGE/$NAME"

  for i in $(seq 1 60); do
    if weed filer.copy "$STAGE/$NAME" "$DEST" >/dev/null 2>&1; then
      echo "catalogue-s3: uploaded $NAME to $BUCKET_NAME/files/"
      rm -rf "$STAGE"
      exit 0
    fi
    sleep 1
  done

  echo "catalogue-s3: failed to upload $NAME after 60 attempts" >&2
  rm -rf "$STAGE"
  exit 1
) &

exec /entrypoint.sh mini \
  -dir=/data \
  -ip=127.0.0.1 \
  -ip.bind=127.0.0.1 \
  -master.telemetry=false \
  -s3.port=9000 \
  -s3.config="$S3_CONFIG" \
  -s3.port.iceberg=0 \
  -s3.port.lance=0 \
  -admin.port=9001 \
  -admin.port.legacy=0 \
  -admin.user="$S3_ROOT_USER" \
  -admin.password="$S3_ROOT_PASSWORD" \
  -filer.port=9002 \
  -webdav=false \
  -bucket="$BUCKET_NAME"
