#!/bin/bash
TEMP1=/tmp/pub.pem
TEMP2=/tmp/cpt.txt

SPORT=4040
CPORT=4041

CLIENT=10.14.14.10
RUNNING=true

ACK=''

echo 'Engaging TrustedAP Server'

while [[ -z $ACK ]]
do
	nc -q 0 $CLIENT $SPORT < introfile.txt
	echo '-attempt-'
	ACK=$(timeout 5 nc -l $CPORT)
done
ACK=''

echo "Address sent and ACKed from Client"
nc -l $CPORT > $TEMP1
nc -l $CPORT > $TEMP2
echo -n "ACK" | nc -q 0 $CLIENT $SPORT

openssl rsautl -verify -inkey $TEMP1 -pubin -in $TEMP2 > client-token.txt
rm $TEMP1 $TEMP2

echo "Verify client network token:"
while IFS= read -r line
do
	echo $line
done < client-token.txt
