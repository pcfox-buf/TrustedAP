#!/bin/bash

TEMP1=/tmp/tap-client-output.txt
TEMP2=/tmp/tap-client-netpack.txt
TEMP3=/tmp/enc.txt

SPORT=4040
CPORT=4041
SERVER=10.14.14.2

ACK=''

echo "TAP Client listener blocking for AP address"
nc -l $SPORT > $TEMP1

while IFS= read -r line
do
	echo "Register to the following address"
	echo $line
done < $TEMP1
rm -r $TEMP1
echo -n "ACK" | nc -q 0 $SERVER $CPORT

arp -a | head -1 > $TEMP2
ip r | head -2 >> $TEMP2

echo "Preparing the following netpack"
while IFS= read -r line
do
	echo $line
done < $TEMP2

openssl genrsa -out ./client-offchain/pair.pem 2048
openssl rsa -in pair.pem -out ./client-offchain/pub.pem -outform PEM -pubout
openssl rsautl -sign -inkey ./client-offchain pair.pem -in $TEMP2 -out $TEMP3

rm -r $TEMP2

nc -q 0 $SERVER $CPORT < ./offchain/pub.pem
sleep 0.2
nc -q 0 $SERVER $CPORT < $TEMP3
while [ -z $ACK ]
do
	ACK=$(nc -l $SPORT)
done
echo "Server ACKs enc netpack and key"
