#!/bin/bash

TEMP1=/tmp/tap-ap-address.txt
TEMP2=/tmp/tap-client-netpack.txt
TEMP3=/tmp/enc-netpack.txt

SPORT=4040
CPORT=4041
SERVER=10.14.14.2

APKEY=/tmp/apkey.txt
APPACK=/tmp/appack.txt

ACK=''

echo "TAP Client listener blocking for AP address"
nc -l $SPORT > $TEMP1

echo '*******************************************'
while IFS= read -r line
do
	echo "Register to the following address"
	echo $line
done < $TEMP1

read -p "Press enter to continue."

rm -r $TEMP1
echo -n "ACK" | nc -q 0 $SERVER $CPORT

arp -a | head -1 > $TEMP2
ip r | head -2 >> $TEMP2

# Challenge AP

#echo "Preparing netpack"
#while IFS= read -r line
#do
#	echo $line
#done < $TEMP2

openssl genrsa -out ./client-offchain/pair.pem 2048
openssl rsa -in ./client-offchain/pair.pem -out ./client-offchain/pub.pem -outform PEM -pubout
openssl rsautl -sign -inkey ./client-offchain/pair.pem -in $TEMP2 -out $TEMP3

rm -r $TEMP2

nc -q 0 $SERVER $CPORT < ./client-offchain/pub.pem
sleep 0.2
nc -q 0 $SERVER $CPORT < $TEMP3
while [[ -z $ACK ]]
do
	ACK=$(nc -l $SPORT)
done
echo "Server ACKs enc netpack and key. Cleaning up."
ACK=''
rm $TEMP3
rm ./client-offchain/*

# Await response

nc -l $SPORT > $APKEY
nc -l $SPORT > $APPACK
echo -n "ACK" | nc -q 0 $SERVER $CPORT

openssl rsautl -verify -inkey $APKEY -pubin -in $APPACK > ./client-offchain/ap-token.txt

echo "*******************************************"
echo "Verify hashes on blockchain:"
cat $APKEY | openssl dgst -sha3-256 | sed 's/(stdin)= /0x/g'
cat $APPACK | openssl dgst -sha3-256 | sed 's/(stdin)= /0x/g'
echo "*******************************************"
echo "Validate decrypted AP network token:"
while IFS= read -r line
do
	echo $line
done < ./client-offchain/ap-token.txt
echo "*******************************************"
echo "Adjudicate connection based on above"
