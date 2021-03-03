///////////////////////////////////////////////////////////////
// TrustedAP-Dapp/TrustedAP-contract
// Author: Phil Fox (pcfox@buffalo.edu)

Dependencies (Current versions as of Nov 7, 2020): 
Truffle,
Ganache,
Metamask,
Remix IDE,
Google Chrome Browser

The following steps enable blockchain emulation for TrustedAP-Dapp when executed
	from the current working directory:

1. Start Ganache
2. Select Quickstart
3. Import passphrase mnemonic to Metamask configured for Ganache
	RPC URL 127.0.0.1:7545; Chain ID 0x539; Symbol ETH 
	Add up to 10 accounts as needed
4. Connect Metamask and accounts to Remix IDE
5. Upload TrustedAP.sol source to Remix
6. In the current working directory execute:
	$ truffle compile
	$ truffle migrate --reset
7. a) [Smart contract only deployment] Copy 'Contract address' from stdout to 
	Remix 'AtAddress'
7. b) [Web deployment] Follow steps in ../TrustedAP-app/README.md

Please contact the author with any questions or requests. Thank you for using
	TrustedAP!
