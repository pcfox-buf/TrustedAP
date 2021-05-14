///////////////////////////////////////////////////////////
// TrustedAP-Dapp/TrustedAP-app (Public Ropsten deployment)
// Author: Phil Fox (pcfox@buffalo.edu)
//
	The following app deploys and functions on the Ropsten TestNet 
	blockchain via Infura.io under contract address:
	 
	0x9FC1E85FAd9034597B37BcA4eD2dab37849eb161

	0. AllFeatures (Matches Phase 5 submission)
		port 3000 [Chairperson (deployer) address: 
		0x90dB22c5014fcF6471e58D3D7e7E463E44EEd754]
	
	Please see 
		AllFeatures/TrustedAP-app/README.md 
	for remaining testing instructions.

	1. APManager (Add/Remove APs, Banish/Unbanish/Unregister End Users)
		port 3010. ['Enstated' by chairperson: pcfox@buffalo.edu]
	2. APEndpoint (Respond to End User Challenges)
		port 3020. ['Added' by AP Managers (or chairperson)]
	3. EndUser (Register/Unregister to AP Endpoints, Challenge AP 
	Endpoints)
		port 3030. [May register to any added AP]

You are encouraged to contact the author with any questions or requests. 
	Thank you for using TrustedAP!
