App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: '',
  chairPerson:null,
  currentAccount:null,
  address: '0x13E9367e59C57AF0D6Ada6C462d7C523b1596212',

  init: function() {  
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

//      for (i = 0; i < data.length; i ++) {
//        proposalTemplate.find('.panel-title').text(data[i].name);
//        proposalTemplate.find('img').attr('src', data[i].picture);
//        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);

//        proposalsRow.append(proposalTemplate.html());
//        App.names.push(data[i].name);
//      }

    });
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);
    ethereum.enable();

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('./js/webLauncher.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var tapArtifact = data;
      App.contracts.tap = TruffleContract(tapArtifact);
      App.contracts.mycontract = data;
      
      // Set the provider for our contract
      App.contracts.tap.setProvider(App.web3Provider);
    
      App.getChairperson();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
	
    // $(document).on('click', '#enstate', function(){ var ad = $('#enter_manager').val(); App.handleEnstate(ad); });
    // $(document).on('click', '#unenstate', function(){ var ad = $('#enter_rem_manager').val(); App.handleUnenstate(ad); });
    // $(document).on('click', '#addAP', App.handleAddAP);
    // $(document).on('click', '#removeAP', function(){ var ad = $('#enter_rem_ap').val(); App.handleRemoveAP(ad); });
    // $(document).on('click', '#unregOther', function(){ var ad = $('#enter_unreg_other').val(); App.handleUnregisterOther(ad); });
    // $(document).on('click', '#banish', function(){ var ad = $('#enter_ban').val(); App.handleBanish(ad); });
    // $(document).on('click', '#unbanish', function(){ var ad = $('#enter_unban').val(); App.handleUnban(ad); });
    
    // $(document).on('click', '#register', function(){ var ad = $('#enter_register').val(); App.handleRegister(ad); });
    // $(document).on('click', '#unregister', function(){ var ad = $('#enter_unregister').val(); App.handleUnregisterSelf(ad); });
    // $(document).on('click', '#challenge', function(){ var ad = $('#enter_challenge').val(); App.handleChallenge(ad); });
	
    $(document).on('click', '#response', App.handleResponse);
    
    // $(document).on('click', '#getAP', function(){ var ad = $('#enter_ap_det').val(); App.handleGetAP(ad); });
	
    $(document).on('click', '#getChrsp', function(){ var ad = $('#enter_chrsp_det').val(); App.handleGetChrsp(ad); });
    
  },

  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          jQuery('#enter_address').append(optionElement);  
        }
      });
    });
  },


  getChairperson : function(){
    App.contracts.tap.deployed().then(function(instance) {
      return instance;
    }).then(function(result) {
      App.chairPerson = result.constructor.currentProvider.selectedAddress.toString();
      App.currentAccount = web3.eth.coinbase;
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div').css('display','none');
        jQuery('#register_div').css('display','none');
      }else{
        jQuery('#address_div').css('display','block');
        jQuery('#register_div').css('display','block');
      }
    })
  },

  /////////////////// Adminstrative Functions //////////////////////

  // handleEnstate: function(addr){
    // var mgrAddInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // mgrAddInstance = instance;
      // return mgrAddInstance.enstate(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert(" AP manager\n" + addr + "\nenstated successfully")
        // else
          // alert(addr + "\n AP manager enstate due to revert (check address)")
      // } else {
        // alert(addr + "\n AP manager enstate failed")
      // }   
    // });
  // },
  
  // // TODO: Consider external storage for removeAllAPs functionality  
  // handleUnnstate: function(addr){
    // var mgrRemInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // mgrRemInstance = instance;
      // return mgrRemInstance.unenstate(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("AP manager\n" +addr + "\n  unenstate successful")
        // else
          // alert(addr + "\n AP manager unenstate due to revert (check address)")
      // } else {
        // alert(addr + "\n AP manager unenstate failed")
      // }   
    // });
  // },
  
  // handleAddAP: function(event){
    // var addr = $("#enter_ap").val();
    // var details_hash = $("#enter_details").val();
    // App.contracts.tap
      // .deployed()
      // .then(function (instance) {
        // return instance.addAP(addr, details_hash);
      // })
      // .then(function (result) {
        // // console.log(result);
        // if (result && parseInt(result.receipt.status) == 1) {
          // //App.requests[reqId] = flightId;
          // //console.log("handleASKrequest: " + JSON.stringify(App.requests));
          // alert("Access point\n" + addr + "\nwith details:\n"+ details_hash +"\naddition successful")
        // } else {
          // alert("AP addition request error (check address)")
        // }
      // })
      // .catch(function (err) {
        // console.log(err);
        // alert("AP addition failed")
      // });
  // },
  
  // // TODO: Consider external storage for unregisterAllEndUsers functionality 
  // handleRemoveAP: function(addr){
    // var apRemInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // apRemInstance = instance;
      // return apRemInstance.removeAP(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("Access point\n" + addr + "\nremoval successful")
        // else
          // alert("AP removal request error (check address)")
      // } else {
        // alert("AP removal unenstate failed")
      // }   
    // });
  // },
  
  // handleUnregisterOther: function(addr){
    // var unregInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // unregInstance = instance;
      // return unregInstance.unregisterOther(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("End user\n" + addr + "\n unregistered")
        // else
          // alert(addr + "\n unregister error (check address)")
      // } else {
        // alert(addr + "\n unregister failed")
      // }   
    // });
  // },
  
  // handleBanish: function(addr){
    // var banInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // banInstance = instance;
      // return banInstance.banish(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("End user\m" + addr + "\n banished")
        // else
          // alert("Banish error (check address)")
      // } else {
        // alert("Banish failed")
      // }   
    // });
  // },
  
  // handleUnban: function(addr){
    // var unbanInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // unbanInstance = instance;
      // return unbanInstance.unbanish(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("End user\n" + addr + "\n pardoned")
        // else
          // alert("Pardon error (check address)")
      // } else {
        // alert("Pardon failed")
      // }   
    // });
  // },
  
  
  /////////////////// End-User-AP Exchanges //////////////////////

  // handleRegister: function(addr){
    // var apRegInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // apRegInstance = instance;
      // return apRegInstance.register(addr);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert(addr + "\n AP registration successful")
        // else
          // alert(addr + "\n AP registration request error (check address)")
      // } else {
        // alert(addr + "\n AP registration failed")
      // }   
    // });
  // },
  
  // handleUnregisterSelf: function(){
    // var apUnregInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // apUnregInstance = instance;
      // return apUnregInstance.unregisterSelf();
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert("Unregistration successful")
        // else
          // alert("Unregistration request error (check address)")
      // } else {
        // alert("Unregistration failed")
      // }   
    // });
  // },
  
  // handleChallenge: function(seed){
    // var chalInstance;
    // App.contracts.tap.deployed().then(function(instance) {
      // chalInstance = instance;
      // return chalInstance.challenge(seed);
    // }).then(function(result, err){
      // if(result){
        // if(parseInt(result.receipt.status) == 1)
          // alert(seed + "\n challenge issued")
        // else
          // alert("Error issuing challenge (check address)")
      // } else {
        // alert("Failure Issuing challenge")
      // }   
    // });
  // },

  handleResponse: function(event){
    var addr = $("#enter_chal_addr").val();
    var resp_hash = $("#enter_resp_hash").val();
    var pk_hash = $("#enter_pk_hash").val();
    App.contracts.tap
      .deployed()
      .then(function (instance) {
        return instance.response(addr, resp_hash, pk_hash);
      })
      .then(function (result) {
        if (result && parseInt(result.receipt.status) == 1) {
          alert("Response to\n" + addr + "\n successful")
        } else {
          alert(addr + "\n response error (check address)")
        }
      })
      .catch(function (err) {
        console.log(err);
        alert(addr + "\n response failed")
      });
  },

  ///////////////// Struct 'Getter' Functions ////////////////////

  // handleGetAP : function(addr) {
    // console.log("Return challenge response pack");
    // var getAPInstance;
    // var chair;
    // App.contracts.tap.deployed().then(function(instance) {
      // getAPInstance = instance;
      // return getAPInstance.apIdentifier(addr);
    // }).then(function(pack){
      // if (pack[2] == 0){
        // chair = "Same as AP Owner";
      // } else {
        // chair=pack[2];
      // }
      // alert(
        // "AP Details hash:\n" + pack[0] + "\n" +
        // "AP Owner:\n" + pack[1] + "\n" +
        // "Contract chairperson:\n" + chair);
    // }).catch(function(err){
      // alert(addr + "\n AP Details retrieve failed\n" + err)
    // })
  // },

  handleGetChrsp : function(addr) {
    console.log("Return challenge response pack");
    var getChrspInstance;
    var status;
    App.contracts.tap.deployed().then(function(instance) {
      getChrspInstance = instance;
      return getChrspInstance.getChalResp(addr);
    }).then(function(pack){
      if (pack[5] == 1) {
        status = "Challenge initiated";
      } else if (pack[5] == 2) {
        status = "Response Recorded";
      } else {
        status = "Uninitiated/Reset";
      }
      
      alert(
        "Challenge seed:\n" + pack[0] + "\n" +
        "Hash of AP response:\n" + pack[1] + "\n" +
        "Hash of public key:\n" + pack[2] + "\n" +
        "Challenger address:\n" + pack[3] + "\n" +
        "Responder address:\n" + pack[4] + "\n" +
        "Challenge staus: " + status);
    }).catch(function(err){
      alert(addr + "\n Challenge-Response retrieve failed\n" + err)
    })
  },

showNotification: function (text, type) {
    toastr.info(text, "", {
      iconClass: "toast-info notification" + String(type),
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-bottom-full-width",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "500",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
  });
});
