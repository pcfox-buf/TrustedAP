#!/bin/bash
TEMP1=/tmp/pub.pem
TEMP2=/tmp/cpt.txt

TEMP3=/tmp/tap-ap-output.txt
TEMP4=/tmp/tap-ap-netpack.txt

SPORT=4040
CPORT=4041

CLIENT=10.14.14.10
RUNNING=true

ACK=''

echo 'Engaging TrustedAP Server'

while [[ -z $ACK ]]
do
	nc -q 0 $CLIENT $SPORT < ./ap-offchain/addressfile.txt
	echo '-attempt-'
	ACK=$(timeout 5 nc -l $CPORT)
done
ACK=''

echo "Address sent, client ACKs, challenges"
nc -l $CPORT > $TEMP1
nc -l $CPORT > $TEMP2
echo -n "ACK" | nc -q 0 $CLIENT $SPORT

openssl rsautl -verify -inkey $TEMP1 -pubin -in $TEMP2 > ./ap-offchain/client-token.txt
rm $TEMP1 $TEMP2

# Bidirectional challenge response bypassed
#echo "Verify client network token:"
#while IFS= read -r line
#do
#	echo $line
#done < ./ap-offchain/client-token.txt

# Respond

echo "Preparing response netpack"

arp -a | head -1 > $TEMP3
ip r | head -2 >> $TEMP3

openssl genrsa -out ./ap-offchain/pair.pem 2048
openssl rsa -in ./ap-offchain/pair.pem -out ./ap-offchain/pub.pem -outform PEM -pubout
openssl rsautl -sign -inkey ./ap-offchain/pair.pem -in $TEMP3 -out $TEMP4
echo '*********************************************'
echo 'Post the following hashes to the blockchain:'
cat ./ap-offchain/pub.pem | openssl dgst -sha3-256 | sed 's/(stdin)= /0x/g'
cat $TEMP4 | openssl dgst -sha3-256 | sed 's/(stdin)= /0x/g'
echo '*********************************************'
read -p "Press enter to continue"

nc -q 0 $CLIENT $SPORT < ./ap-offchain/pub.pem
sleep 0.2
nc -q 0 $CLIENT $SPORT < $TEMP4
while [ -z $ACK ]
do
	ACK=$(nc -l $CPORT)
done
echo "Client ACKs enc netpack and key. Cleaning up."

rm $TEMP3
rm $TEMP4
rm ./ap-offchain/pub.pem
rm ./ap-offchain/pair.pem
