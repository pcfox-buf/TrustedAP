pragma solidity ^0.7.3;
    // SPDX-License-Identifier: UNLICENSED
    
contract TrustedAP {

   ////////////////// variables and data structures //////////////////
   
    address chairperson;

    struct apDetails{ 
        bytes32 apDataHash;
        address owner;
        address chair;
    }
    
    struct challengeResponsePack{
        uint challengeSeed;
        bytes32 hashOfResponse;
        bytes32 hashOfPK;
        address challenger;
        address responder;
        uint state;
    }
    
    mapping (address=>apDetails) public apIdentifier;
    mapping (address=>challengeResponsePack) public getChalResp;
    mapping (address=>address) enstatedBy;
    mapping (address=>address) ownedBy;
    mapping (address=>address) registeredTo;
    
    
    //////////////////  modifiers  //////////////////

    modifier onlyChairperson{ 
        require(msg.sender==chairperson);
        _;
    }
    modifier onlyAdmins{ 
        require(msg.sender==chairperson || enstatedBy[msg.sender]!=address(0x0));
        _;
    }
    modifier onlyAP{ 
        require(ownedBy[msg.sender]!=address(0x0));
        _;
    }
    modifier validEndUser{ 
        require(msg.sender!=chairperson && registeredTo[msg.sender]!=address(0x62616e6973686564) && enstatedBy[msg.sender]==address(0x0));
        _;
    }
    modifier connectedEndUser{
        require(registeredTo[msg.sender]!=address(0x0) && registeredTo[msg.sender]!=address(0x62616e6973686564));
        _;
    }
    modifier newChallenge {
        require(getChalResp[msg.sender].state < 1);
        _;
    }
    
    
    //////////////////  constructor  //////////////////
    
    constructor() payable { 
        chairperson=msg.sender;
    }
    
    
    ////////////////////////////  event  ///////////////////////////  
    
    event ResponseLogged(address _chal, address _resp, bytes32 _pkha, bytes32 _rspha);
    
    
    //////////////////  Adminstrative Functions  //////////////////

    function enstate(address newManager) onlyChairperson public {
        enstatedBy[newManager]=msg.sender;
    }
    
    function unenstate(address formerManager) onlyChairperson public{
        enstatedBy[formerManager]=address(0x0);
    }
    
    function addAP(address newAP, bytes32 apDataHash) 
        onlyAdmins payable public{ 
        ownedBy[newAP]=msg.sender;
        apIdentifier[newAP]=apDetails(apDataHash, msg.sender, enstatedBy[msg.sender]);
    }
    
    function removeAP(address formerAP) onlyAdmins payable public{ 
        require(ownedBy[formerAP]!=address(0x0), "Not an AP");
        ownedBy[formerAP]=address(0x0);
        apIdentifier[formerAP]=apDetails(0x0,address(0x0),address(0x0));
    }
    
    function unregisterOther(address unregistrant) onlyAdmins public {
        registeredTo[unregistrant]=address(0x0);
        getChalResp[unregistrant].state=0;
    }
    
    function banish(address badActor) onlyAdmins public{
        registeredTo[badActor]=address(0x62616e6973686564);
    }
    
    function unbanish(address pardonedActor) onlyAdmins public{
        registeredTo[pardonedActor]=address(0x0);
    }
    
    
    //////////////////  End User-AP Exchanges  //////////////////
    
    function register (address targetAP) validEndUser payable public{ 
        require(ownedBy[targetAP]!=address(0x0), "Not an AP");
        registeredTo[msg.sender]=targetAP;
    }

    function unregisterSelf() connectedEndUser public{
        registeredTo[msg.sender]=address(0x0);
        getChalResp[msg.sender].state=0;
    }  
    
    // TODO: Consider implementation using external memory and application-layer connection
    function challenge(uint chSeed) connectedEndUser newChallenge payable public{
    	address targetAP = registeredTo[msg.sender]; 
        getChalResp[msg.sender]=challengeResponsePack(chSeed, 0x0, 0x0, msg.sender, targetAP, 1);
    }
    
    function response(address endUser, bytes32 respHash, bytes32 pkHash) onlyAP public{
        require (getChalResp[endUser].state == 1, "Challenge not issued");
        challengeResponsePack memory origChal = getChalResp[endUser];
        getChalResp[endUser]=challengeResponsePack(
            origChal.challengeSeed, respHash, pkHash, endUser, msg.sender, 2);
        
        emit ResponseLogged(endUser, msg.sender, respHash, pkHash);
    }
}
