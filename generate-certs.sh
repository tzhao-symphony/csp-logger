CERT_FOLDER=./certs
CERT_FILE=${CERT_FOLDER}/cert.crt
KEY_FILE=${CERT_FOLDER}/cert.key
mkdir -p $CERT_FOLDER
openssl req -subj "/C=US/ST=CA/O=symphony/OU=df2/CN=symphony.com" -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ${KEY_FILE} -out ${CERT_FILE}
