CERT_FOLDER=./certs
CERT_FILE=${CERT_FOLDER}/csp-logger.crt
KEY_FILE=${CERT_FOLDER}/csp-logger.key
mkdir -p $CERT_FOLDER
openssl req -subj "/C=US/ST=CA/O=symphony/OU=startpage/CN=symphony.com" \
-addext "subjectAltName=DNS:*.startpage.local,DNS:*.symphony.com,DNS:localhost" \
-x509 \
-nodes \
-days 3650 \
-newkey rsa:2048 \
-keyout ${KEY_FILE} \
-out ${CERT_FILE}
