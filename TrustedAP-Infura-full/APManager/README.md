/////////////////////////////////////////////
// TrustedAP-Dapp/TrustedAP-app/APManager-app
// Author: Phil Fox (pcfox@buffalo.edu)

Dependencies: 
	Each listed in ../TrustedAP-contract/README.md
	[automatically installed via package.json]
		npm express
		npm node-rsa
		npm keccak256

The following steps enable the application layer interface of TrustedAP:
	from the current working directory:

1. Contact pcfox@buffalo.edu to add a Ropsten-funded ethereum account 
	for an AP Manager role or AP device.
2. Execute:
	$ npm install
	$ npm start
3. Open Google Chrome Browser
4. Navigate to 127.0.0.1:3010 (i.e. localhost:3010)
5. Open Metamask using said funded Ropsten TestNet Account
6. (Optional) start a client webserver at ../EndUser/

You are encouraged to contact the author with any questions or requests. 
	Thank you for using TrustedAP!
